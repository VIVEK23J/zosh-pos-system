package com.zosh.zosh.pos.system.payload.dto;

import com.zosh.zosh.pos.system.enums.UserRoles;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String password;
    private Long branchId;
    private Long storeId;


    private UserRoles role;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login_at;
}
