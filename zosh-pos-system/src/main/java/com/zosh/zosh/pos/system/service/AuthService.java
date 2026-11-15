package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.UserDto;
import com.zosh.zosh.pos.system.payload.response.AuthResponse;

public interface AuthService {


    AuthResponse signup(UserDto userDto) throws UserException;

    AuthResponse login(UserDto userDto) throws UserException;
}
