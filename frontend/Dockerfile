FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# Railway builds this image from /frontend, so the repository-level
# persistence-boundary script is outside the Docker build context.
RUN npx ng build

FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html
ENV BACKEND_URL=http://backend:3000
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
