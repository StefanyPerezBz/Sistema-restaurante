package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.exception.ItemNotFoundExeption;
import com.kingsman.Kingsman.model.FoodItem;
import com.kingsman.Kingsman.model.InventoryItem;
import com.kingsman.Kingsman.service.FileStorageService;
import com.kingsman.Kingsman.service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController                                                                                      // connect to ApI/UI
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/food")
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;
    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/add")//Agregar un alimento
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody FoodItem foodItem) {                    //FoodItem MODel created fooditem object put front end data to this object
        FoodItem savedFoodItem = foodItemService.saveFoodItem(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFoodItem);                        // Http response status
    }

    @GetMapping("/categories") //El método recupera una lista de categorías de alimentos.
    public ResponseEntity<List<String>> getAllCategories() {                                          // created list
        List<String> categories = foodItemService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{category}") //Obtener artículos por categoría: recupera alimentos según una categoría específica.
    public ResponseEntity<List<FoodItem>> getItemsByCategory(@PathVariable String category) {        // get path example related category
        List<FoodItem> items = foodItemService.getItemsByCategory(category);
        return ResponseEntity.ok(items);
    }


    @GetMapping("/all") //conseguir todos los alimentos
    public ResponseEntity<List<FoodItem>> getAllItems() {
        List<FoodItem> items = foodItemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/available") // Consigue todos los alimentos disponibles
    public ResponseEntity<List<FoodItem>> getAllAvailableItems() {
        List<FoodItem> availableItems = foodItemService.getAllAvailableItems();
        return ResponseEntity.ok(availableItems);
    }

    @DeleteMapping("/{id}") //El metodo elimina un alimento según su identificación.
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/update-availability/{foodId}") //alternar la disponibilidad de alimentos
    public boolean updateFoodAvailability(@PathVariable Long foodId){
        return foodItemService.updateFoodAvailability(foodId);
    }

    @DeleteMapping("/delete/{foodId}")//eliminar artículo de comida por Id
    public ResponseEntity<String> deleteFoodItemById(@PathVariable Long foodId){
        foodItemService.deleteFoodItem(foodId);
        return ResponseEntity.ok("FoodItem Successfully Deleted");
    }

    @GetMapping("/get/{foodId}") //Consigue el alimento por Id
    public ResponseEntity<FoodItem> getFoodItemById(@PathVariable Long foodId){
        Optional<FoodItem> optionalItem = foodItemService.getFoodNameById(foodId);
        if (optionalItem.isPresent()) {
            FoodItem item = optionalItem.get();
            return ResponseEntity.ok(item); // Return the item with HTTP status 200 OK
        } else {
            return ResponseEntity.notFound().build(); // Return HTTP status 404 Not Found
        }
    }

    @PostMapping("/upload-image/{foodId}") //Actualizar la imagen del artículo de comida por foodId
    public ResponseEntity<String> uploadFoodItemImage(@PathVariable Long foodId, @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = null;
        imageUrl = fileStorageService.storeFile(file);
        FoodItem foodItem = foodItemService.getFoodItemById(foodId);
        if (foodItem != null) {
            foodItem.setFoodImageURL(imageUrl);
            foodItemService.saveFoodItem(foodItem);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(imageUrl);
    }

    @PutMapping("/edit/{foodId}") //edit food item by Id
    public ResponseEntity<String> editFoodItem(@PathVariable long foodId, @RequestBody FoodItem updateFood){
        if(foodItemService.editFoodItem(foodId,updateFood)){
            return ResponseEntity.ok("Artículo de comida actualizado con éxito");
        }else {
            throw new ItemNotFoundExeption(foodId); //throw exception
            //return ResponseEntity.notFound().build();
        }
    }

}
