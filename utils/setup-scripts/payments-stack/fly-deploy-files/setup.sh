#!/bin/bash

# Define the repository URL
REPO_URL="https://raw.githubusercontent.com/brandon-schabel/bun-nook-kit/main/utils/setup-scripts/payments-stack/fly-deploy-files"

# Download the files
curl -O "$REPO_URL/.dockerignore"
curl -O "$REPO_URL/deploy-to-fly.yml"
curl -O "$REPO_URL/Dockerfile"
curl -O "$REPO_URL/fly.toml"

# Move deploy-to-fly.yml to .github/workflows in the current working directory
mkdir -p .github/workflows
mv deploy-to-fly.yml .github/workflows/

echo "Files have been moved successfully."

echo "If you don't already have fly installed"
echo "install with: brew install flyctl"
echo "or with curl/linux: curl -L https://fly.io/install.sh | sh"
echo "Now that you are setup with fly, you can delete this file."