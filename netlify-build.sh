#!/bin/bash

# Netlify Build Script
echo "Starting Netlify Build Process..."

# Print environment info
echo "Node version:"
node --version
echo "NPM version:"
npm --version

# Clear any cache
echo "Clearing cache..."
rm -rf .next

# Install dependencies
echo "Installing dependencies..."
npm ci || npm install

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma || echo "Prisma generation skipped"

# Build Next.js app
echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
