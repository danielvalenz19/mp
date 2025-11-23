# dicri-backend/Dockerfile

# 1. Usamos una imagen ligera de Node
FROM node:18-alpine

# 2. Creamos el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero (para aprovechar el cache)
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos el resto del codigo
COPY . .

# 6. Exponemos el puerto
EXPOSE 3013

# 7. Comando para iniciar
CMD ["npm", "run", "start"]
