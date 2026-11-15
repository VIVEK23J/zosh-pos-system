package com.zosh.zosh.pos.system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderRequest {
    private Double amount;
    private String currency;
    private String receipt;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Map<String, String> notes;
}
