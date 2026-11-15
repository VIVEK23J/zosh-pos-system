package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Category;
import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.mapper.ProductMapper;
import com.zosh.zosh.pos.system.payload.dto.ProductDto;
import com.zosh.zosh.pos.system.repository.CategoryRepository;
import com.zosh.zosh.pos.system.repository.ProductRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImp implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;


    @Override
    public ProductDto createProduct(ProductDto productDto, User user) throws Exception {
        Store store = storeRepository.findById(productDto.getStoreId())
                .orElseThrow(
                        ()-> new Exception("Store not found ")
                );

        Category category = categoryRepository.findById(productDto.getCategoryId()).orElseThrow(
                ()-> new Exception("Category not found ")
        );

        Product product = ProductMapper.mapToEntity(productDto, category, store);
        Product savedProduct = productRepository.save(product);

        return ProductMapper.mapToDto(savedProduct);
    }

    @Override
    public ProductDto updateProduct(ProductDto productDto, User user, Long id) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                ()-> new Exception("Product not found...")
        );


        product.setName(productDto.getName());
        product.setBrand(productDto.getBrand());
        product.setImage(productDto.getImage());
        product.setSellingPrice(productDto.getSellingPrice());
        product.setSku(productDto.getSku());
        product.setDescription(productDto.getDescription());
        product.setUpdatedAt(productDto.getUpdatedAt());

        if(productDto.getCategoryId()!=null){
            Category category =  categoryRepository.findById(productDto.getCategoryId()).orElseThrow(

                    ()-> new Exception("Category not found...")
            );
            product.setCategory(category);
        }

        return ProductMapper.mapToDto(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id, User user) throws Exception {
        Product product = productRepository.findById(id).orElseThrow(
                () -> new Exception("product doesn't exists..")
        );
        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getProductByStoreId(Long storeId) {
        List<Product> products = productRepository.findByStoreId(storeId);
        return products.stream()
                .map(ProductMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> searchProductByKeyword(String keyword, Long storeId) {

        List<Product> products = productRepository.
                searchByKeyword(storeId,keyword);
        return products.stream()
                .map(ProductMapper::mapToDto)
                .collect(Collectors.toList());
    }
}
