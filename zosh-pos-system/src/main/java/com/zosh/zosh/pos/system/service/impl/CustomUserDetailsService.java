package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.repository.UserRepository;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username);

        if (user == null) {
            throw new UsernameNotFoundException(
                    "User not found with email: " + username
            );
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        UserRoles role = user.getRole();
        if (role != null) {
            authorities.add(new SimpleGrantedAuthority(role.name()));

            // Normalize dual-alias authorities for seamless RBAC checks
            if (role == UserRoles.ROLE_SUPER_ADMIN || role == UserRoles.ROLE_ADMIN) {
                authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
            } else if (role == UserRoles.ROLE_STORE_ADMIN) {
                authorities.add(new SimpleGrantedAuthority("ROLE_STORE_ADMIN"));
            } else if (role == UserRoles.ROLE_MANAGER || role == UserRoles.ROLE_BRANCH_MANAGER || role == UserRoles.ROLE_STORE_MANAGER) {
                authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
                authorities.add(new SimpleGrantedAuthority("ROLE_BRANCH_MANAGER"));
            } else if (role == UserRoles.ROLE_CASHIER) {
                authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
