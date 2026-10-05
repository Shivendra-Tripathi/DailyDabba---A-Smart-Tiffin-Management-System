package io.github.trip.shiv.dailydabba.web.business.exception;

public class CustomerProfileNotFoundException extends RuntimeException {
    public CustomerProfileNotFoundException(String message) {
        super(message);
    }
}
