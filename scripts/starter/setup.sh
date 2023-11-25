#!/bin/bash
# Script to setup and run a Bun project
# You can delete this file after running it or if you did manual setup.

# Function to check if a command exists
command_exists() {
  type "$1" &> /dev/null
}

# Function to stop the server
stop_server() {
  echo "Stopping the server..."
  kill "$server_pid" 2> /dev/null
}

# Trap EXIT signal to ensure server stops when script exits
trap stop_server EXIT

# Install Bun if not already installed
if ! command_exists bun; then
  echo "Bun is not installed. Installing Bun..."
  curl https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Install dependencies
echo "Installing dependencies with bun install..."
bun install

# Check if --no-start flag is set
if [[ $1 != "--no-start" ]]; then
  # Start the server and get its PID
  echo "Starting the server with bun dev..."
  bun dev &
  server_pid=$!

  # Wait for server to start
  sleep 0.5

  # Open the web browser
  echo "Opening the browser at http://localhost:3000..."
  if command_exists xdg-open; then
    xdg-open http://localhost:3000
  elif command_exists open; then
    open http://localhost:3000
  else
    echo "Browser cannot be opened automatically. Please open localhost:3000 manually."
  fi

  echo "Setup complete! To stop the server, exit this script."

  echo "Start server again by running \"bun dev\" in the project directory."

  echo "View JSON route at http://localhost:3000/json"

  # Keep the script running until it receives a signal to exit
  wait $server_pid
else
  echo "Setup complete! Server not started due to --no-start flag."
fi