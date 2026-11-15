package com.zosh.zosh.pos.system.service.impl;

import com.zosh.zosh.pos.system.entity.Customer;
import com.zosh.zosh.pos.system.repository.CustomerRepository;
import com.zosh.zosh.pos.system.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CustomerServiceImp implements CustomerService {
    private final CustomerRepository customerRepository;

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) throws Exception {
        Customer customerToUpdate = customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found"));
        customerToUpdate.setFullName(customer.getFullName());
        customerToUpdate.setEmail(customer.getEmail());
        customerToUpdate.setPhone(customer.getPhone());
        return customerRepository.save(customerToUpdate);
    }

    @Override
    public void deleteCustomer(Long id) throws Exception {
        Customer customerToUpdate = customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found"));
        customerRepository.deleteById(id);
    }

    @Override
    public Customer getCustomer(Long id) throws Exception {

        return customerRepository.findById(id).orElseThrow(
                () -> new Exception("Customer not found"));
    }

    @Override
    public List<Customer> getAllCustomers() throws Exception {
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> searchCustomers(String keyword) throws Exception {
        return customerRepository.
                findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase
                        (keyword, keyword);
    }
}
