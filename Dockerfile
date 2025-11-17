# ===== BASE =====
FROM node:22.13.1-alpine AS base

# ===== BUILD =====
FROM base AS build
WORKDIR /src
COPY package*.json ./
RUN npm ci
COPY . .
ARG MODE=staging
ENV NODE_ENV=production
RUN BUILD_PATH='./dist' npm run build -- --mode $MODE

# ===== SERVE =====
FROM nginx:alpine AS app
COPY --from=build /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3015
CMD ["nginx", "-g", "daemon off;"]
