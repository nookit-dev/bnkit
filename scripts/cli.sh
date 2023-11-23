#!/bin/bash

# parse all flags 
while [ $# -gt 0 ]; do
    if [[ $1 == *"--"* ]]; then
        v="${1/--/}"
        declare $v="$2"
    fi
    shift
done


PROJECT_DIR=$dir
SCRIPTS_PATH=$dir/node_modules/bnkit/scripts

# Prompt the user to choose a script
echo "Please choose a script to run:"
echo "qs for quickstart"
echo "fly for fly-deploy"
read choice

# Set the script path based on the user's choice
case $choice in
    qs)
        SCRIPT="quickstart.sh"
        ;;
    fly)
        SCRIPT="fly-deploy/setup.sh"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo $PROJECT_DIR
echo $SCRIPTS_PATH/$SCRIPT

# Run the chosen script
bash $SCRIPTS_PATH/$SCRIPT --dir "$(pwd)"