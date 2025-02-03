# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first
COPY package*.json ./

RUN npm install -g typescript

# Install dependencies
RUN npm install --only=production && npm cache clean --force

# Copy the rest of the application
COPY . .

# Build the TypeScript files
RUN npm run build


# Define the command to run the app
CMD ["node", "dist/worker.js"]
