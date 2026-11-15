package com.zosh.zosh.pos.system.controller;

import com.zosh.zosh.pos.system.entity.Customer;
import com.zosh.zosh.pos.system.payload.response.ApiResponse;
import com.zosh.zosh.pos.system.repository.CustomerRepository;
import com.zosh.zosh.pos.system.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Customer> addCustomer
            (@RequestBody Customer customer) throws Exception {
        return ResponseEntity.ok(customerService.createCustomer(customer));

    }
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id,
                   @RequestBody Customer customer) throws Exception {
        return ResponseEntity.ok(customerService.updateCustomer(id, customer));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<ApiResponse> deleteCustomer(@PathVariable Long id) throws Exception {

        customerService.deleteCustomer(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Customer deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers()
            throws Exception {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }
    @GetMapping("/search")
    public ResponseEntity<List<Customer>> getCustomerById(@RequestParam String q) throws Exception {
        return ResponseEntity.ok(customerService.searchCustomers(q));
    }


}
