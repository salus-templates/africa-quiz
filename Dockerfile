# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application for production
# Vite's default build output is to the 'dist' directory
RUN npm run build

# Stage 2: Serve the application with Caddy
FROM caddy:2-alpine

# Embed the Caddyfile directly into the container using a heredoc
# This makes the Caddyfile configuration much cleaner and easier to read.
COPY <<EOF /etc/caddy/Caddyfile
:8080 {
    root * /usr/share/caddy
    file_server
    try_files {path} /index.html
    encode gzip
}
EOF

# Copy the built React app static files from the builder stage
# Caddy's default static file server serves from /usr/share/caddy
COPY --from=builder /app/dist /usr/share/caddy

# Expose port 80 for web traffic
EXPOSE 8080

# Caddy will automatically run as the main process due to the base image's ENTRYPOINT
# No CMD instruction is typically needed here, as Caddy will use the Caddyfile.
