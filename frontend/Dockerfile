# Use an official Node.js runtime as the base image
FROM node:16-alpine 

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
#RUN npm ci
RUN npm ci 

# Copy the rest of the files to the working directory
COPY . .

# Expose the React app port
EXPOSE 3000

# Serve the React app using a lightweight web server
CMD [ "npm", "start" ]