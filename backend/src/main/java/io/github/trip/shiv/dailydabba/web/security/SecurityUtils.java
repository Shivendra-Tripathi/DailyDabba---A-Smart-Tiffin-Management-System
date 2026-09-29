package io.github.trip.shiv.dailydabba.web.security;

import io.github.trip.shiv.dailydabba.web.entity.User;
import io.github.trip.shiv.dailydabba.web.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private final UserService userService;

    public User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        String email = userDetails.getUsername();

        if(email==null || email.isEmpty()){
            throw new UsernameNotFoundException("Email not found");
        }

        return userService.getUserEntityByEmail(email);
    }
}
