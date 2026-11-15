package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.request.RazorpayOrderRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayQrRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayVerificationRequest;
import com.zosh.zosh.pos.system.payload.response.PaymentStatusResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayConfigResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayOrderResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayQrResponse;
import com.zosh.zosh.pos.system.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments/razorpay")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/config")
    public ResponseEntity<RazorpayConfigResponse> getRazorpayConfig() {
        return ResponseEntity.ok(paymentService.getRazorpayConfig());
    }

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponse> createOrder(@RequestBody RazorpayOrderRequest request)
            throws Exception {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(request));
    }

    @PostMapping("/verify")
    public ResponseEntity<OrderDto> verifyPayment(@RequestBody RazorpayVerificationRequest request)
            throws Exception {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    @PostMapping("/create-qr")
    public ResponseEntity<RazorpayQrResponse> createDynamicQr(@RequestBody RazorpayQrRequest request)
            throws Exception {
        return ResponseEntity.ok(paymentService.createDynamicQr(request));
    }

    @GetMapping("/qr-status/{qrId}")
    public ResponseEntity<PaymentStatusResponse> getQrStatus(@PathVariable String qrId)
            throws Exception {
        return ResponseEntity.ok(paymentService.checkQrPaymentStatus(qrId));
    }

    @PostMapping("/simulate-qr/{qrId}")
    public ResponseEntity<PaymentStatusResponse> simulateQrPayment(
            @PathVariable String qrId,
            @RequestBody(required = false) OrderDto orderDto) throws Exception {
        return ResponseEntity.ok(paymentService.simulateQrPayment(qrId, orderDto));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleRazorpayWebhook(@RequestBody String payload,
                                                        @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        log.info("Received Razorpay Webhook notification: {}", payload);
        // Acknowledge webhook receipt to Razorpay
        return ResponseEntity.ok("OK");
    }
}
