# Use an official Node.js runtime as the base image
FROM node:16-alpine 

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the working directory
COPY . .

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
#RUN npm ci 
# Build the app
RUN npm run build

# Copy the React project code to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Expose the React app port
EXPOSE 3000

# Serve the React app using a lightweight web server
CMD [ "npx", "serve", "build" ]