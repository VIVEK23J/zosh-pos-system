package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.Category;
import com.zosh.zosh.pos.system.payload.dto.CategoryDto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByStoreId(Long storeId);
}
