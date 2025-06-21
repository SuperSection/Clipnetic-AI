# --- Base Stage (reusable for common setup and minimal OS packages) ---
FROM node:22-alpine AS base
# Install necessary system packages for Node.js on Alpine
# libc6-compat is often needed for compatibility
# openssl is typically required for network security functions
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# --- Build Stage (for installing ALL dependencies and building the Next.js app) ---
FROM base AS builder
# Copy only package.json and lock files first to leverage Docker layer caching.
# If these files don't change, Docker can reuse this layer.
COPY package.json package-lock.json* ./

# Install all dependencies (development and production) required for the build.
RUN npm ci --legacy-peer-deps

# Copy the rest of your application source code into the builder stage.
COPY . .


# Accept NEXT_PUBLIC_RAZORPAY_KEY_ID as a build argument
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID
# Make it available as an ENV var during the build process
ENV NEXT_PUBLIC_RAZORPAY_KEY_ID=${NEXT_PUBLIC_RAZORPAY_KEY_ID}

# Set environment variables for the build process.
# NEXT_TELEMETRY_DISABLED: Prevents Next.js from sending anonymous telemetry during build.
# SKIP_ENV_VALIDATION: Useful if not all runtime environment variables are present during build.
ENV NEXT_TELEMETRY_DISABLED=1 SKIP_ENV_VALIDATION=1

# Generate Prisma client and build the Next.js application in standalone mode.
# This command will create the .next/standalone folder, which contains
# the Next.js server, the optimized build output, and ONLY the necessary
# production node_modules in .next/standalone/node_modules.
RUN npx prisma generate && npm run build

# --- Runner Stage (lean production-ready image) ---
# Start from the minimal base image again.
FROM base AS runner

# Set environment variables for the production runtime.
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1
# Keep if your app needs to bypass env validation at runtime
ENV SKIP_ENV_VALIDATION=1

# Create a non-root user for improved security.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only the essential build artifacts from the builder stage.
# The 'standalone' output includes:
# - The Next.js server (server.js)
# - The application's compiled code
# - ONLY the production node_modules it needs (located within the copied .next/standalone/node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy static assets if they are referenced outside of the public directory or directly from .next/static
# This is often already included within .next/standalone, but good to be explicit if you have custom setup.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# IMPORTANT: The line below is removed!
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
# This was the main source of bloat, as standalone mode makes it redundant.

# Copy prisma directory ONLY if your Next.js frontend explicitly needs the schema/migrations at runtime.
# For most Next.js frontends interacting with an external backend, this is not needed.
# If you encounter Prisma runtime errors related to missing schema, you can uncomment this.
# COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Switch to the non-root user for running the application.
USER nextjs

# Expose the port where the Next.js application will listen.
EXPOSE 3000

# Define the command to run the Next.js production server.
# The `server.js` file is part of the standalone build output.
CMD ["node", "server.js"]
