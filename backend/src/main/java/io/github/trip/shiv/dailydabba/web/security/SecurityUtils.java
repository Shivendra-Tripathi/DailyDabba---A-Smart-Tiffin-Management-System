package io.github.trip.shiv.dailydabba.web.security;

import io.github.trip.shiv.dailydabba.web.entity.CustomerProfile;
import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.entity.VendorProfile;
import io.github.trip.shiv.dailydabba.web.entity.enums.Role;
import io.github.trip.shiv.dailydabba.web.service.CustomerService;
import io.github.trip.shiv.dailydabba.web.service.UserService;
import io.github.trip.shiv.dailydabba.web.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserService userService;
    private final VendorService vendorService;
    private final CustomerService customerService;

    public User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String email = userDetails.getUsername();

        if(email==null || email.isEmpty()){
            throw new UsernameNotFoundException("Email not found");
        }

        return userService.getUserByEmail(email);
    }


    @PreAuthorize("hasRole('VENDOR')")
    public VendorProfile getAuthenticatedVendor() {
        User user = getAuthenticatedUser();
        //Load the Vendor from Database

        if(user.getRole() != Role.VENDOR){
            throw new RuntimeException("User is not a Vendor");
        }
        return vendorService.getVendorByUserId(user.getId());
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    public CustomerProfile getAuthenticatedCustomer() {
        User user = getAuthenticatedUser();
        if(user.getRole() != Role.CUSTOMER){
            throw new RuntimeException("User is not a Customer");
        }
        return customerService.getCustomerByUserId(user.getId());
    }

}
