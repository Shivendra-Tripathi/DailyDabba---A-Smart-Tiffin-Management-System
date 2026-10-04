package io.github.trip.shiv.dailydabba.web.business.exception;

public class MealItemNotFoundException extends RuntimeException {
    public MealItemNotFoundException(String message) {
        super(message);
    }
}
