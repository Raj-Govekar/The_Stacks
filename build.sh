#!/bin/bash
cd frontend
npm install
export SKIP_PREFLIGHT_CHECK=true
export CI=false
export GENERATE_SOURCEMAP=false
npm run build 2>&1 | sed '/eslint/d'
exit 0