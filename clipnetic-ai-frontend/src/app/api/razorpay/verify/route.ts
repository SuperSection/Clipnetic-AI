import { type NextRequest, NextResponse } from "next/server";
import { verifyPayment } from "~/actions/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json() as {
      orderId: string;
      paymentId: string;
      signature: string;
    };

    const result = await verifyPayment(orderId, paymentId, signature);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 400 }
    );
  }
}
