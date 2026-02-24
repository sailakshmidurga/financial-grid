# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 👇 Generate 1M records inside Docker
RUN npm run generate-data

# 👇 Then build Vite
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80