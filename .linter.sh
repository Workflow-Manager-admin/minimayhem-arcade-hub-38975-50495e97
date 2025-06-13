#!/bin/bash
cd /home/kavia/workspace/code-generation/minimayhem-arcade-hub-38975-50495e97/mini_mayhem_arcade_hub
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

