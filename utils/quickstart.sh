#!/bin/bash

# Script to setup and run a Bun project with a given project name

# Function to prompt for the project name
prompt_for_project_name() {
  read -p "Enter the project name: " PROJECT_NAME
  if [[ -z "$PROJECT_NAME" ]]; then
    echo "No project name provided. Exiting."
    exit 1
  fi
}

# Function to check if a command exists
command_exists() {
  type "$1" &> /dev/null
}

# Prompt for the project name
prompt_for_project_name

# Install Bun if not already installed
if ! command_exists bun; then
  echo "Bun is not installed. Installing Bun..."
  curl https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Clone the starter project using Bun
echo "Cloning the $PROJECT_NAME project..."
bun create github.com/brandon-schabel/start-bnk $PROJECT_NAME
cd $PROJECT_NAME

# Run the project setup script
if [ -f "./setup.sh" ]; then
  echo "Running project setup script..."
  sh ./setup.sh
else
  echo "No setup.sh script found in the project directory."
fi
