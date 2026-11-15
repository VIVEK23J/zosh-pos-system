package com.zosh.zosh.pos.system.service;

import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.request.RazorpayOrderRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayQrRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayVerificationRequest;
import com.zosh.zosh.pos.system.payload.response.PaymentStatusResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayConfigResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayOrderResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayQrResponse;

public interface PaymentService {

    RazorpayConfigResponse getRazorpayConfig();

    RazorpayOrderResponse createRazorpayOrder(RazorpayOrderRequest request) throws Exception;

    OrderDto verifyPayment(RazorpayVerificationRequest request) throws Exception;

    RazorpayQrResponse createDynamicQr(RazorpayQrRequest request) throws Exception;

    PaymentStatusResponse checkQrPaymentStatus(String qrId) throws Exception;

    PaymentStatusResponse simulateQrPayment(String qrId, OrderDto orderDto) throws Exception;
}
