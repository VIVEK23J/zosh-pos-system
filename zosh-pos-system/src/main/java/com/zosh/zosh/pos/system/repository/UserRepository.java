package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.Store;
import com.zosh.zosh.pos.system.entity.User;
import com.zosh.zosh.pos.system.enums.UserRoles;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {


    User findByEmail(String username);

    List<User> findByStore(Store store);

    List<User> findByBranchId(Long branchId);
}
