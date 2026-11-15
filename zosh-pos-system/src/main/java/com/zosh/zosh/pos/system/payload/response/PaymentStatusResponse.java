package com.zosh.zosh.pos.system.payload.response;

import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentStatusResponse {
    private String status;
    private String paymentId;
    private OrderDto order;
    private String message;
}
