#!/bin/bash

# Ensure we're using the correct Node.js version
asdf local nodejs 18.19.0

# Remove old dependencies
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Start the development server
npm run serve 