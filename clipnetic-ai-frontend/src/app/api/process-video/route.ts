import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { s3_key, uploaded_file_id } = body;

    if (!s3_key || !uploaded_file_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Call your backend API directly
    const res = await fetch(env.PROCESS_VIDEO_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        s3_key,
        uploaded_file_id,
        webhook_url: `${env.NEXT_PUBLIC_BASE_URL}/api/webhook/clip-finished`,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.PROCESS_VIDEO_ENDPOINT_AUTH}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Backend failed: ${res.statusText}`);
    }

    return NextResponse.json({ message: "Processing started" });
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Failed to start video processing" },
      { status: 500 },
    );
  }
}
