# Build the static site
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* env vars into the build at build time (not runtime), so
# they must be passed as build args: `docker build --build-arg VITE_API_URL=...`
ARG VITE_API_URL
ARG VITE_PAYSTACK_PUBLIC_KEY
ARG VITE_SITE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_PAYSTACK_PUBLIC_KEY=$VITE_PAYSTACK_PUBLIC_KEY
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# Serve it with a minimal static server
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
