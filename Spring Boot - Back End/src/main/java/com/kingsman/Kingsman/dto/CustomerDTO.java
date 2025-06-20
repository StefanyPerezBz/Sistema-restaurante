package com.kingsman.Kingsman.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CustomerDTO {
    private Long cusId;
    private String cusName;
    private String cusMobile;
    private String cusEmail;
    private Integer employeeId;
    private LocalDateTime addedDate;
    private LocalDateTime updatedDate;

    // Constructor
    public CustomerDTO() {

    }

}
