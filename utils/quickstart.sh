#!/bin/bash

# Script to setup and run a Bun project with a given project name

# Check for project name argument
if [ $# -eq 0 ]; then
  echo "No project name provided. Usage: $0 [project-name]"
  exit 1
fi

# The project name is the first argument
PROJECT_NAME=$1

# Function to check if a command exists
command_exists() {
  type "$1" &> /dev/null
}

# Install Bun if not already installed
if ! command_exists bun; then
  echo "Bun is not installed. Installing Bun..."
  curl https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Clone the starter project using Bun
echo "Cloning the $PROJECT_NAME project..."
bun create github.com/brandon-schabel/$PROJECT_NAME
cd $PROJECT_NAME

# Run the project setup script
if [ -f "./setup.sh" ]; then
  echo "Running project setup script..."
  sh ./setup.sh
else
  echo "No setup.sh script found in the project directory."
fi
