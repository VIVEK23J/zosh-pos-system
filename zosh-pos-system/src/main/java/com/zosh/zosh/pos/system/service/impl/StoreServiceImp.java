package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.StoreContact;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.mapper.StoreMapper;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.service.StoreService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreServiceImp implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDto createStore(StoreDto storeDto, User user)
            throws UserException {

        if (user == null) {
            throw new UserException("User not found");
        }

        Store store = StoreMapper.toEntity(storeDto, user);

        return StoreMapper.toDTO(storeRepository.save(store));
    }

    @Override
    public StoreDto updateStore(StoreDto storeDto, Long id)
            throws Exception {

        User currentUser = userService.getCurremtUser();

        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new Exception("Store not found"));

        // Only the store's owner can update it.
        if (store.getStoreAdmin() == null
                || !store.getStoreAdmin().getId()
                .equals(currentUser.getId())) {
            throw new Exception(
                    "You are not authorized to update this store"
            );
        }

        if (storeDto.getBrand() != null) {
            store.setBrand(storeDto.getBrand());
        }

        if (storeDto.getDescription() != null) {
            store.setDescription(storeDto.getDescription());
        }

        if (storeDto.getStoreType() != null) {
            store.setStoreType(storeDto.getStoreType());
        }

        if (storeDto.getContact() != null) {
            StoreContact contact = store.getContact();

            if (contact == null) {
                contact = new StoreContact();
            }

            if (storeDto.getContact().getAddress() != null) {
                contact.setAddress(
                        storeDto.getContact().getAddress()
                );
            }

            if (storeDto.getContact().getEmail() != null) {
                contact.setEmail(
                        storeDto.getContact().getEmail()
                );
            }

            if (storeDto.getContact().getPhone() != null) {
                contact.setPhone(
                        storeDto.getContact().getPhone()
                );
            }

            store.setContact(contact);
        }

        Store updatedStore = storeRepository.save(store);

        return StoreMapper.toDTO(updatedStore);
    }

    @Override
    public void deleteStore(Long id) throws UserException {

        User currentUser = userService.getCurremtUser();

        Store store = storeRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Store not found"
                        )
                );

        if (store.getStoreAdmin() == null
                || !store.getStoreAdmin().getId()
                .equals(currentUser.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to delete this store"
            );
        }

        storeRepository.delete(store);
    }

    @Override
    @Transactional(readOnly = true)
    public StoreDto getStoreById(Long id) throws Exception {

        Store store = storeRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Store not found")
                );

        return StoreMapper.toDTO(store);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StoreDto> getAllStores() {

        return storeRepository.findAll()
                .stream()
                .map(StoreMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StoreDto getStoreByAdmin() throws UserException {

        User admin = userService.getCurremtUser();

        Store store = storeRepository.findByStoreAdminId(
                admin.getId()
        );

        if (store == null && admin.getStore() != null) {
            store = admin.getStore();
        }

        if (store == null) {
            throw new UserException(
                    "No store found for this admin"
            );
        }

        return StoreMapper.toDTO(store);
    }

    @Override
    @Transactional(readOnly = true)
    public StoreDto getStoreByEmployee() throws Exception {

        User currentUser = userService.getCurremtUser();

        if (currentUser == null) {
            throw new Exception("User not found");
        }

        Store store = currentUser.getStore();

        if (store == null) {
            throw new Exception(
                    "No store is associated with this employee"
            );
        }

        return StoreMapper.toDTO(store);
    }

    @Override
    public StoreDto moderateStore(Long id, StoreStatus status)
            throws Exception {

        if (status == null) {
            throw new IllegalArgumentException(
                    "Store status is required"
            );
        }

        Store store = storeRepository.findById(id)
                .orElseThrow(
                        () -> new Exception("Store not found")
                );

        // Authorization must be enforced here or through
        // Spring Security before this method can be called.
        store.setStoreStatus(status);

        Store updatedStore = storeRepository.save(store);

        return StoreMapper.toDTO(updatedStore);
    }
}
