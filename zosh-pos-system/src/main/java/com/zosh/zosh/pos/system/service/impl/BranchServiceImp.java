package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Branch;
import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.exception.UserException;
import com.zosh.zosh.pos.system.mapper.BranchMapper;
import com.zosh.zosh.pos.system.payload.dto.BranchDto;
import com.zosh.zosh.pos.system.repository.BranchRepository;
import com.zosh.zosh.pos.system.repository.StoreRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.BranchService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BranchServiceImp implements BranchService {

    private final BranchRepository branchRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public BranchDto createBranch(BranchDto branchDto) throws UserException {

        User currentUser = userService.getCurremtUser();
        Store currentStore = storeRepository.findByStoreAdminId(currentUser.getId());

        if (currentStore == null) {
            throw new UserException("Store not found for current user");
        }
        Branch branch = BranchMapper.toEntity(branchDto,currentStore);
        return BranchMapper.toDto(branchRepository.save(branch));
    }

    @Override
    public BranchDto updateBranch(Long id, BranchDto branchDto) throws Exception {
        Branch currentBranch = branchRepository.findById(id).orElseThrow(
                ()-> new Exception("branch not exist...")
        );
        currentBranch.setName(branchDto.getName());
        currentBranch.setWorkingDays(branchDto.getWorkingDays());
        currentBranch.setEmail(branchDto.getEmail());
        currentBranch.setAddress(branchDto.getAddress());
        currentBranch.setPhone(branchDto.getPhone());
        currentBranch.setOpeningTime(branchDto.getOpeningTime());
        currentBranch.setClosingTime(branchDto.getClosingTime());
        currentBranch.setUpdatedAt(LocalDateTime.now());

        Branch updatedBranch = branchRepository.save(currentBranch);

        return BranchMapper.toDto(updatedBranch);
    }

    @Override
    public void deleteBranch(Long id) throws Exception {
        Branch currentBranch = branchRepository.findById(id).orElseThrow(
                ()-> new Exception("branch not exist...")
        );
        branchRepository.delete(currentBranch);

    }

    @Override
    public List<BranchDto> getAllBranchesByStoreId(Long storeId) {
        List<Branch> branches = branchRepository.findAllByStoreId(storeId);
        return branches.stream().map(BranchMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDto getBranchById(Long id) throws Exception {
        Branch currentBranch = branchRepository.findById(id).orElseThrow(
                ()-> new Exception("branch not exist...")
        );

        return BranchMapper.toDto(currentBranch);
    }
}
