# Etapa 1: Construcción
FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /app

COPY . .

# Clean Maven cache to avoid potential conflicts
RUN rm -rf /root/.m2/repository

# Make sure wrapper is executable
RUN chmod +x mvnw

# Build with wrapper or use direct mvn command
RUN ./mvnw clean package -DskipTests -Dmaven.repo.local=/tmp/m2/repository
# OR use this instead:
# RUN mvn clean package -DskipTests

# Etapa 2: Ejecución
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]