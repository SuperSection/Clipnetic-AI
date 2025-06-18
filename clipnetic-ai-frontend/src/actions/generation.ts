"use server";

import { inngest } from "~/inngest/client";
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
      id: uploadedVideo.id
    },
    data: {
      uploaded: true,
    },
  });
}
