"use server";

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { env } from "~/env";
import { inngest } from "~/inngest/client";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function processVideo(uploadedFileId: string) {
  const uploadedVideo = await db.uploadedFile.findUniqueOrThrow({
    where: {
      id: uploadedFileId,
    },
    select: {
      id: true,
      uploaded: true,
      userId: true,
    },
  });

  if (uploadedVideo.uploaded) return;

  await inngest.send({
    name: "clipnetic-ai/process-video",
    data: {
      uploadedFileId: uploadedVideo.id,
      userId: uploadedVideo.userId,
    },
  });

  await db.uploadedFile.update({
    where: {
      id: uploadedVideo.id,
    },
    data: {
      uploaded: true,
    },
  });

  revalidatePath("/dashboard");
}

type ClipPlayUrlResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function getClipPlayUrl(
  clipId: string,
): Promise<ClipPlayUrlResponse> {
  const session = await auth();
  if (!session?.user.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const clip = await db.clip.findUniqueOrThrow({
      where: {
        id: clipId,
        userId: session.user.id,
      },
    });

    const s3Client = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: clip.s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      success: true,
      url: signedUrl,
    };
  } catch (error) {
    console.error("Failed to generate play URL:", error);
    return {
      success: false,
      error: "Failed to generate play URL",
    };
  }
}
