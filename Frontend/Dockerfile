# Frontend/Dockerfile

# ETAPA 1: Construccion (Build)
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos los archivos construidos (dist) al servidor Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copiamos la configuracion para que funcione el React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
