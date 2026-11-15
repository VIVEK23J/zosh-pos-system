package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;

import java.util.List;

public interface StoreService {

    StoreDto createStore(StoreDto storeDto, User user) throws UserException;
    StoreDto updateStore(StoreDto storeDto, Long id) throws Exception;
    void deleteStore(Long id) throws UserException;
    StoreDto getStoreById(Long id) throws Exception;
    List<StoreDto> getAllStores();
    StoreDto getStoreByAdmin() throws UserException;
    StoreDto getStoreByEmployee() throws Exception;
    StoreDto moderateStore(Long id, StoreStatus status) throws Exception;

}
