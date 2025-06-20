package com.kingsman.Kingsman.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final String uploadDir = "./src/main/resources/static/images"; // Path to your local folder where images will be stored

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Crea el directorio si no existe
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            // Generar un nombre de archivo único
            String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;

            // Guarde el archivo en el directorio de carga
            Path filePath = Paths.get(uploadDir + File.separator + uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            // Devuelve la URL del archivo almacenado
            return uniqueFileName; // Suponiendo que las imágenes se sirven desde un directorio llamado "imágenes"
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo almacenar el archivo " + fileName, ex);
        }
    }
}

