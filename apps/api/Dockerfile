# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy files
COPY . .

# Install dependencies
RUN npm install -g turbo
RUN npm install -g pnpm
RUN turbo prune api --docker
RUN pnpm install --frozen-lockfile

# api is inside apps/api
WORKDIR /usr/src/app/apps/api

# Build the application
RUN pnpm build

# Expose the port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]