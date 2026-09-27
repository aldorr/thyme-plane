#!/bin/bash
set -euo pipefail

npm run build
cp ./dist/index.html ./dist/200.html
surge ./dist
