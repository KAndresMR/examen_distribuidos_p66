# Build Angular app
FROM node:18 AS build
WORKDIR /app
COPY angular/ .
RUN npm install && npm run build --prod

# Serve with Apache
FROM httpd:2.4
COPY --from=build /app/dist/angular/browser /usr/local/apache2/htdocs/