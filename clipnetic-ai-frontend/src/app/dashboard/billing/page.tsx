"use client";

import type { VariantProps } from "class-variance-authority";
import { ArrowLeftIcon, CheckIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import type { PriceId, RazorpayOrderResponse, RazorpayResponse, RazorpayVerificationResponse } from "~/actions/razorpay";
import { Button, type buttonVariants } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { env } from "~/env";
import { redirect } from "next/navigation";


interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: VariantProps<typeof buttonVariants>["variant"];
  isPopular?: boolean;
  savePercentage?: string;
  priceId: PriceId;
}

const plans: PricingPlan[] = [
  {
    title: "Small Pack",
    price: "₹49.99",
    description: "Perfect for occassional podcast creators.",
    features: [
      "50 credits",
      "No expiration",
      "Download all clips",
    ],
    buttonText: "Buy 50 credits",
    buttonVariant: "outline",
    priceId: "small",
  },
  {
    title: "Medium Pack",
    price: "₹125.99",
    description: "Best value for regular podcasters.",
    features: [
      "150 credits",
      "No expiration",
      "Download all clips",
    ],
    buttonText: "Buy 150 credits",
    buttonVariant: "default",
    isPopular: true,
    savePercentage: "Save 17%",
    priceId: "medium",
  },
  {
    title: "Large Pack",
    price: "₹359.99",
    description: "Ideal for podcast studios and agencies.",
    features: [
      "500 credits",
      "No expiration",
      "Download all clips",
    ],
    buttonText: "Buy 500 credits",
    buttonVariant: "outline",
    savePercentage: "Save 30%",
    priceId: "large",
  },
];


function PricingCard({ plan }: { plan: PricingPlan }) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: plan.priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order");
      }

      const orderData: RazorpayOrderResponse = await response.json();

      const options = {
        key: env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Clipnetic AI",
        description: `${plan.title} - ${plan.features[0]}`,
        order_id: orderData.orderId,
        prefill: {
          name: orderData.userName,
          email: orderData.userEmail,
        },
        theme: { color: "#000000" },
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const result: RazorpayVerificationResponse = await verifyRes.json();

            if (result.success) {
              toast.success("Payment successful!", {
                description: `${result.credits} credits added to your account.`,
              });
              redirect("/dashboard");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={cn("relative flex flex-col", plan.isPopular ? "border-2 border-primary" : "border")}>
      {plan.isPopular && (
        <div className="bg-primary whitespace-nowrap text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full px-3 py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader className="flex-1">
        <CardTitle>{plan.title}</CardTitle>
        <div className="text-4xl font-bold">{plan.price}</div>
        {plan.savePercentage && <p className="text-sm font-medium text-green-600">{plan.savePercentage}</p>}
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <ul className="text-muted-foreground space-y-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <CheckIcon className="text-primary size-4" />{feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={plan.buttonVariant}
          className="w-full"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            plan.buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}


export default function BillingPage() {
  return (
    <div className="mx-auto flex flex-col space-y-8 px-4 py-10">
        <div className="flex relative items-center justify-center gap-4">
          <Button variant="outline" className="absolute top-0 left-0" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeftIcon className="size-4" />
            </Link>
          </Button>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Buy Credits
            </h1>
            <p className="text-muted-foreground">
              Purchase credits to generate more podcast clips. The more credits you buy, the better the value.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.priceId} plan={plan} />
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-semibold">How credits work</h3>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm">
            <li>1 credit = 1 minute of podcast processing</li>
            <li>The program will create around 1 clip per 5 minutes of podcast</li>
            <li>Credits never expire and can be used anytime</li>
            <li>Longer podcast require more credits based on duration</li>
            <li>All packages are one-time purchases (not subscription)</li>
          </ul>
        </div>
      </div>
  );
}
