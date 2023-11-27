#!/bin/bash

# Script to setup and run a Bun project with a given project name

# scripts url https://raw.githubusercontent.com/brandon-schabel/bun-nook-kit/main/scripts
BASE_URL="https://raw.githubusercontent.com/brandon-schabel/bun-nook-kit/main/scripts"
HOST="http://localhost:3000"

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

mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME" 

bun add bnkit

# copy files from ./starter to the new project directory
echo "Creating BNK quickstart project..."

cp -a ./node_modules/bnkit/scripts/starter/. ./

echo "Thank you for trying Bun Nook Kit!"
echo "Add the Bun Nook Kit CLI to your path to have quick access"
echo "Copy the below code into your .zshrc or .bashrc file to add the bnkit command to your shell: "
echo ""
echo ""

# Fetch and display the content of the add-to-path.sh script
echo "Fetching the content of the add-to-path.sh script..."
curl -s ${BASE_URL}/add-to-path.sh

echo ""
echo ""

# Install dependencies
echo "Installing dependencies with bun install..."
bun install

# starter ask if they want to add --no-start flag (i.e. don't start the server)
read -p "Do you want to start the server on setup? (y/n): " START_SERVER

# Check if --no-start flag is set
if [[ $START_SERVER == "y" ]]; then
  # Start the server and get its PID
  echo "Starting the server with bun dev..."
  bun dev &
  server_pid=$!

  # Wait for server to start
  sleep 0.5

  # Open the web browser
  echo "Opening the browser at $HOST..."
  if command_exists xdg-open; then
    xdg-open $HOST
  elif command_exists open; then
    open $HOST
  else
    echo "Browser cannot be opened automatically. Please open $HOST manually."
  fi

  echo "Setup complete! To stop the server, exit this script."

  echo "Start server again by running \"bun dev\" in the project directory."

  echo "View JSON route at $HOST/json"

  # Keep the script running until it receives a signal to exit
  wait $server_pid
else
  echo "Setup complete! Server not started due to --no-start flag."
fi
