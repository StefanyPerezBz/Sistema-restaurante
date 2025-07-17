# Etapa 1: Construcción
FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /app

COPY . .

# 👉 Dale permisos al script mvnw
RUN chmod +x mvnw

# Construye el proyecto sin correr tests
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
