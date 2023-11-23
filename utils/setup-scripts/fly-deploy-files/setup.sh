#!/bin/bash


BNK_SCRIPT_PATH="node_modules/bnkit/utils/setup-scripts/fly-deploy-files"

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
FULL_PATH="$PROJECT_DIR/$BNK_SCRIPT_PATH"

cp -r $FULL_PATH/.dockerignore $PROJECT_DIR/.dockerignore
cp -r $FULL_PATH/deploy-to-fly.yml PROJECT_DIR/.github/workflows
cp -r $FULL_PATH/Dockerfile $PROJECT_DIR/Dockerfile
cp -r $FULL_PATH/fly.toml $PROJECT_DIR/fly.toml


# Move deploy-to-fly.yml to .github/workflows in the current working directory
mkdir -p $PROJECT_DIR/.github/workflows
cp -r $FULL_PATH/deploy-to-fly.yml $PROJECT_DIR/.github/workflows/deploy-to-fly.yml

echo "Files have been moved successfully."

echo "If you don't already have fly installed"
echo "install with: brew install flyctl"
echo "or with curl/linux: curl -L https://fly.io/install.sh | sh"
echo "Now that you are setup with fly, you can delete this file."