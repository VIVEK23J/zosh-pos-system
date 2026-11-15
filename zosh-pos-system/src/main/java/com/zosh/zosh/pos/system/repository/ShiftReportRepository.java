package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.ShiftReport;
import com.zosh.zosh.pos.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ShiftReportRepository extends JpaRepository<ShiftReport,Long> {

    List<ShiftReport> findByCashierId(Long cashierId);
    List<ShiftReport> findByBranchId(Long branchId);

    Optional<ShiftReport> findByCashierAndShiftEndIsNullOrderByShiftStartDesc(User cashier);

    Optional<ShiftReport> findByCashierAndShiftStartBetween
            (User cashier, LocalDateTime dateStart, LocalDateTime dateEnd);


}
