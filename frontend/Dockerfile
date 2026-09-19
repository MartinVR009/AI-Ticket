# =======================================================
# Dockerfile para Frontend AI-Ticket (React + Vite)
# =======================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar bundle
COPY . .
RUN npm run build

# =======================================================
# Stage de Producción con Nginx
# =======================================================
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
