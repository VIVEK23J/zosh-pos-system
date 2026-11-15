package com.zosh.zosh.pos.system.mapper;


import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Inventory;
import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.payload.dto.InventoryDto;

public class InventoryMapper {

    public static InventoryDto toDto(Inventory inventory ) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .branchId(inventory.getBranch().getId())
                .productId(inventory.getProduct().getId())
                .quantity(inventory.getQuantity())
                .product(ProductMapper.mapToDto(inventory.getProduct()))
                .build();

    }
    public static Inventory toEntity(InventoryDto inventoryDto,
                                     Branch branch,
                                     Product product) {
        return Inventory.builder()
                .branch(branch)
                .product(product)
                .quantity(inventoryDto.getQuantity())
                .build();
    }
}
