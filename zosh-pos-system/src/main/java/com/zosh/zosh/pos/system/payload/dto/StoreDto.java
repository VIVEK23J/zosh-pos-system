package com.zosh.zosh.pos.system.payload.dto;

import com.zosh.zosh.pos.system.entity.StoreContact;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class StoreDto {

    private Long id;

    private String brand;
    private UserDto storeAdmin;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private String description;
    private String storeType;
    private StoreStatus storeStatus;

    private StoreContact contact;


}
