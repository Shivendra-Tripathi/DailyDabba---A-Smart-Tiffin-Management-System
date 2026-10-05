package io.github.trip.shiv.dailydabba.web.business.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiErrorResponse> handleException(Exception ex) {
//
//        ApiErrorResponse response = new ApiErrorResponse(
//                HttpStatus.INTERNAL_SERVER_ERROR.value(),
//                "Internal server error",
//                ex.getMessage()
//        );
//
//        return ResponseEntity
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(response);
//    }


    @ExceptionHandler(VendorProfileNotFoundException.class)
    public ResponseEntity<Void> vendorProfileNotFoundException(VendorProfileNotFoundException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(CustomerProfileNotFoundException.class)
    public ResponseEntity<Void> customerProfileNotFoundException(CustomerProfileNotFoundException e) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}