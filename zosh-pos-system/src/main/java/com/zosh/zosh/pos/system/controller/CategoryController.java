package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.payload.dto.CategoryDto;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<CategoryDto> createCategory(
            @RequestBody CategoryDto categoryDto) throws Exception {

        return ResponseEntity.ok()
                .body(categoryService.createCategory(categoryDto));
    }

    @GetMapping("/store/{storeId}")
    @PreAuthorize("@rbac.canAccessStore(#storeId)")
    public ResponseEntity<List<CategoryDto>> getCategoryByStoreId(
            @PathVariable Long storeId) throws Exception {

        return ResponseEntity.ok(
                categoryService.getCategoriesByStoreId(storeId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDto categoryDto
    ) throws Exception {
        return ResponseEntity.ok()
                .body(categoryService.updateCategory(id, categoryDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'STORE_ADMIN')")
    public ResponseEntity<ApiResponse> deleteCategory(
            @PathVariable Long id
    ) throws Exception {
        categoryService.deleteCategory(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Category deleted successfully");
        return ResponseEntity.ok()
                .body(apiResponse);
    }
}
