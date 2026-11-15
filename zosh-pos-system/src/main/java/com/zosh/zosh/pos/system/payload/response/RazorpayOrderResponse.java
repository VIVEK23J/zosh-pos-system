package com.zosh.zosh.pos.system.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private Long amountInPaise;
    private Double amount;
    private String currency;
    private String keyId;
    private String receipt;
    private String companyName;
    private boolean testMode;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
