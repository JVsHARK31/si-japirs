#!/bin/bash

echo "========================================"
echo "   Si-JAPIRS Deployment Script"
echo "========================================"
echo ""

echo "Preparing for deployment..."
echo ""

echo "Step 1: Adding all files to git..."
git add .
echo ""

echo "Step 2: Creating commit..."
read -p "Enter commit message (or press Enter for default): " message
if [ -z "$message" ]; then
    message="Deploy Si-JAPIRS with OAuth authentication"
fi

git commit -m "$message"
echo ""

echo "Step 3: Pushing to GitHub..."
git push
echo ""

echo "========================================"
echo "   Deployment Preparation Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "For NETLIFY:"
echo "  1. Go to: https://app.netlify.com/start"
echo "  2. Import your repository"
echo "  3. Add environment variables from QUICK_DEPLOY.md"
echo ""
echo "For VERCEL:"
echo "  1. Go to: https://vercel.com/new"
echo "  2. Import your repository"
echo "  3. Add environment variables from QUICK_DEPLOY.md"
echo ""
echo "========================================"
echo ""
read -p "Press any key to continue..."
