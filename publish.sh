#!/bin/bash

# start build.sh if error then exit
if ! ./build.sh; then
    echo "Build failed. Exiting. Nothing published."
    exit 1
fi

deno publish --allow-slow-types
npm publish