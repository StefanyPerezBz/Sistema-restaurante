# Etapa 1: Construcción
FROM maven:3.8.5-openjdk-17-slim AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el contenido del proyecto
COPY . .

# Construye el proyecto usando Maven
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución
FROM openjdk:17-jdk-slim

# Establece el directorio de trabajo para la aplicación final
WORKDIR /app

# Copia el JAR generado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto usado por Spring Boot
EXPOSE 8080

# Comando para iniciar la app
ENTRYPOINT ["java", "-jar", "app.jar"]
