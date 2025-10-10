# Stage 1: Build Angular app
FROM node:18 AS build
WORKDIR /app
COPY ./youtube-downloader-webui .
RUN npm install && npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/youtube-downloader-webui/browser /usr/share/nginx/html
COPY ./deployment/webui/nginx.conf /etc/nginx/conf.d/default.conf