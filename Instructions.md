# Practice: Docker with Spring Boot + React + TypeScript

## 1. Purpose of the practice

In this practice, you will build a simple web application where:

- the frontend uses React + TypeScript + Tailwind CSS
- the backend uses Spring Boot
- the backend exposes a REST API
- data is stored in a JSON file
- the compiled frontend is served from Spring Boot
- the entire application runs inside a Docker container
- data is persisted using a volume

The goal is to understand both the application and its packaging and portable deployment.

## 2. Learning Objectives

By the end, you should be able to:

- explain what a Docker image is
- explain what a Docker container is
- build a REST API with Spring Boot
- serve static files from `src/main/resources/static`
- read and write a JSON file from Java
- package the app as a `.jar` file
- build and run a Docker image
- use a volume to store data

## 3. Docker Theoretical Foundations

### 3.1 Docker as a Packaging Standard

Docker allows you to distribute applications with their dependencies and minimal runtime configuration in a reproducible image. This reduces differences between the developer's machine, the lab, and the server.

### 3.2 Image, Container, and Volume

You must distinguish between three concepts:

- Image: An immutable template that defines the app and its environment
- Container: The running instance of the image
- Volume: Persistent storage outside the container

### 3.3 Layers of an Image

Each instruction in the Dockerfile creates layers. The order matters because it affects rebuild times and cache reuse.

### 3.4 Ports

Your application will listen inside the container on port 8080 or the port you define.

``bash
```docker run -p 8080:8080 my-app
```

### 3.5 Persistence

If you save data inside the container and then delete it, you lose it. Therefore, the JSON file must reside in a mounted path with a volume.


` ...

### 3.5 Persistence

If you save data inside the container and then delete it, you lose the data. Therefore, the JSON file must reside in a path mounted with a volume.

``````````````````` ### 3.6 Frontend compiled in production

React in production is converted into static files. Spring Boot can serve them from `static/`, allowing for a single deployment.


## 4. Functional Description

Build a Student Registration app with:

- Student list
- Form to create students
- Persistence in `items.json`

Suggested Model:

```json
[
{
"id": 1,
"name": "Ana",
"group": "A"
}
]
```

## 5. Prerequisites

- JDK 17 or higher
- Maven or Gradle
- Node.js 20 or higher
- npm
- Docker Desktop

Verify:

```bash
java -version
mvn -version
node -v
npm -v
docker --version
```

## 6. Suggested Structure

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

## 7. Step by Step

### Step 1. Create the frontend

Build a SPA with React + TypeScript that:

- displays the student list
- has a form
- consumes `GET /api/items`
- sends `POST /api/items`

### Step 2. Integrate Tailwind CSS

Format it with a clear interface:

- title
- main panel
- form
- visible list

### Step 3. Create the backend with Spring Boot

Generate a Spring Boot project with suggested components:

- `ItemController`
- `ItemService`
- `Item`

Responsibilities:

- `GET `/api/items`: Read the JSON and return the list
- `POST /api/items`: Add an item and save the file

Use Jackson for serialization and deserialization.

### Step 4. Define the data file path

Do not write inside the `.jar` packaged resources. Use an external path, for example:

```text
`/app/data/items.json
```

Make it configurable if possible.

### Step 5. Serve the compiled frontend from Spring Boot

Compile the frontend and copy the result to:

```text
`/main/resources/static
```

Spring Boot will serve these files automatically.

### Step 6. Test without Docker

1. run Spring Boot locally
2. test the API
3. validate write in `items.json`
4. open the interface

### Step 7. Package the backend

With Maven:

```bash
mvn clean package
```

### Step 8. Create the Dockerfile

Base example:

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

### Step 9. Build the image

```bash
docker build -t practice-spring-docker .
```

### Step 10. Run the container

```bash
docker run -p 8080:8080 practice

ica-spring-docker
```

Open `http://localhost:8080`.

### Step 11. Add Persistence with Volume

```bash
docker run -p 8080:8080 -v spring_items_data:/app/data practica-spring-docker
```

### Step 12. Validate Persistence

1. Run the container with volume
2. Add records
3. Delete the container
4. Run it again with the same volume
5. Verify that the data is still there

## 8. Suggested APIs

- `GET /api/items`
- `POST /api/items`

Example of `POST`:

```json
{
"name": "Carlos",
"group": "B"
}
```

## 9. Closing Questions

You should be able to explain:

1. Why an image is not the same as a container.

2. What is lost when deleting a container without volume.

3. Why shouldn't JSON be stored within `.jar` resources?

4. What advantage does a lighter final image have?

5. What does port mapping do?

## 10. Deliverables

- Functional frontend
- Functional backend
- `items.json`
- `Dockerfile`
- Evidence of build, execution, and persistence

## 11. Optional Challenges

- Delete records
- Update data
- Make the `APP_DATA_PATH` configurable
- Automate copying the frontend build to Maven