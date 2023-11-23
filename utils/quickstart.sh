#!/bin/bash

# Script to setup and run a Bun project

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
echo "Cloning the bnk-server-starter project..."
bun create github.com/brandon-schabel/bnk-server-starter
cd bnk-server-starter

# Install dependencies
echo "Installing dependencies with bun install..."
bun install

# Start the server
echo "Starting the server with bun dev..."
bun dev &

# Wait for server to start
sleep 5

# Open the web browser
echo "Opening the browser at localhost:3000..."
if command_exists xdg-open; then
  xdg-open http://localhost:3000
elif command_exists open; then
  open http://localhost:3000
else
  echo "Browser cannot be opened automatically. Please open localhost:3000 manually."
fi