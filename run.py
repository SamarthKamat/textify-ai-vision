
"""
TextifyAI Startup Script
-------------------------
This script provides a convenient way to start both the Flask backend
and serve static files for the React frontend.
"""

import os
import webbrowser
import subprocess
import time
import signal
import sys
from threading import Thread

def start_flask():
    """Start the Flask backend server"""
    print("Starting Flask backend server...")
    os.environ['FLASK_APP'] = 'app.py'
    os.environ['FLASK_ENV'] = 'development'
    subprocess.Popen(['python', 'app.py'])

def open_browser():
    """Open the browser after a short delay"""
    print("Opening application in browser...")
    time.sleep(2)  # Give the server a moment to start
    webbrowser.open('http://localhost:5000')

def handle_exit(*args):
    """Handle clean exit"""
    print("\nShutting down...")
    sys.exit(0)

if __name__ == '__main__':
    # Register signal handler for clean exit
    signal.signal(signal.SIGINT, handle_exit)
    
    # Create uploads directory if it doesn't exist
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        print("Created uploads directory")
        
    # Start Flask backend
    start_flask()
    
    # Open browser after a delay
    Thread(target=open_browser).start()
    
    print("\nTextifyAI is running!")
    print("Access the application at http://localhost:5000")
    print("Press Ctrl+C to exit")
    
    # Keep the script running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        handle_exit()
