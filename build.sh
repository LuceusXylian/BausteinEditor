#!/usr/bin/bash

# Ensure to start from the script directory 
script_dir_path=$(dirname "${BASH_SOURCE[0]}")
cd $script_dir_path

deno --allow-all __build.js