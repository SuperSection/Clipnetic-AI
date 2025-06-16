"use server";

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export async function Page() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  
  return <h1>Signup Page</h1>
}
