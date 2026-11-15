package com.zosh.zosh.pos.system.mapper;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.payload.dto.BranchDto;

public class BranchMapper {
    public static BranchDto toDto(Branch branch) {
        return BranchDto.builder()
                .id(branch.getId())
                .name(branch.getName())
                .phone(branch.getPhone())
                .email(branch.getEmail())
                .address(branch.getAddress())
                .closingTime(branch.getClosingTime())
                .openingTime(branch.getOpeningTime())
                .workingDays(branch.getWorkingDays())
                .storeId(branch.getStore()!=null?branch.getStore().getId():null)
                .createdAt(branch.getCreatedAt())
                .updatedAt(branch.getUpdatedAt())
                .build();

    }
    public static Branch toEntity(BranchDto branchDto,Store  store) {
        return Branch.builder()
                .name(branchDto.getName())
                .phone(branchDto.getPhone())
                .email(branchDto.getEmail())
                .address(branchDto.getAddress())
                .closingTime(branchDto.getClosingTime())
                .openingTime(branchDto.getOpeningTime())
                .workingDays(branchDto.getWorkingDays())
                .store(store)
                .createdAt(branchDto.getCreatedAt())
                .updatedAt(branchDto.getUpdatedAt())
                .build();
    }

}
