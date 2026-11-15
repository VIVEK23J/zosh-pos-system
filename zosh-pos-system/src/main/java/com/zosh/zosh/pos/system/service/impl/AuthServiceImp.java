package com.zosh.zosh.pos.system.service.impl;


import com.zosh.zosh.pos.system.config.JwtProvider;
import com.zosh.zosh.pos.system.mapper.UserMapper;
import com.zosh.zosh.pos.system.payload.dto.UserDto;

import com.zosh.zosh.pos.system.payload.response.AuthResponse;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;

@Service
@RequiredArgsConstructor(onConstructor_ = @Autowired)

public class AuthServiceImp implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtProvider jwtProvider;


    @Override
    public AuthResponse signup(UserDto userDto) throws UserException {
        User user  = userRepository.findByEmail(userDto.getEmail());
        if(user != null){
            throw new UserException("Email already exists");

        }
        if (userDto.getRole() == UserRoles.ROLE_ADMIN) {
            throw new UserException(
                    "You are not allowed to use this service"
            );
        }

        User userEntity = new User();

        userEntity.setEmail(userDto.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userDto.getPassword()));
        userEntity.setRole(userDto.getRole());
        userEntity.setFullName(userDto.getFullName());
        userEntity.setPhone(userDto.getPhone());
        userEntity.setCreated_at(LocalDateTime.now());
        userEntity.setUpdated_at(LocalDateTime.now());
        userEntity.setLast_login_at(LocalDateTime.now());


        User saveUser = userRepository.save(userEntity);

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(
                        saveUser.getEmail()
                );

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(),
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext()
                .setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Registered Successfully");
        authResponse.setUser(UserMapper.toDTO(saveUser));


        return authResponse;

    }

    @Override
    public AuthResponse login(UserDto userDto) throws UserException {
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        Authentication authentication = authenticate(email,password);

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        String role = authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(email);

        user.setLast_login_at(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Login Successfully");
        authResponse.setUser(UserMapper.toDTO(user));




        return authResponse;
    }

    private Authentication authenticate(String email, String password) throws UserException {

        UserDetails userDetails =  customUserDetailsService.loadUserByUsername(email);

        if(userDetails == null){
            throw  new UserException("Invalid username");

        }
        if(!passwordEncoder.matches(password,userDetails.getPassword())){
            throw  new UserException("Invalid username or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }
}
