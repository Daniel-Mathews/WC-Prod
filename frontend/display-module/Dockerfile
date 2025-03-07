# Use an official Node.js runtime as the base image
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/display-module/package.json frontend/display-module/package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire frontend code
COPY frontend/display-module ./

# Build the Next.js application
RUN npm run build

# Use a lightweight Node.js image for production
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app ./

# Expose port (default Next.js runs on 3000)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "run", "start"]
