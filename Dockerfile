ARG NODE_VERSION=18.18.0  # Ensure you're using a compatible Node.js version
FROM node:${NODE_VERSION} as base

LABEL fly_launch_runtime="Vite"

# Vite app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules (Debian package manager)
RUN apt-get update && apt-get install -y \
    build-essential python3 python3-distutils python-is-python3 libxi-dev libglu1-mesa-dev libglew-dev pkg-config 

# Install node modules (including dev dependencies)
COPY package-lock.json package.json ./ 
RUN npm ci --include=dev

# Run npm rebuild to compile any native modules from source
RUN npm rebuild

# Copy application code
COPY . . 

# Build application (if any build steps required)
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Start the server by default; this can be overwritten at runtime
EXPOSE 80
CMD [ "/usr/sbin/nginx", "-g", "daemon off;" ]
