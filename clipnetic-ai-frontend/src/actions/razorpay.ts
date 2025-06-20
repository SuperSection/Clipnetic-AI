"use server";

import Razorpay from "razorpay";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { env } from "~/env";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export type PriceId = "small" | "medium" | "large";

const PACKAGE_CONFIG = {
  small: { credits: 50, amount: 4999 }, // ₹49.99
  medium: { credits: 150, amount: 12599 }, // ₹125.99
  large: { credits: 500, amount: 35999 }, // ₹359.99
} as const;

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
  userName: string | null;
  credits: number;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  credits: number;
}

export async function createRazorpayOrder(
  priceId: PriceId,
): Promise<RazorpayOrderResponse> {
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

  // Initialize Razorpay instance with your credentials
  const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_SECRET_KEY,
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
    amount: Number(order.amount),
    currency: order.currency,
    userEmail: user.email,
    userName: user.name,
    credits: packageInfo.credits,
  };
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
): Promise<RazorpayVerificationResponse> {
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

  // Initialize Razorpay instance with your credentials
  const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_SECRET_KEY,
  });

  // Get order details from Razorpay
  const order = await razorpay.orders.fetch(orderId);
  const creditsRaw = order.notes?.credits;
  if (creditsRaw === undefined || creditsRaw === null) {
    throw new Error("Order credits not found");
  }
  const credits = parseInt(String(creditsRaw), 10);

  // Add credits to user
  await db.user.update({
    where: { id: session.user.id },
    data: {
      credits: {
        increment: credits,
      },
    },
  });

  revalidatePath("/dashboard/billing");

  return { success: true, credits };
}
