package com.zosh.zosh.pos.system.entity;

import com.zosh.zosh.pos.system.enums.UserRoles;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    @Email(message = "Email should be valid or already registered")
    private String email;

    @Column(nullable = false)
    private String phone;

    @ManyToOne
    private Store store;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private UserRoles role;

    @ManyToOne
    private Branch branch;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime last_login_at;
}
