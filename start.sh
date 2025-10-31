#!/bin/bash

echo "🚀 Starting Minesweeper Pro..."
echo ""
echo "Make sure you have Node.js installed (v16 or higher)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🎮 Starting development server..."
echo "Open your browser to http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
