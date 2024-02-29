# Use official Node.js image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn 

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app using yarn start
CMD ["yarn", "run", "start"]

