# Practica: Docker con Spring Boot + React + TypeScript

## 1. Proposito de la practica

En esta practica vas a construir una aplicacion web sencilla donde:

- el frontend usa React + TypeScript + Tailwind CSS
- el backend usa Spring Boot
- el backend expone una API REST
- los datos se guardan en un archivo JSON
- el frontend compilado se sirve desde Spring Boot
- toda la aplicacion se ejecuta dentro de un contenedor Docker
- los datos persisten usando un volumen

La meta es entender tanto la aplicacion como su empaquetado y despliegue portable.

## 2. Objetivos de aprendizaje

Al terminar deberias poder:

- explicar que es una imagen Docker
- explicar que es un contenedor Docker
- construir una API REST con Spring Boot
- servir archivos estaticos desde `src/main/resources/static`
- leer y escribir un archivo JSON desde Java
- empaquetar la app como `.jar`
- construir y ejecutar una imagen Docker
- usar un volumen para conservar datos

## 3. Fundamentos teoricos de Docker

### 3.1 Docker como estandar de empaquetado

Docker permite distribuir aplicaciones con sus dependencias y configuracion minima de ejecucion en una imagen reproducible. Esto reduce diferencias entre la maquina del desarrollador, el laboratorio y el servidor.

### 3.2 Imagen, contenedor y volumen

Debes distinguir tres ideas:

- imagen: plantilla inmutable que define la app y su entorno
- contenedor: instancia en ejecucion de la imagen
- volumen: almacenamiento persistente fuera del contenedor

### 3.3 Capas de una imagen

Cada instruccion del `Dockerfile` crea capas. El orden importa porque afecta tiempos de reconstruccion y reutilizacion de cache.

### 3.4 Puertos

Tu aplicacion escuchara dentro del contenedor en `8080` o el puerto que definas.

```bash
docker run -p 8080:8080 mi-app
```

### 3.5 Persistencia

Si guardas datos dentro del contenedor y luego lo eliminas, los pierdes. Por eso el archivo JSON debe vivir en una ruta montada con volumen.

### 3.6 Frontend compilado en produccion

React en produccion se convierte en archivos estaticos. Spring Boot puede servirlos desde `static/`, lo que permite un solo despliegue.

## 4. Descripcion funcional

Construye una app tipo Registro de alumnos con:

- listado de alumnos
- formulario para crear alumnos
- persistencia en `items.json`

Modelo sugerido:

```json
[
  {
    "id": 1,
    "nombre": "Ana",
    "grupo": "A"
  }
]
```

## 5. Requisitos previos

- JDK 17 o superior
- Maven o Gradle
- Node.js 20 o superior
- npm
- Docker Desktop

Verifica:

```bash
java -version
mvn -version
node -v
npm -v
docker --version
```

## 6. Estructura sugerida

```text
practica-springboot-react-ts/
  backend/
    src/main/java/com/ejemplo/app/
      controller/
      service/
      model/
    src/main/resources/
      static/
    data/
      items.json
    pom.xml
    Dockerfile
  frontend/
    src/
    package.json
    tailwind.config.js
    postcss.config.js
```

## 7. Paso a paso

### Paso 1. Crear el frontend

Construye una SPA con React + TypeScript que:

- muestre la lista de alumnos
- tenga formulario
- consuma `GET /api/items`
- envie `POST /api/items`

### Paso 2. Integrar Tailwind CSS

Da formato con una interfaz clara:

- titulo
- panel principal
- formulario
- lista visible

### Paso 3. Crear el backend con Spring Boot

Genera un proyecto Spring Boot con componentes sugeridos:

- `ItemController`
- `ItemService`
- `Item`

Responsabilidades:

- `GET /api/items`: leer el JSON y devolver la lista
- `POST /api/items`: agregar un item y guardar el archivo

Usa Jackson para serializar y deserializar.

### Paso 4. Definir la ruta del archivo de datos

No escribas dentro de recursos empaquetados del `.jar`. Usa una ruta externa, por ejemplo:

```text
/app/data/items.json
```

Hazla configurable si es posible.

### Paso 5. Servir el frontend compilado desde Spring Boot

Compila el frontend y copia el resultado a:

```text
src/main/resources/static
```

Spring Boot servira esos archivos automaticamente.

### Paso 6. Probar sin Docker

1. ejecuta Spring Boot localmente
2. prueba la API
3. valida escritura en `items.json`
4. abre la interfaz

### Paso 7. Empaquetar el backend

Con Maven:

```bash
mvn clean package
```

### Paso 8. Crear el Dockerfile

Ejemplo base:

```dockerfile
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY backend/pom.xml ./backend/
COPY frontend/package*.json ./frontend/

RUN cd /app/frontend && npm install

COPY backend ./backend
COPY frontend ./frontend

RUN cd /app/frontend && npm run build
RUN mkdir -p /app/backend/src/main/resources/static
RUN cp -r /app/frontend/dist/* /app/backend/src/main/resources/static/
RUN cd /app/backend && mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
```

### Paso 9. Construir la imagen

```bash
docker build -t practica-spring-docker .
```

### Paso 10. Ejecutar el contenedor

```bash
docker run -p 8080:8080 practica-spring-docker
```

Abre `http://localhost:8080`.

### Paso 11. Agregar persistencia con volumen

```bash
docker run -p 8080:8080 -v spring_items_data:/app/data practica-spring-docker
```

### Paso 12. Validar persistencia

1. corre el contenedor con volumen
2. agrega registros
3. elimina el contenedor
4. vuelve a correrlo con el mismo volumen
5. verifica que los datos siguen ahi

## 8. API sugerida

- `GET /api/items`
- `POST /api/items`

Ejemplo de `POST`:

```json
{
  "nombre": "Carlos",
  "grupo": "B"
}
```

## 9. Preguntas de cierre

Debes poder explicar:

1. Por que una imagen no es lo mismo que un contenedor.
2. Que se pierde al eliminar un contenedor sin volumen.
3. Por que el JSON no debe guardarse dentro de recursos del `.jar`.
4. Que ventaja tiene una imagen final mas ligera.
5. Que hace el mapeo de puertos.

## 10. Entregables

- frontend funcional
- backend funcional
- `items.json`
- `Dockerfile`
- evidencia de build, ejecucion y persistencia

## 11. Retos opcionales

- eliminar registros
- actualizar datos
- hacer configurable la ruta `APP_DATA_PATH`
- automatizar la copia del build frontend en Maven