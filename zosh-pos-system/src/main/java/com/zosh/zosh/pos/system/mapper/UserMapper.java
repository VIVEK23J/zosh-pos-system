package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.payload.dto.UserDto;

public class UserMapper {

    public static UserDto toDTO(User user) {
        if (user == null) {
            return null;
        }

        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());

        dto.setStoreId(
                user.getStore() != null
                        ? user.getStore().getId()
                        : null
        );

        dto.setBranchId(
                user.getBranch() != null
                        ? user.getBranch().getId()
                        : null
        );

        dto.setCreated_at(user.getCreated_at());
        dto.setUpdated_at(user.getUpdated_at());
        dto.setLast_login_at(user.getLast_login_at());

        return dto;
    }

    public static User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        User user = new User();

        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setRole(userDto.getRole());
        user.setCreated_at(userDto.getCreated_at());
        user.setUpdated_at(userDto.getUpdated_at());
        user.setLast_login_at(userDto.getLast_login_at());
        user.setPhone(userDto.getPhone());
        user.setPassword(userDto.getPassword());

        return user;
    }
}
