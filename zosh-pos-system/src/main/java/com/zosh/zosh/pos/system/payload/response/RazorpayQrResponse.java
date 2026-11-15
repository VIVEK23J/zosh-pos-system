package com.zosh.zosh.pos.system.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayQrResponse {
    private String qrId;
    private String imageUrl;
    private String qrString;
    private Double amount;
    private Long closeBy;
    private Integer timerSeconds;
    private String status;
    private boolean testMode;
}
