package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Category;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import com.zosh.zosh.pos.system.mapper.CategoryMapper;
import com.zosh.zosh.pos.system.payload.dto.CategoryDto;
import com.zosh.zosh.pos.system.repository.CategoryRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.service.CategoryService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImp implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final StoreRepository storeRepository;

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) throws Exception {

        User user = userService.getCurremtUser();

        Store store = storeRepository.findById(categoryDto.getStoreId())
                .orElseThrow(() -> new Exception("Store not found"));

        Category category = Category.builder()
                .store(store)
                .categoryName(categoryDto.getCategoryName())
                .build();

        checkAuthority(user, category.getStore());

        Category savedCategory = categoryRepository.save(category);

        return CategoryMapper.toDto(savedCategory);
    }

    @Override
    public CategoryDto updateCategory(Long id,CategoryDto categoryDto) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow(
                () -> new Exception("Category not found")
        );
        User user = userService.getCurremtUser();

        checkAuthority(user,category.getStore());

        category.setCategoryName(categoryDto.getCategoryName());

        return CategoryMapper.toDto(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) throws Exception {

        Category category = categoryRepository.findById(id).orElseThrow(
                ()-> new Exception("category not found...")
        );
        User user = userService.getCurremtUser();

        checkAuthority(user,category.getStore());

        categoryRepository.deleteById(category.getId());

    }

    @Override
    public List<CategoryDto> getCategoriesByStoreId(Long storeId) {
        List<Category> categories = categoryRepository.findByStoreId(storeId);
        return categories.stream().map(
                CategoryMapper::toDto
        ).collect(Collectors.toList());
    }

    private void checkAuthority(User user, Store store) throws Exception {

        boolean isAdmin =
                user.getRole().equals(UserRoles.ROLE_STORE_ADMIN);

        boolean isManager =
                user.getRole().equals(UserRoles.ROLE_STORE_MANAGER);

        boolean isSameStore =
                user.equals(store.getStoreAdmin());

        if (!(isAdmin && isSameStore) && !isManager) {
            throw new Exception(
                    "You don't have permission to manage this category"
            );
        }
    }
}
