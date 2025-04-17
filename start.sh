
#!/bin/bash

# Start Flask backend
echo "Starting Flask backend..."
python app.py &

# Wait a bit to ensure Flask has started
sleep 2

# Start React frontend
echo "Starting React frontend..."
npm start

# When ctrl+c is pressed, kill all background processes
trap "kill 0" EXIT
