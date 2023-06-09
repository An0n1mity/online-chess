#!/bin/bash

# Start the Celery worker in the background
celery -A backend worker --loglevel=info &

# Wait for the Celery worker to initialize
sleep 5

# Run the Django server
python manage.py runserver 0.0.0.0:8000
