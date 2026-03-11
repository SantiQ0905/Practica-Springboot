FROM maven:3.9-eclipse-temurin-22 AS build

WORKDIR /app

# Instalar Node.js 22
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Copiar archivos de dependencias primero (aprovechar caché)
COPY API/practica-springboot-react/pom.xml ./API/practica-springboot-react/
COPY package*.json ./

RUN npm install

# Copiar el resto del código
COPY API/practica-springboot-react ./API/practica-springboot-react
COPY src ./src
COPY public ./public
COPY index.html .
COPY vite.config.ts .
COPY tsconfig*.json ./

# Compilar el frontend
RUN npm run build

# Copiar el build del frontend al static del backend
RUN mkdir -p /app/API/practica-springboot-react/src/main/resources/static
RUN cp -r /app/dist/* /app/API/practica-springboot-react/src/main/resources/static/

# Empaquetar el backend
RUN cd /app/API/practica-springboot-react && mvn clean package -DskipTests

# Imagen final ligera
FROM eclipse-temurin:22-jre

WORKDIR /app

COPY --from=build /app/API/practica-springboot-react/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
