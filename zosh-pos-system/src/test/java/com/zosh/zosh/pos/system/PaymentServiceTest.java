package com.zosh.zosh.pos.system;

import com.zosh.zosh.pos.system.config.RazorpayConfig;
import com.zosh.zosh.pos.system.entity.Order;
import com.zosh.zosh.pos.system.enums.PaymentType;
import com.zosh.zosh.pos.system.payload.dto.OrderDto;
import com.zosh.zosh.pos.system.payload.request.RazorpayOrderRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayQrRequest;
import com.zosh.zosh.pos.system.payload.request.RazorpayVerificationRequest;
import com.zosh.zosh.pos.system.payload.response.PaymentStatusResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayConfigResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayOrderResponse;
import com.zosh.zosh.pos.system.payload.response.RazorpayQrResponse;
import com.zosh.zosh.pos.system.service.OrderService;
import com.zosh.zosh.pos.system.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class PaymentServiceTest {

    private RazorpayConfig razorpayConfig;
    private OrderService orderService;
    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        razorpayConfig = new RazorpayConfig();
        razorpayConfig.setKeyId("rzp_test_51b4l8yZ000000");
        razorpayConfig.setKeySecret("test_secret_placeholder");
        razorpayConfig.setCurrency("INR");
        razorpayConfig.setCompanyName("ZOSH POS Retail");

        orderService = Mockito.mock(OrderService.class);
        paymentService = new PaymentServiceImpl(razorpayConfig, orderService);
    }

    @Test
    void testGetRazorpayConfig_ReturnsTestModeConfig() {
        RazorpayConfigResponse config = paymentService.getRazorpayConfig();
        assertNotNull(config);
        assertEquals("rzp_test_51b4l8yZ000000", config.getKeyId());
        assertEquals("INR", config.getCurrency());
        assertTrue(config.isTestMode());
        assertFalse(config.isConfigured());
    }

    @Test
    void testCreateRazorpayOrder_ValidAmount_ReturnsOrderResponse() throws Exception {
        RazorpayOrderRequest req = RazorpayOrderRequest.builder()
                .amount(250.50)
                .receipt("rcpt_pos_101")
                .customerName("John Doe")
                .customerPhone("9876543210")
                .build();

        RazorpayOrderResponse response = paymentService.createRazorpayOrder(req);

        assertNotNull(response);
        assertNotNull(response.getRazorpayOrderId());
        assertEquals(25050L, response.getAmountInPaise());
        assertEquals(250.50, response.getAmount());
        assertEquals("INR", response.getCurrency());
        assertEquals("rcpt_pos_101", response.getReceipt());
        assertTrue(response.isTestMode());
    }

    @Test
    void testCreateRazorpayOrder_ZeroAmount_ThrowsException() {
        RazorpayOrderRequest req = RazorpayOrderRequest.builder()
                .amount(0.0)
                .build();

        assertThrows(IllegalArgumentException.class, () -> paymentService.createRazorpayOrder(req));
    }

    @Test
    void testCreateDynamicQr_ReturnsValidUpiAndTimer() throws Exception {
        RazorpayQrRequest req = RazorpayQrRequest.builder()
                .amount(499.00)
                .timerSeconds(300)
                .receipt("rcpt_pos_qr_202")
                .build();

        RazorpayQrResponse response = paymentService.createDynamicQr(req);

        assertNotNull(response);
        assertNotNull(response.getQrId());
        assertNotNull(response.getQrString());
        assertTrue(response.getQrString().startsWith("upi://pay?"));
        assertTrue(response.getQrString().contains("am=499.00"));
        assertEquals(300, response.getTimerSeconds());
        assertTrue(response.getCloseBy() > (System.currentTimeMillis() / 1000));
        assertEquals("PENDING", response.getStatus());
    }

    @Test
    void testCheckQrPaymentStatus_PendingAndSimulatePayment() throws Exception {
        RazorpayQrRequest req = RazorpayQrRequest.builder()
                .amount(120.00)
                .timerSeconds(180)
                .build();

        RazorpayQrResponse qr = paymentService.createDynamicQr(req);

        // Initial check should be PENDING
        PaymentStatusResponse statusBefore = paymentService.checkQrPaymentStatus(qr.getQrId());
        assertEquals("PENDING", statusBefore.getStatus());

        // Simulate customer completing UPI payment on phone
        OrderDto orderDto = OrderDto.builder().id(999L).totalAmount(120.00).build();
        when(orderService.createOrder(any())).thenReturn(orderDto);

        PaymentStatusResponse simResult = paymentService.simulateQrPayment(qr.getQrId(), orderDto);
        assertEquals("PAID", simResult.getStatus());
        assertNotNull(simResult.getPaymentId());

        // Polling check now returns PAID
        PaymentStatusResponse statusAfter = paymentService.checkQrPaymentStatus(qr.getQrId());
        assertEquals("PAID", statusAfter.getStatus());
    }

    @Test
    void testVerifyPayment_TestMode_CreatesPosOrder() throws Exception {
        OrderDto mockSavedOrder = OrderDto.builder()
                .id(777L)
                .totalAmount(350.0)
                .payment(PaymentType.RAZORPAY)
                .paymentTransactionId("pay_test_abc123")
                .paymentOrderId("order_test_xyz789")
                .paymentStatus("COMPLETED")
                .build();

        when(orderService.createOrder(any())).thenReturn(mockSavedOrder);

        RazorpayVerificationRequest req = RazorpayVerificationRequest.builder()
                .razorpayOrderId("order_test_xyz789")
                .razorpayPaymentId("pay_test_abc123")
                .razorpaySignature("simulated_test_signature")
                .orderDto(OrderDto.builder().totalAmount(350.0).build())
                .build();

        OrderDto result = paymentService.verifyPayment(req);

        assertNotNull(result);
        assertEquals(777L, result.getId());
        assertEquals(PaymentType.RAZORPAY, result.getPayment());
        assertEquals("pay_test_abc123", result.getPaymentTransactionId());
    }
}
