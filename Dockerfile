# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.1

FROM node:${NODE_VERSION}-alpine

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev

ARG INSTALL_DEV_TOOLS=false
RUN if [ "$INSTALL_DEV_TOOLS" = "true" ]; then npm install -g nodemon; fi

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]