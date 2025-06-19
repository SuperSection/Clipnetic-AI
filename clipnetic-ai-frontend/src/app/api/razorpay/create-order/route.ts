import { type NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder, type PriceId } from "~/actions/razorpay";

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json() as { priceId: PriceId };

    const orderData = await createRazorpayOrder(priceId);

    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
