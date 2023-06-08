# Use an official Python runtime as the base image
FROM python:3.10

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /test_

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the Django project code to the working directory
COPY . .

# Expose the Django server port
EXPOSE 8000

# Run the Django server
CMD ["python", "manage.py", "runserver"]
