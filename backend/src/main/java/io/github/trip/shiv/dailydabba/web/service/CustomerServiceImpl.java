package io.github.trip.shiv.dailydabba.web.service;

import io.github.trip.shiv.dailydabba.web.business.exception.CustomerProfileNotFoundException;
import io.github.trip.shiv.dailydabba.web.business.request.customer.CreateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.business.request.customer.UpdateCustomerRequest;
import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.repository.CustomerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerProfileRepository customerProfileRepository;
    private final UserService userService;

    @Override
    @Transactional
    @PreAuthorize("hasRole('CUSTOMER')")
    public CustomerProfile createCustomer(UUID userId, CreateCustomerRequest request) {

        User user = userService.getUserById(userId);

        CustomerProfile customerProfile = request.toEntity();
        customerProfile.setUser(user);

        return customerProfileRepository.save(customerProfile);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfile getCustomerById(UUID customerId) {
        return customerProfileRepository.findById(customerId).orElseThrow(
                () -> new CustomerProfileNotFoundException("Customer with id :"+customerId+" not found.")
        );
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerProfile getCustomerByUserId(UUID userId) {
        return customerProfileRepository.findByUserId(userId).orElseThrow(
                () -> new CustomerProfileNotFoundException("Customer with user id :"+userId+" not found.")
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerProfile> getAllCustomers( Pageable pageable) {
        return customerProfileRepository.findAll(pageable);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('CUSTOMER')")
    public CustomerProfile updateCustomer(UUID customerId, UpdateCustomerRequest request) {
        CustomerProfile customerProfile = getCustomerById(customerId);
        request.applyOn(customerProfile);
        return customerProfileRepository.save(customerProfile);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('CUSTOMER')")
    public void deleteCustomer(UUID customerId) {
        customerProfileRepository.deleteById(customerId);
    }
}
