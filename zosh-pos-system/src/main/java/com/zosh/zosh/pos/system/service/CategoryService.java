package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.payload.dto.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CategoryDto categoryDto) throws Exception;
    CategoryDto updateCategory(Long id,CategoryDto categoryDto) throws Exception;
    void deleteCategory(Long id) throws Exception;
    List<CategoryDto> getCategoriesByStoreId(Long storeId);



}
