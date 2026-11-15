package com.zosh.zosh.pos.system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayQrRequest {
    private Double amount;
    private Integer timerSeconds;
    private String receipt;
    private String customerName;
    private String customerPhone;
}
