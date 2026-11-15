package com.zosh.zosh.pos.system.payload.response;

import com.zosh.zosh.pos.system.payload.dto.UserDto;
import jakarta.persistence.Column;
import lombok.*;

@Data
public class AuthResponse {

    private String jwt;
    private String message;
    private UserDto user;

}
