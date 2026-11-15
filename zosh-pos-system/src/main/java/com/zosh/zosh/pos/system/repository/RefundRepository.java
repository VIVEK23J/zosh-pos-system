package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.Refund;
import com.zosh.zosh.pos.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RefundRepository extends JpaRepository<Refund,Long> {

    List<Refund> findByCashierIdAndCreatedAtBetween(Long cashier,
                                                  LocalDateTime start,
                                                  LocalDateTime end);

    List<Refund> findByCashierId(Long cashierId);
    List<Refund> findByShiftReportId(Long shiftReportId);
    List<Refund> findByBranchId(Long branchId);

}
