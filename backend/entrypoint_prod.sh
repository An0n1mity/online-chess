#!/bin/bash

# Start the Celery worker in the background
celery -A backend worker --loglevel=info &

# Wait for the Celery worker to initialize
sleep 5

# Run the Django server
# Run Gunicorn with your Django application
gunicorn wsgi:application --bind 0.0.0.0:8000 --keyfile privkey.pem --certfile fullchain.pem
