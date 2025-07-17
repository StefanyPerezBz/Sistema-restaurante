package com.restaurante.restaurante.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;


import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
//@CrossOrigin("http://localhost:3000")
@CrossOrigin(origins = "https://sistema-restaurante-production-896d.up.railway.app/")
@RequestMapping("/api/food")
public class ImageController {
    private final String uploadDir = "./src/main/resources/static/images"; // Ruta a su carpeta local donde se almacenan las imágenes

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Por favor seleccione una imagen"));
            }

            // Validar tipo de archivo
            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Solo se permiten archivos de imagen"));
            }

            // Crear directorio si no existe
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) {
                uploadPath.mkdirs();
            }

            // Generar nombre único para el archivo
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Guardar archivo
            Path filePath = Paths.get(uploadDir, uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of(
                    "message", "Imagen subida correctamente",
                    "imageName", uniqueFilename
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error al subir la imagen"));
        }
    }

    @GetMapping("/image/{imageName:.+}")
    public Resource downloadImage(@PathVariable String imageName) throws MalformedURLException {
        Path imagePath = Paths.get(uploadDir).resolve(imageName);
        Resource resource = new UrlResource(imagePath.toUri());
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("No se pudo cargar la imagen: " + imageName);
        }
    }
}
