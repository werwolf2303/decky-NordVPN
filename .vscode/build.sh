#!/usr/bin/env bash
echo "Building plugin in $(pwd)"
printf "Please input sudo password to proceed.\n"

# read -s sudopass
# printf "\n"

cat .vscode/sudopass.txt | sudo -S $(pwd)/cli/decky plugin build $(pwd)
