# Build stage
FROM maven:3.8.5-openjdk-17-slim AS build

WORKDIR /app
COPY . .

# Clean any existing build artifacts
RUN rm -rf target/

# Run Maven directly (not using the wrapper)
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]