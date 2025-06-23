import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { processVideo } from "~/inngest/functions";
import { env } from "~/env";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processVideo],
  signingKey: env.INNGEST_SIGNING_KEY,
  // serveHost: env.INNGEST_SERVE_HOST ?? "localhost:3000",
});
