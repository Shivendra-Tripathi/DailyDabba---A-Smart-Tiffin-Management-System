package io.github.trip.shiv.dailydabba.web.core.objecttransformation;

public class MultipleObjectTransformationDefinitionFoundForOneTransformationException extends RuntimeException {
    String message;
    Throwable cause;

    public MultipleObjectTransformationDefinitionFoundForOneTransformationException(String message, Throwable cause) {
        super(message, cause);
        this.message = message;
        this.cause = cause;
    }
}
