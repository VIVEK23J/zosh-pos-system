package com.zosh.zosh.pos.system.entity;

import com.zosh.zosh.pos.system.enums.PaymentType;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Data
public class PaymentSummary {

    private PaymentType paymentType;
    private Double totalAmount;
    private int transactionCount;
    private double percentage;




    //TODO [Reverse Engineering] generate columns from DB
}