package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.request.customer.CreateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.business.request.customer.UpdateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.business.response.customer.CustomerResponse;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CustomerService {

    CustomerProfile createCustomer(
            UUID userId,
            CreateCustomerRequest request
    );

    CustomerProfile getCustomerById(
            UUID customerId
    );

    CustomerProfile getCustomerByUserId(
            UUID userId
    );

    Page<CustomerProfile> getAllCustomers(Pageable pageable);

    CustomerProfile updateCustomer(
            UUID customerId,
            UpdateCustomerRequest request
    );

    void deleteCustomer(
            UUID customerId
    );
}