package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.payload.dto.ShiftReportDto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ShiftReportService {
    ShiftReportDto startShift() throws Exception;
    ShiftReportDto endShift(Long shiftReportId, LocalDateTime shiftEnd) throws Exception;
    ShiftReportDto getShiftReportById(Long shiftReportId) throws Exception;
    List<ShiftReportDto> getAllShiftReports() throws Exception;
    List<ShiftReportDto> getShiftReportByBranchId(Long branchId) throws Exception;
    List<ShiftReportDto> getShiftReportByCashier(Long cashierId) throws Exception;
    ShiftReportDto getCurrentShiftProgress(Long cashierId) throws Exception;
    ShiftReportDto getShiftByCashierAndDate(Long cashierId, LocalDate date) throws Exception;
}
