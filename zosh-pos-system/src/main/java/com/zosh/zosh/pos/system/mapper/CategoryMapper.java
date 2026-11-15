package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Category;
import com.zosh.zosh.pos.system.payload.dto.CategoryDto;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .storeId(category.getStore()!=null?category
                        .getStore().getId():null)
                .build();
    }
}
