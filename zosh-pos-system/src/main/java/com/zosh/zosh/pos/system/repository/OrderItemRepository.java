package com.zosh.zosh.pos.system.repository;

import com.zosh.zosh.pos.system.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {

}
