package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.payload.dto.ProductDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.ProductService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        try {
            User user = userService.getCurremtUser();
            Long storeId = user.getStore() != null ? user.getStore().getId() : 1L;
            return ResponseEntity.ok(productService.getProductByStoreId(storeId));
        } catch (Exception e) {
            try {
                return ResponseEntity.ok(productService.getProductByStoreId(1L));
            } catch (Exception ex) {
                return ResponseEntity.ok(Collections.emptyList());
            }
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ProductDto> createProduct(
            @RequestBody ProductDto productDto,
            @RequestHeader(value = "Authorization", required = false) String jwt
    ) throws Exception {

        User user = userService.getCurremtUser();
        return ResponseEntity.ok(
                productService.createProduct(productDto, user)
        );
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("@rbac.canAccessStore(#storeId)")
    public ResponseEntity<List<ProductDto>> getByStoreId(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @PathVariable("storeId") Long storeId
    ) throws Exception {

        return ResponseEntity.ok(
                productService.getProductByStoreId(storeId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @RequestBody ProductDto productDto,
            @PathVariable Long id
    ) throws Exception {
        User user = userService.getCurremtUser();
        return ResponseEntity.ok(
                productService.updateProduct(productDto, user, id)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ApiResponse> deleteProduct(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @PathVariable Long id
    ) throws Exception {
        User user = userService.getCurremtUser();
        productService.deleteProduct(id, user);

        ApiResponse response = new ApiResponse();
        response.setMessage("Product successfully deleted");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    @PreAuthorize("@rbac.canAccessStore(#storeId)")
    public ResponseEntity<List<ProductDto>> searchProductByKeyword(
            @RequestHeader(value = "Authorization", required = false) String jwt,
            @RequestParam String keyword,
            @RequestParam Long storeId
    ) throws Exception {

        return ResponseEntity.ok(
                productService.searchProductByKeyword(keyword, storeId)
        );
    }
}
