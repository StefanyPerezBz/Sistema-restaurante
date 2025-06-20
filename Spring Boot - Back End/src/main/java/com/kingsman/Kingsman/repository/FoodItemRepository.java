package com.kingsman.Kingsman.repository;

import com.kingsman.Kingsman.model.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    @Query("select distinct f.foodCategory from FoodItem f") // Conectar la base de datos, obtener todas las categorías de la base de datos
    List<String> findAllCategories();

    List<FoodItem> findByFoodCategory(String foodCategory);// encontrar categoría relacionada con la comida
}
