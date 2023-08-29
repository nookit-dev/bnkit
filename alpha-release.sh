#!/bin/bash

# Generate a random hash for the alpha version
HASH=$(openssl rand -hex 8)
CURRENT_VERSION=$(npm info "@u-tools/core" version)
ALPHA_VERSION="$CURRENT_VERSION-alpha.$HASH"

echo "Starting to publish alpha version: $ALPHA_VERSION"

# Update the npm version
npm version --no-git-tag-version $ALPHA_VERSION

# Publish the main package with alpha version
npm publish --tag alpha --access public

# Navigate to plugins/react and publish
cd plugins/react
npm version --no-git-tag-version $ALPHA_VERSION
npm publish --tag alpha --access public

# Return to the root directory
cd ../../

echo "Alpha release completed with version: $ALPHA_VERSION"
