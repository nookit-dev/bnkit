#!/bin/bash
export BNKIT_PATH="$BUN_INSTALL/install/cache/bnkit"

function run_bnk_cli() {    
    echo "Bun install location: $BUN_INSTALL"
    echo "Bun Nook Kit install location: $BNKIT_PATH"

    # Find the latest version of bnkit
    versions=$(ls $BNKIT_PATH | sort -V)
    latest_version=$(echo "$versions" | tail -1)

    echo "Latest version of bnkit: $latest_version"

    # Define the path to the cli.sh script in the latest version
    cli_script_path="$BNKIT_PATH/$latest_version/scripts/cli.sh"

    echo "cli.sh path: $cli_script_path"

    # Check if the script exists
    if [[ -f "$cli_script_path" ]]; then
        # Run the script with the --dir flag set to the current directory
        "$cli_script_path" --dir "$(pwd)"
    else
        echo "cli.sh not found in the latest version of bnkit."
    fi
}

alias bnkit='run_bnk_cli'