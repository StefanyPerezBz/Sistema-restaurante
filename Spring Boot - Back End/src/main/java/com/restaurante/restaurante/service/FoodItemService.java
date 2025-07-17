package com.restaurante.restaurante.service;

import com.restaurante.restaurante.model.FoodItem;
import com.restaurante.restaurante.model.InventoryItem;
import com.restaurante.restaurante.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository; //

    public FoodItem saveFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }
    // Toma un FoodItem como argumento y devuelve el elemento guardado.

    public List<String> getAllCategories() {
        return foodItemRepository.findAllCategories();
    }
    // Devuelve una lista de cadenas que representan las categorías disponibles.

    public List<FoodItem> getItemsByCategory(String category) {
        return foodItemRepository.findByFoodCategory(category);
    }//Dada una categoría específica, este metodo recupera una lista de objetos FoodItem asociados con esa categoría.

    public List<FoodItem> getAllItems() {

        return foodItemRepository.findAll();
    }//.

    public List<FoodItem> getAllAvailableItems() {
        List<FoodItem> allItems = foodItemRepository.findAll();
        return allItems.stream()
                .filter(FoodItem::isAvailable) // Filtrar artículos cuya disponibilidad es falsa
                .collect(Collectors.toList());
    }


    public void deleteFoodItem(Long foodItemId) {

        foodItemRepository.deleteById(foodItemId);
    }//Este metodo elimina un alimento del repositorio en función de su identificador único (foodItemId).


    public Optional<FoodItem> getFoodNameById(Long foodItemId) {
        return foodItemRepository.findById(foodItemId);
    }

    public boolean updateFoodAvailability(long foodId){
        Optional<FoodItem> existingFoodItemOptional = foodItemRepository.findById(foodId);
        if(existingFoodItemOptional.isPresent()){
            FoodItem existingFoodItem = existingFoodItemOptional.get();

            boolean newAvailability = !existingFoodItem.isAvailable(); // Alternar la disponibilidad
            existingFoodItem.setAvailable(newAvailability); // Guardar el alimento actualizado
            foodItemRepository.save(existingFoodItem);
            return true;
        }
        return false;
    }

    public FoodItem getFoodItemById(Long foodId) {
        Optional<FoodItem> foodItemOptional = foodItemRepository.findById(foodId);
        return foodItemOptional.orElse(null);
    }

    public boolean editFoodItem(long foodId, FoodItem updatedFood){
        Optional<FoodItem> existingItemOptional = foodItemRepository.findById(foodId); //Encuentra el artículo de comida existente en el repositorio usando Id.

        FoodItem existingItem = existingItemOptional.get();

        existingItem.setFoodName(updatedFood.getFoodName());
        existingItem.setFoodPrice(updatedFood.getFoodPrice());
        foodItemRepository.save(existingItem);

        if (existingItemOptional.isPresent()) {

            return true;
        }else {
            return false;
        }
    }


}
