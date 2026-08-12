#!/bin/bash

# Start the Python ML Service in the background
echo "Starting FastAPI ML Service..."
cd ml_service
uvicorn main:app --host 0.0.0.0 --port 8000 &
ML_PID=$!
cd ..

# Set the environment variable so the backend knows where the ML service is
export ML_SERVICE_URL="http://127.0.0.1:8000"

# Start the Node.js backend (which also serves the React frontend)
echo "Starting Node Backend..."
cd backend
node dist/index.js &
NODE_PID=$!
cd ..

# Wait for any process to exit
wait -n

# Exit with status of process that exited first
exit $?
