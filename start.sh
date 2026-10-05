#!/bin/bash

# Ensure we run from the project root (location of this script)
cd "$(dirname "$0")"

# Detect port from package.json dev script, default to 3001
PORT=$(grep -oE '"dev":[^,]*' package.json 2>/dev/null | grep -oE -- '-p\s+[0-9]+|--port\s+[0-9]+' | grep -oE '[0-9]+' | head -n 1)
PORT=${PORT:-3001}

echo "🔍 Checking if port $PORT is in use..."

get_pids() {
    local pids=""
    if command -v lsof >/dev/null 2>&1; then
        pids=$(lsof -t -i :$PORT -sTCP:LISTEN 2>/dev/null)
    fi
    if [ -z "$pids" ] && command -v ss >/dev/null 2>&1; then
        pids=$(ss -lptn "sport = :$PORT" 2>/dev/null | grep -oP 'pid=\K\d+' | uniq)
    fi
    if [ -z "$pids" ] && command -v fuser >/dev/null 2>&1; then
        pids=$(fuser $PORT/tcp 2>/dev/null | tr -d '\n\r' | tr -s ' ' '\n' | grep -oE '[0-9]+')
    fi
    echo "$pids"
}

filter_killable_pids() {
    local input_pids="$1"
    local filtered=""
    local current_dir
    current_dir=$(pwd)
    for pid in $input_pids; do
        if [ -d "/proc/$pid" ]; then
            local cmdline
            cmdline=$(cat "/proc/$pid/cmdline" 2>/dev/null | tr '\0' ' ')
            local comm
            comm=$(cat "/proc/$pid/comm" 2>/dev/null)
            
            # 1. Skip if it is a browser
            if echo "$comm" | grep -Eiq "firefox|chrome|chromium|safari|msedge|opera|browser"; then
                continue
            fi
            
            # 2. Skip if it's VS Code or SSH internal process
            if echo "$cmdline" | grep -Eiq "vscode|ssh|systemd|init|session"; then
                continue
            fi
            
            # 3. If it runs from the current directory, always kill it
            local proc_cwd
            proc_cwd=$(readlink -f "/proc/$pid/cwd" 2>/dev/null)
            if [ "$proc_cwd" = "$current_dir" ]; then
                filtered="$filtered $pid"
                continue
            fi
            
            # 4. Otherwise, only kill common dev server runtimes
            if echo "$comm" | grep -Eiq "node|npm|next|python|ruby|bun|deno|java|go"; then
                filtered="$filtered $pid"
            fi
        fi
    done
    echo "$filtered" | xargs
}

PIDS=$(get_pids)
PIDS=$(filter_killable_pids "$PIDS")

if [ -n "$PIDS" ]; then
    echo "⚠️ Port $PORT is occupied by PID(s): $PIDS. Killing occupying processes..."
    kill -9 $PIDS 2>/dev/null
    
    # Wait and verify it's actually free (up to 5 seconds/checks)
    for i in {1..10}; do
        sleep 0.5
        PIDS=$(get_pids)
        PIDS=$(filter_killable_pids "$PIDS")
        if [ -z "$PIDS" ]; then
            break
        fi
        kill -9 $PIDS 2>/dev/null
    done
    
    PIDS=$(get_pids)
    PIDS=$(filter_killable_pids "$PIDS")
    if [ -z "$PIDS" ]; then
        echo "✅ Port $PORT is now free."
    else
        echo "❌ Port $PORT is still occupied by PID(s): $PIDS. Attempting to start anyway..."
    fi
else
    echo "✅ Port $PORT is free."
fi

echo "🚀 Starting Next.js dev server..."
# Start the development server
npm run dev &
DEV_PID=$!

echo "⏳ Waiting for server to initialize..."
sleep 3

# Open the app in the default browser based on OS (Linux or macOS)
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:$PORT/"
elif command -v open > /dev/null; then
    open "http://localhost:$PORT/"
else
    echo "🔗 Dev server running. Open: http://localhost:$PORT/ in your browser."
fi

# Wait for the background process (Next.js server) so logs are printed and Ctrl+C terminates it properly
wait $DEV_PID
