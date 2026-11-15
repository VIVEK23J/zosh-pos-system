package com.zosh.zosh.pos.system.payload.request;

import com.zosh.zosh.pos.system.enums.UserRoles;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor

public class AuthRequest {

    @Column(nullable = false)

    private String fullName;
    @Column(nullable = false, unique = true)
    @Email(message = "Email should be valid 0r already register ")
    private String email;
    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private UserRoles role;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login_at;


}
