package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Inventory;
import com.zosh.zosh.pos.system.entity.Product;
import com.zosh.zosh.pos.system.mapper.InventoryMapper;
import com.zosh.zosh.pos.system.payload.dto.InventoryDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.InventoryRepository;
import com.zosh.zosh.pos.system.repository.ProductRepository;
import com.zosh.zosh.pos.system.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImp implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;

    @Override
    public InventoryDto createInventory(InventoryDto inventoryDto) throws Exception {
        Branch branch = branchRepository.findById(inventoryDto.getBranchId()).orElseThrow(
                ()-> new Exception("branch not found..")
        );
        Product product = productRepository.findById(inventoryDto.getProductId()).orElseThrow(
                ()-> new Exception("product not found...")
        );
        Inventory inventory = InventoryMapper.toEntity(inventoryDto, branch, product);
        return InventoryMapper.toDto(inventoryRepository.save(inventory));
    }

    @Override
    public InventoryDto updateInventory(Long id,InventoryDto inventoryDto) throws Exception {
        Inventory inventory = inventoryRepository.findById(id).orElseThrow(
                ()-> new Exception("Inventory not found..")
        );
        inventory.setQuantity(inventoryDto.getQuantity());
        return InventoryMapper.toDto(inventoryRepository.save(inventory));
    }

    @Override
    public void deleteInventory(Long id) throws Exception {
        Inventory inventory = inventoryRepository.findById(id).orElseThrow(
                ()-> new Exception("Inventory not found..")
        );
        inventoryRepository.delete(inventory);

    }

    @Override
    public InventoryDto getInventoryById(Long id) throws Exception {
        Inventory inventory = inventoryRepository.findById(id).orElseThrow(
                ()-> new Exception("Inventory not found")
        );
        return InventoryMapper.toDto(inventory);
    }

    @Override
    public InventoryDto getInventoryByProductIdAndBranchId(
            Long productId, Long branchId) {
        Inventory inventory =
                inventoryRepository.findByProductIdAndBranchId(productId, branchId);
        if (inventory == null) {
            throw new RuntimeException("Inventory not found");
        }
        return InventoryMapper.toDto(inventory);
    }

    @Override
    public List<InventoryDto> getInventoryByBranchId(Long branchId) {
        List<Inventory> inventories = inventoryRepository.findByBranchId(branchId);

        return inventories.stream().map(InventoryMapper::toDto).collect(Collectors.toList());
    }
}
