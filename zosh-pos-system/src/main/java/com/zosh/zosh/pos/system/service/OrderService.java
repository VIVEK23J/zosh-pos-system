package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.enums.OrderStatus;
import com.zosh.zosh.pos.system.enums.PaymentType;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;

import java.util.List;

public interface OrderService {
    OrderDto createOrder(OrderDto orderDto) throws Exception;
    OrderDto getOrderById(Long orderId) throws Exception;
    List<OrderDto> getOrdersByBranch(Long branchId,
                                     Long customerId,
                                     Long cashierId,
                                     PaymentType paymentType,
                                     OrderStatus status) throws Exception;

    List<OrderDto> getAllOrders() throws Exception;
    List<OrderDto> getOrdersByCashier(Long cashierId);
    void deleteOrder(Long orderId) throws Exception;
    List<OrderDto> getTodayOrdersByBranch(Long branchId);
    List<OrderDto> getOrdersByCustomerId(Long customerId) throws Exception;
    List<OrderDto> getTop5RecentOrdersByBranchId(Long branchId) throws Exception;
}
