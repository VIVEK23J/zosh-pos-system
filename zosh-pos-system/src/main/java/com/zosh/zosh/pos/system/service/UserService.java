package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.exception.UserException;

import java.util.List;

public interface UserService {

    User getUserFromJwtToken(String token) throws UserException;
    User getCurremtUser() throws UserException;
    User getUserByEmail(String email) throws UserException;
    User getUserById(Long id) throws UserException;
    List<User> getAllUsers();

}
