package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;

public class StoreMapper {

    public static StoreDto toDTO(Store store) {
        if (store == null) {
            return null;
        }

        StoreDto storeDto = new StoreDto();
        storeDto.setId(store.getId());
        storeDto.setBrand(store.getBrand());
        storeDto.setDescription(store.getDescription());
        storeDto.setStoreAdmin(UserMapper.toDTO(store.getStoreAdmin()));
        storeDto.setStoreType(store.getStoreType());
        storeDto.setContact(store.getContact());
        storeDto.setCreatedDate(store.getCreatedDate());
        storeDto.setUpdatedDate(store.getUpdatedDate());
        storeDto.setStoreStatus(store.getStoreStatus());

        return storeDto;
    }

    public static Store toEntity(StoreDto storeDto, User storeAdmin) {
        if (storeDto == null) {
            return null;
        }

        Store store = new Store();
        store.setBrand(storeDto.getBrand());
        store.setDescription(storeDto.getDescription());
        store.setStoreAdmin(storeAdmin);
        store.setStoreType(storeDto.getStoreType());
        store.setContact(storeDto.getContact());

        return store;
    }
}
