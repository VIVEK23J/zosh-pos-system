package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long id);

    List<Order> findByBranchId(Long id);

    List<Order> findByCashierId(Long id);

    List<Order> findByBranchIdAndCreatedAtBetween
            (Long branchId, LocalDateTime startDate, LocalDateTime endDate);

    List<Order>findByCashierAndCreatedAtBetween
            (User cashier, LocalDateTime startDate, LocalDateTime endDate);
    List<Order>findTop5ByBranchIdOrderByCreatedAtDesc(Long branchId);
}
