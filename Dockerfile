# Use an official Node runtime as the parent image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

RUN npm run build

RUN npm install -g serve

# Make the container's port 80 available to the outside world at runtime
EXPOSE $PORT

WORKDIR /app/dist

# Define the command to run the app using CMD which keeps the container running
CMD ["npx", "serve"]
