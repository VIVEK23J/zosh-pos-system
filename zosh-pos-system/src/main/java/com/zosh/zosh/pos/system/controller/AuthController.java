package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.payload.response.AuthResponse;
import com.zosh.zosh.pos.system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(@RequestBody UserDto userDto) throws UserException {

        System.out.println("SIGNUP CONTROLLER REACHED");
        return ResponseEntity.ok(
                authService.signup(userDto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody UserDto userDto) throws UserException {

        return ResponseEntity.ok(
                authService.login(userDto));
    }
}
