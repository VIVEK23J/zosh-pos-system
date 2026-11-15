package com.zosh.zosh.pos.system.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
@Slf4j
public class RazorpayConfig {

    @Value("${razorpay.key.id:rzp_test_51b4l8yZ000000}")
    private String keyId;

    @Value("${razorpay.key.secret:test_secret_placeholder}")
    private String keySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    @Value("${razorpay.company.name:ZOSH POS Retail}")
    private String companyName;

    public boolean isTestMode() {
        return keyId == null || keyId.startsWith("rzp_test");
    }

    public boolean isConfigured() {
        return keyId != null && !keyId.trim().isEmpty() &&
               keySecret != null && !keySecret.trim().isEmpty() &&
               !keyId.equals("rzp_test_51b4l8yZ000000") &&
               !keySecret.equals("test_secret_placeholder");
    }

    public RazorpayClient getClient() throws RazorpayException {
        return new RazorpayClient(keyId, keySecret);
    }
}
