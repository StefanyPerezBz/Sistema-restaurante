package com.kingsman.Kingsman.controller;

import com.kingsman.Kingsman.model.Bonus;
import com.kingsman.Kingsman.service.BonusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bonus")
public class BonusController {

    @Autowired
    private BonusService bonusService;

    @PostMapping
    public Bonus createBonus(@RequestBody Bonus bonus) {
        return bonusService.saveBonus(bonus);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bonus> updateBonus(@PathVariable Long id, @RequestBody Bonus bonusDetails) {
        Optional<Bonus> bonusData = bonusService.getBonusById(id);

        if (bonusData.isPresent()) {
            Bonus bonus = bonusData.get();
            bonus.setEmpName(bonusDetails.getEmpName());
            bonus.setBonusType(bonusDetails.getBonusType());
            bonus.setBonus(bonusDetails.getBonus());

            Bonus updatedBonus = bonusService.saveBonus(bonus);
            return new ResponseEntity<>(updatedBonus, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteBonus(@PathVariable Long id) {
        try {
            bonusService.deleteBonus(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public List<Bonus> getAllBonuses() {
        return bonusService.getAllBonuses();
    }
}
