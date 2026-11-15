package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.config.JwtProvider;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UserServiceImp implements UserService {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    public UserServiceImp(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }

    @Override
    public User getUserFromJwtToken(String token) throws UserException {
        String email = jwtProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("Invalid token");
        }

        return user;
    }

    @Override
    public User getCurremtUser() throws UserException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("user not found");
        }

        return user;
    }

    @Override
    public User getUserByEmail(String email) throws UserException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("userEmail not exists");
        }
        return user;
    }

    @Override
    public User getUserById(Long id) throws UserException {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserException("User ID not found: " + id)
                );
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
