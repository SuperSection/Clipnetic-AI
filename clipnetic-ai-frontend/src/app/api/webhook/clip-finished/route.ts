import { type NextRequest, NextResponse } from "next/server";
import { inngest } from "~/inngest/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uploaded_file_id, error } = body;

    if (!uploaded_file_id) {
      return NextResponse.json(
        { error: "Missing uploaded_file_id" },
        { status: 400 },
      );
    }

    // Send completion event to Inngest
    await inngest.send({
      name: "clipnetic-ai/processing-complete",
      data: {
        uploadedFileId: uploaded_file_id,
        error: error ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
