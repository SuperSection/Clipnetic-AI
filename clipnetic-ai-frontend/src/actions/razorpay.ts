"use server";

import Razorpay from "razorpay";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { env } from "~/env";
import crypto from "crypto";


export type PriceId = "small" | "medium" | "large";

const PACKAGE_CONFIG = {
  small: { credits: 50, amount: 6999 }, // ₹49.99
  medium: { credits: 150, amount: 17499 }, // ₹125.99
  large: { credits: 500, amount: 35999 }, // ₹359.99
} as const;


// Initialize Razorpay instance with your credentials
const razorpay = new Razorpay({
  key_id: env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: env.RAZORPAY_SECRET_KEY,
});


export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  userEmail: string;
  userName: string;
  credits: number;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  credits: number;
}


export async function createRazorpayOrder(priceId: PriceId) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const packageInfo = PACKAGE_CONFIG[priceId];
  if (!packageInfo) {
    throw new Error("Invalid package");
  }

  const user = await db.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { email: true, name: true },
  });

  const order = await razorpay.orders.create({
    amount: packageInfo.amount,
    currency: "INR",
    receipt: `order_${Date.now()}`,
    notes: {
      userId: session.user.id,
      priceId,
      credits: packageInfo.credits.toString(),
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    userEmail: user.email,
    userName: user.name,
    credits: packageInfo.credits,
  };
}


export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const session = await auth();
  if (!session?.user.id) {
    throw new Error("Unauthorized");
  }

  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_SECRET_KEY)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new Error("Invalid payment signature");
  }

  // Get order details from Razorpay
  const order = await razorpay.orders.fetch(orderId);
  const credits = parseInt(order.notes.credits);

  // Add credits to user
  await db.user.update({
    where: { id: session.user.id },
    data: {
      credits: {
        increment: credits,
      },
    },
  });

  return { success: true, credits };
}
