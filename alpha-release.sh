#!/bin/bash

# Generate a random hash for the alpha version
HASH=$(openssl rand -hex 8)
ALPHA_VERSION="alpha-$HASH"

# Update the npm version
npm version --no-git-tag-version $ALPHA_VERSION

# Publish the main package with alpha version
npm publish --tag alpha --access public

# Navigate to plugins/react and publish
cd plugins/react
npm version --no-git-tag-version $ALPHA_VERSION
npm publish --tag alpha --access public

# Navigate to plugins/open-ai and publish
cd ../open-ai
npm version --no-git-tag-version $ALPHA_VERSION
npm publish --tag alpha --access public

# Return to the root directory
cd ../../

echo "Alpha release completed with version: $ALPHA_VERSION"