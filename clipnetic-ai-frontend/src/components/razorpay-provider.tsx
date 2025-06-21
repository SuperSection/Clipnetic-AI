"use client";

import { useEffect } from "react";

type RazorpayProviderProps = {
  children: React.ReactNode;
};

export function RazorpayProvider({ children }: Readonly<RazorpayProviderProps>) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <>{children}</>;
}
