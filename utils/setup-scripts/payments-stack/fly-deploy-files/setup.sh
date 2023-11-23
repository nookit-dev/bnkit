#!/bin/bash

# Define the repository URL
REPO_URL="https://raw.githubusercontent.com/brandon-schabel/bun-nook-kit/main/utils/setup-scripts/payments-stack"

# Download the files
curl -O "$REPO_URL/.dockerignore"
curl -O "$REPO_URL/deploy-to-fly.yml"
curl -O "$REPO_URL/Dockerfile"
curl -O "$REPO_URL/fly.toml"

# Move .dockerignore, Dockerfile, and fly.toml to the current working directory (project root)
mv .dockerignore .
mv Dockerfile .
mv fly.toml .

# Move deploy-to-fly.yml to .github/workflows in the current working directory
mkdir -p .github/workflows
mv deploy-to-fly.yml .github/workflows/

echo "Files have been moved successfully."