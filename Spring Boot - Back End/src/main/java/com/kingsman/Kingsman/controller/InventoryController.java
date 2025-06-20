package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.exception.ItemNotFoundExeption;
import com.kingsman.Kingsman.model.InventoryItem;
import com.kingsman.Kingsman.model.InventoryItemUsageLog;
import com.kingsman.Kingsman.service.InventoryService;
import com.sun.jdi.event.StepEvent;
import org.aspectj.apache.bcel.util.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/add") //agregar el artículo del inventario
    public ResponseEntity<String> addItemToInventory(@RequestBody InventoryItem item) {
        inventoryService.addItemInventory(item);
        return ResponseEntity.ok("Ingrediente añadido al inventario con éxito");
    }
    @GetMapping("/view") //ver todos los artículos del inventario
    public ResponseEntity<List<InventoryItem>> viewInventory(){
        List<InventoryItem> inventoryItems = inventoryService.getAllInventoryItems();
        return ResponseEntity.ok(inventoryItems);
    }
    @GetMapping("/view/{itemId}")
    public ResponseEntity<InventoryItem> viewInventoryItemById(@PathVariable long itemId){
        InventoryItem inventoryItem = inventoryService.getInventoryItemById(itemId);
        if(inventoryItem != null){
            return ResponseEntity.ok(inventoryItem);
        }else{
            throw new ItemNotFoundExeption(itemId); //throw exception
        }
    }
    @PutMapping("/edit/{itemId}")//editar elemento por id
    public ResponseEntity<String> editInventoryItem(@PathVariable long itemId, @RequestBody InventoryItem updateItem){
        if(inventoryService.editInventoryItem(itemId,updateItem)){
            return ResponseEntity.ok("Ingrediente de inventario actualizado exitosamente");
        }else {
            throw new ItemNotFoundExeption(itemId); //throw exception
            //return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/delete/{itemId}")
    public ResponseEntity<String> deleteInventoryItem(@PathVariable long itemId){
        boolean success = inventoryService.deleteInventoryItemById(itemId);
        if(success){
            return ResponseEntity.ok("Ingrediente de inventario eliminado correctamente");
        }else{
            throw new ItemNotFoundExeption(itemId);//throw exception
            //return ResponseEntity.notFound().build();
        }

    }
    @PutMapping("/use/{itemId}/{quantity}") //Disminuir y actualizar el inventario y el estado de actualización de la tienda en otra tabla
    public ResponseEntity<String> useInventoryItem(@PathVariable long itemId, @PathVariable float quantity){
        boolean success = inventoryService.useInventoryItem(itemId,quantity);
        if (success){
            return ResponseEntity.ok("ingrediente utilizado con éxito");
        }else {
            throw new ItemNotFoundExeption(itemId);
        }
    }
    
    @GetMapping("/inventory-usage-log/{date}")
    public ResponseEntity<?> getInventoryUsageLogForDate(@PathVariable @DateTimeFormat(iso =DateTimeFormat.ISO.DATE)LocalDate date){
        if (date == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Por favor seleccione la fecha");
        }
        List<InventoryItemUsageLog> inventoryItemUsageLogs = inventoryService.getInventoryUsageForDate(date);
        return ResponseEntity.ok(inventoryItemUsageLogs);
    }

    // Obtenga el precio total del mes actual
    @GetMapping("/total-price/month")
    public ResponseEntity<Float> getTotalPriceForCurrentMonth() {
        Float totalPrice = inventoryService.getTotalPriceForCurrentMonth();
        return ResponseEntity.ok(totalPrice);
    }

    // Obtenga el precio total para el año actual
    @GetMapping("/total-price/year")
    public ResponseEntity<Float> getTotalPriceForCurrentYear() {
        Float totalPrice = inventoryService.getTotalPriceForCurrentYear();
        return ResponseEntity.ok(totalPrice);
    }
}
