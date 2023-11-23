#!/bin/bash
BNK_SCRIPT_PATH="node_modules/bnkit/scripts/fly-deploy"

# parse all flags 
while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
    fi
    shift
done

# getting dir flag
PROJECT_DIR=$dir
NODE_MODULE_PATH="$PROJECT_DIR/$BNK_SCRIPT_PATH"

echo "Project Directory: $PROJECT_DIR"

# Create necessary directories
mkdir -p $PROJECT_DIR/.github
mkdir -p $PROJECT_DIR/.github/workflows

# Copy files
cp -r $NODE_MODULE_PATH/.dockerignore $PROJECT_DIR/.dockerignore
cp -r $NODE_MODULE_PATH/Dockerfile $PROJECT_DIR/Dockerfile
cp -r $NODE_MODULE_PATH/fly.toml $PROJECT_DIR/fly.toml
cp -r $NODE_MODULE_PATH/deploy-to-fly.yml $PROJECT_DIR/.github/workflows/deploy-to-fly.yml

echo "Files have been moved successfully."

echo "If you don't already have fly installed"
echo "install with: brew install flyctl"
echo "or with curl/linux: curl -L https://fly.io/install.sh | sh"
echo "Now that you are setup with fly, you can delete this file."