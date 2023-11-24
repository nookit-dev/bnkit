#!/bin/bash

# Script to setup and run a Bun project with a given project name

# Function to check if a command exists
command_exists() {
  type "$1" &> /dev/null
}

# Function to parse command-line flags
parse_flags() {
  while getopts "p:" flag; do
    case "${flag}" in
      p) PROJECT_NAME=${OPTARG} ;;
      *) echo "Usage: $0 [-p project_name]" ; exit 1 ;;
    esac
  done
}

# Function to prompt for the project name
prompt_for_project_name() {
  if [[ -z "$PROJECT_NAME" ]]; then
    read -p "Enter the project name: " PROJECT_NAME
    if [[ -z "$PROJECT_NAME" ]]; then
      echo "No project name provided. Exiting."
      exit 1
    fi
  fi
}

# Function to install unzip on Linux (excluding macOS)
install_unzip_on_linux() {
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "Linux detected. Checking for root access..."

    if [[ $(id -u) -ne 0 ]]; then
      echo "Root access is required to install unzip. Please run this script as root or ask your administrator to install unzip."
      exit 1
    fi

    echo "Installing unzip..."
    sudo apt install unzip
  fi
}
# Parse command-line flags
parse_flags "$@"

# Prompt for the project name if not set
prompt_for_project_name

# Install unzip on Linux if needed
install_unzip_on_linux

# Install Bun if not already installed
if ! command_exists bun; then
  echo "Bun is not installed. Installing Bun..."
  curl https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
# Clone the starter project using Bun
echo "Cloning the $PROJECT_NAME project..."
bun create github.com/brandon-schabel/start-bnk "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit 1


echo "Thank you for trying Bun Nook Kit!"
echo "Add the Bun Nook Kit CLI to your path to have quick access"
echo "Copy the below code into your .zshrc or .bashrc file to add the bnkcli command to your shell: "
echo ""
echo ""

# Fetch and display the content of the add-to-path.sh script
echo "Fetching the content of the add-to-path.sh script..."
curl -s https://raw.githubusercontent.com/brandon-schabel/bun-nook-kit/main/scripts/add-to-path.sh


echo ""
echo ""

# Run the project setup script
if [ -f "./setup.sh" ]; then
  echo "Running project setup script..."
  sh ./setup.sh
else
  echo "No setup.sh script found in the project directory."
fi
