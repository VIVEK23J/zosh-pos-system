package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.*;
import com.zosh.zosh.pos.system.enums.PaymentType;
import com.zosh.zosh.pos.system.mapper.ShiftReportMapper;
import com.zosh.zosh.pos.system.payload.dto.ShiftReportDto;
import com.zosh.zosh.pos.system.repository.OrderRepository;
import com.zosh.zosh.pos.system.repository.RefundRepository;
import com.zosh.zosh.pos.system.repository.ShiftReportRepository;
import com.zosh.zosh.pos.system.repository.UserRepository;
import com.zosh.zosh.pos.system.service.ShiftReportService;
import com.zosh.zosh.pos.system.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftReportServiceImp implements ShiftReportService {

    private final ShiftReportRepository shiftReportRepository;
    private final UserService userService;
    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Override
    public ShiftReportDto startShift() throws Exception {
        User currentUser = userService.getCurremtUser();
        LocalDateTime shiftStart = LocalDateTime.now();
        LocalDateTime startOfDay = shiftStart.withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = shiftStart.withHour(23).withMinute(59).withSecond(59).withNano(999999999);

        Optional<ShiftReport> existing =
                shiftReportRepository.findByCashierAndShiftStartBetween(currentUser, startOfDay, endOfDay);
        if (existing.isPresent()) {
            throw new Exception("Shift already started today");
        }

        Branch branch = currentUser.getBranch();

        ShiftReport shiftReport = ShiftReport.builder()
                .cashier(currentUser)
                .shiftStart(shiftStart)
                .branch(branch)
                .build();

        return ShiftReportMapper.toShiftReportDto(shiftReportRepository.save(shiftReport));
    }

    @Override
    public ShiftReportDto endShift(Long shiftReportId, LocalDateTime shiftEnd) throws Exception {
        User currentUser = userService.getCurremtUser();

        LocalDateTime effectiveShiftEnd = (shiftEnd != null) ? shiftEnd : LocalDateTime.now();

        ShiftReport shiftReport = (shiftReportId != null)
                ? shiftReportRepository.findById(shiftReportId)
                        .orElseThrow(() -> new Exception("Shift not found with id " + shiftReportId))
                : shiftReportRepository.findByCashierAndShiftEndIsNullOrderByShiftStartDesc(currentUser)
                        .orElseThrow(() -> new Exception("Active shift not found"));

        shiftReport.setShiftEnd(effectiveShiftEnd);

        List<Refund> refunds = refundRepository.findByCashierIdAndCreatedAtBetween(
                currentUser.getId(), shiftReport.getShiftStart(), effectiveShiftEnd
        );

        double totalRefunds = refunds.stream()
                .mapToDouble(refund -> refund.getAmount() != null ? refund.getAmount() : 0.0)
                .sum();

        List<Order> orders = orderRepository.findByCashierAndCreatedAtBetween(
                currentUser, shiftReport.getShiftStart(), effectiveShiftEnd
        );

        double totalSales = orders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();
        int totalOrders = orders.size();

        double netSales = totalSales - totalRefunds;

        shiftReport.setTotalRefunds(totalRefunds);
        shiftReport.setTotalSales(totalSales);
        shiftReport.setTotalOrders(totalOrders);
        shiftReport.setNetSales(netSales);
        shiftReport.setRecentOrders(getRecentOrders(orders));
        shiftReport.setTopSellingProducts(getTopSellingProducts(orders));
        shiftReport.setPaymentSummary(getPaymentSummaries(orders, totalSales));
        shiftReport.setRefunds(refunds);

        ShiftReport saveReport = shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toShiftReportDto(saveReport);
    }

    @Override
    public ShiftReportDto getShiftReportById(Long shiftReportId) throws Exception {
        return shiftReportRepository.findById(shiftReportId)
                .map(ShiftReportMapper::toShiftReportDto)
                .orElseThrow(
                        () -> new Exception("Shift report not found with given id: " + shiftReportId)
                );
    }

    @Override
    public List<ShiftReportDto> getAllShiftReports() throws Exception {
        List<ShiftReport> shiftReports = shiftReportRepository.findAll();

        return shiftReports.stream()
                .map(ShiftReportMapper::toShiftReportDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDto> getShiftReportByBranchId(Long branchId) throws Exception {
        List<ShiftReport> shiftReports = shiftReportRepository.findByBranchId(branchId);

        return shiftReports.stream()
                .map(ShiftReportMapper::toShiftReportDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShiftReportDto> getShiftReportByCashier(Long cashierId) throws Exception {
        List<ShiftReport> shiftReports = shiftReportRepository.findByCashierId(cashierId);

        return shiftReports.stream()
                .map(ShiftReportMapper::toShiftReportDto)
                .collect(Collectors.toList());
    }

    @Override
    public ShiftReportDto getCurrentShiftProgress(Long cashierId) throws Exception {
        User currentUser = userService.getCurremtUser();

        ShiftReport shiftReport = shiftReportRepository.findByCashierAndShiftEndIsNullOrderByShiftStartDesc(currentUser)
                .orElseThrow(() -> new Exception("Active shift not found"));

        LocalDateTime now = LocalDateTime.now();
        List<Order> orders = orderRepository.findByCashierAndCreatedAtBetween(currentUser, shiftReport.getShiftStart(), now);

        List<Refund> refunds = refundRepository.findByCashierIdAndCreatedAtBetween(
                currentUser.getId(), shiftReport.getShiftStart(), now
        );

        double totalRefunds = refunds.stream()
                .mapToDouble(refund -> refund.getAmount() != null ? refund.getAmount() : 0.0)
                .sum();
        double totalSales = orders.stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();
        int totalOrders = orders.size();

        double netSales = totalSales - totalRefunds;

        shiftReport.setTotalRefunds(totalRefunds);
        shiftReport.setTotalSales(totalSales);
        shiftReport.setTotalOrders(totalOrders);
        shiftReport.setNetSales(netSales);
        shiftReport.setRecentOrders(getRecentOrders(orders));
        shiftReport.setTopSellingProducts(getTopSellingProducts(orders));
        shiftReport.setPaymentSummary(getPaymentSummaries(orders, totalSales));
        shiftReport.setRefunds(refunds);

        ShiftReport saveReport = shiftReportRepository.save(shiftReport);
        return ShiftReportMapper.toShiftReportDto(saveReport);
    }

    @Override
    public ShiftReportDto getShiftByCashierAndDate(Long cashierId, LocalDate date) throws Exception {
        User cashier = userRepository.findById(cashierId)
                .orElseThrow(() -> new Exception("Cashier not found"));
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59, 999999999);
        ShiftReport report = shiftReportRepository.findByCashierAndShiftStartBetween(cashier, start, end)
                .orElseThrow(() -> new Exception("Shift report not found for cashier on date: " + date));

        return ShiftReportMapper.toShiftReportDto(report);
    }

    private List<PaymentSummary> getPaymentSummaries(List<Order> orders, double totalSales) {
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }

        Map<PaymentType, List<Order>> grouped = orders.stream()
                .collect(Collectors.groupingBy(order -> order.getPayment() != null
                        ? order.getPayment() : PaymentType.CASH));
        List<PaymentSummary> paymentSummaries = new ArrayList<>();
        for (Map.Entry<PaymentType, List<Order>> entry : grouped.entrySet()) {
            double amount = entry.getValue().stream()
                    .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                    .sum();
            int transactions = entry.getValue().size();

            double percent = (totalSales > 0) ? (amount / totalSales) * 100 : 0.0;

            PaymentSummary paymentSummary = new PaymentSummary();
            paymentSummary.setPaymentType(entry.getKey());
            paymentSummary.setTotalAmount(amount);
            paymentSummary.setTransactionCount(transactions);
            paymentSummary.setPercentage(percent);
            paymentSummaries.add(paymentSummary);
        }

        return paymentSummaries;
    }

    // Helper Methods
    private List<Product> getTopSellingProducts(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }

        Map<Product, Integer> productSalesMap = new HashMap<>();

        for (Order order : orders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    Product product = item.getProduct();
                    if (product != null) {
                        productSalesMap.put(product,
                                productSalesMap.getOrDefault(product, 0)
                                        + item.getQuantity());
                    }
                }
            }
        }

        return productSalesMap.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    private List<Order> getRecentOrders(List<Order> orders) {
        if (orders == null || orders.isEmpty()) {
            return new ArrayList<>();
        }

        return orders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
}
