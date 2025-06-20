package com.kingsman.Kingsman.service;

import com.kingsman.Kingsman.model.FoodItem;
import com.kingsman.Kingsman.model.InventoryItem;
import com.kingsman.Kingsman.repository.FoodItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository; //  get data from repository

    public FoodItem saveFoodItem(FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }//This method saves a FoodItem object to the repository.
    // It takes a FoodItem as an argument and returns the saved item.

    public List<String> getAllCategories() {
        return foodItemRepository.findAllCategories();
    }  // This method retrieves a list of all food categories from the repository.
    // It returns a list of strings representing the available categories

    public List<FoodItem> getItemsByCategory(String category) {
        return foodItemRepository.findByFoodCategory(category);
    }//Given a specific category, this method retrieves a list of FoodItem objects associated with that category.

    public List<FoodItem> getAllItems() {

        return foodItemRepository.findAll();
    }//This method retrieves all food items from the repository.

    public List<FoodItem> getAllAvailableItems() {
        List<FoodItem> allItems = foodItemRepository.findAll();
        return allItems.stream()
                .filter(FoodItem::isAvailable) // Filter out items where availability is false
                .collect(Collectors.toList());
    }


    public void deleteFoodItem(Long foodItemId) {

        foodItemRepository.deleteById(foodItemId);
    }//This method deletes a FoodItem from the repository based on its unique identifier (foodItemId).


    public Optional<FoodItem> getFoodNameById(Long foodItemId) {
        return foodItemRepository.findById(foodItemId);
    }

    public boolean updateFoodAvailability(long foodId){
        Optional<FoodItem> existingFoodItemOptional = foodItemRepository.findById(foodId);
        if(existingFoodItemOptional.isPresent()){
            FoodItem existingFoodItem = existingFoodItemOptional.get();

            boolean newAvailability = !existingFoodItem.isAvailable(); // Toggle the availability
            existingFoodItem.setAvailable(newAvailability); // Save the updated food item
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
        Optional<FoodItem> existingItemOptional = foodItemRepository.findById(foodId); //find the existing Food item in repo using Id

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
