#!/bin/bash

# Build the project
echo "Building Astro project..."
npm run build:astro

# Ensure the _redirects file exists
echo "Ensuring _redirects file exists..."
if [ ! -f "dist/_redirects" ]; then
  echo "/* /.netlify/functions/entry 200" > dist/_redirects
  echo "Created _redirects file."
else
  echo "_redirects file already exists."
fi

echo "Build completed successfully!"
