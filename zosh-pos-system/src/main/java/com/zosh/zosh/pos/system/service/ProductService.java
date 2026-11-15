package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.payload.dto.ProductDto;

import java.util.List;

public interface ProductService {

    ProductDto createProduct(ProductDto productDto, User user) throws Exception;
    ProductDto updateProduct(ProductDto productDto, User user,Long id) throws Exception;
    void deleteProduct(Long id, User user) throws Exception;
    List<ProductDto> getProductByStoreId(Long storeId);
    List<ProductDto> searchProductByKeyword(String keyword, Long storeId);

}
