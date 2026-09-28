package io.github.trip.shiv.dailydabba.web.core.objecttransformation;

@FunctionalInterface
public interface ObjectTransformationOperation {
    Object transform(Object obj);
}
