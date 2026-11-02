FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci

COPY . .
# The build context is the package directory, so the repository-level
# persistence-boundary script is outside the Docker build context.
RUN npx nest build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
