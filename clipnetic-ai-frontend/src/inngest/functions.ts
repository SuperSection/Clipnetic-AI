import { env } from "~/env";
import { inngest } from "./client";
import { db } from "~/server/db";
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

type ProcessVideoEvent = {
  uploadedFileId: string;
  userId: string;
};

export const processVideo = inngest.createFunction(
  {
    id: "process-video",
    retries: 1,
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
  },
  {
    event: "clipnetic-ai/process-video",
  },
  async ({ event, step }) => {
    const { uploadedFileId } = event.data as ProcessVideoEvent;

    try {
      const { userId, credits, s3Key } = await step.run(
        "check-credits",
        async () => {
          const uploadedFile = await db.uploadedFile.findUniqueOrThrow({
            where: {
              id: uploadedFileId,
            },
            select: {
              user: {
                select: {
                  id: true,
                  credits: true,
                },
              },
              s3Key: true,
            },
          });

          return {
            userId: uploadedFile.user.id,
            credits: uploadedFile.user.credits,
            s3Key: uploadedFile.s3Key,
          };
        },
      );

      if (credits > 0) {
        await step.run("set-status-processing", async () => {
          await db.uploadedFile.update({
            where: {
              id: uploadedFileId,
            },
            data: {
              status: "processing",
            },
          });
        });

        await step.run("trigger-processing", async () => {
          const res = await fetch(
            `${env.NEXT_PUBLIC_BASE_URL}/api/process-video`,
            {
              method: "POST",
              body: JSON.stringify({
                s3_key: s3Key,
                uploaded_file_id: uploadedFileId,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!res.ok) {
            throw new Error(`Failed to trigger processing: ${res.statusText}`);
          }
        });

        const completionEvent = await step.waitForEvent("wait-for-completion", {
          event: "clipnetic-ai/processing-complete",
          match: "data.uploadedFileId",
          timeout: "10m",
        });

        const { clipsFound } = await step.run(
          "create-clips-in-db",
          async () => {
            const folderPrefix = s3Key.split("/")[0]!;

            const allKeys = await listS3ObjectsByPrefix(folderPrefix);

            const clipKeys = allKeys.filter(
              (key): key is string =>
                key !== undefined && !key.endsWith("original.mp4"),
            );

            if (clipKeys.length > 0) {
              await db.clip.createMany({
                data: clipKeys.map((clipKey) => ({
                  s3Key: clipKey,
                  uploadedFileId,
                  userId,
                })),
              });
            }

            return { clipsFound: clipKeys.length };
          },
        );

        await step.run("deduct-credits", async () => {
          await db.user.update({
            where: { id: userId },
            data: {
              credits: {
                decrement: Math.min(credits, clipsFound),
              },
            },
          });
        });

        await step.run("set-status-processed", async () => {
          await db.uploadedFile.update({
            where: { id: uploadedFileId },
            data: { status: "processed" },
          });
        });
      } else {
        await step.run("set-status-no-credits", async () => {
          await db.uploadedFile.update({
            where: {
              id: uploadedFileId,
            },
            data: {
              status: "no-credits",
            },
          });
        });
      }
    } catch (error) {
      await db.uploadedFile.update({
        where: {
          id: uploadedFileId,
        },
        data: {
          status: "failed",
        },
      });
      console.error("Failed to process video in queue:", error);
    }
  },
);

async function listS3ObjectsByPrefix(prefix: string) {
  const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const listCommand = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await s3Client.send(listCommand);
  return response.Contents?.map((item) => item.Key).filter(Boolean) ?? [];
}
