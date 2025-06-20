package com.kingsman.Kingsman.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
public class TableManage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    int tableNumber;

    boolean tableAvailability;
    Date date;
}
