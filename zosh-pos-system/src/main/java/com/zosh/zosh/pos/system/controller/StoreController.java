package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.StoreStatus;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.StoreDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.StoreService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/store")
public class StoreController {

    private final UserService userService;
    private final StoreService storeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<StoreDto> createStore(
            @RequestBody StoreDto storeDto,
            @RequestHeader("Authorization") String jwt
    ) throws UserException {

        User user = userService.getUserFromJwtToken(jwt);
        StoreDto createdStore = storeService.createStore(storeDto, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdStore);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@rbac.canAccessStore(#id)")
    public ResponseEntity<StoreDto> getStoreById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<StoreDto> getStoreByAdmin(
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.getStoreByAdmin());
    }

    @GetMapping("/employee")
    public ResponseEntity<StoreDto> getStoreByEmployee(
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.getStoreByEmployee());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN') and @rbac.canManageStore(#id)")
    public ResponseEntity<StoreDto> updateStore(
            @RequestBody StoreDto storeDto,
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.updateStore(storeDto, id));
    }

    @GetMapping("/stores")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<List<StoreDto>> getAllStores(
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @PutMapping("/{id}/moderate")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<StoreDto> moderateStore(
            @PathVariable Long id,
            @RequestParam StoreStatus status,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {
        return ResponseEntity.ok(storeService.moderateStore(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<ApiResponse> deleteStore(
            @PathVariable Long id) throws UserException {

        storeService.deleteStore(id);
        ApiResponse response = new ApiResponse();
        response.setMessage("Store successfully deleted");
        return ResponseEntity.ok(response);
    }
}
