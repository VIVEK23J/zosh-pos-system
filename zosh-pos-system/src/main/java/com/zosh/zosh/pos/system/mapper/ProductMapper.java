
package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Category;
import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.payload.dto.ProductDto;

public class ProductMapper {

    public static ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .brand(product.getBrand())
                .mrp(product.getMrp())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .image(product.getImage())
                .sellingPrice(product.getSellingPrice())
                .category(
                        product.getCategory() != null
                                ? CategoryMapper.toDto(product.getCategory())
                                : null
                )
                .categoryId(
                        product.getCategory() != null
                                ? product.getCategory().getId()
                                : null
                )
                .storeId(
                        product.getStore() != null
                                ? product.getStore().getId()
                                : null
                )
                .build();
    }

    public static Product mapToEntity(
            ProductDto productDto,
            Category category,
            Store store) {

        return Product.builder()
                .id(productDto.getId())
                .name(productDto.getName())
                .sku(productDto.getSku()) // Fix: map SKU
                .description(productDto.getDescription())
                .brand(productDto.getBrand())
                .mrp(productDto.getMrp())
                .sellingPrice(productDto.getSellingPrice())
                .image(productDto.getImage()) // Fix: map image
                .category(category)
                .store(store)
                .createdAt(productDto.getCreatedAt())
                .updatedAt(productDto.getUpdatedAt())
                .build();
    }
}
