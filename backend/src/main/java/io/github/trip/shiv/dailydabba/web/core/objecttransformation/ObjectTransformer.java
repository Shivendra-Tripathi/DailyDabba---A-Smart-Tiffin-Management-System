
package io.github.trip.shiv.dailydabba.web.core.objecttransformation;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Central registry and executor for object transformation operations.
 *
 * <p>This component maintains a mapping between an
 * {@link ObjectTransformationKey} and its corresponding
 * {@link ObjectTransformationOperation}. A transformation key identifies
 * both the source type and the target type of a transformation.</p>
 *
 * <p>For example, a transformation can be registered for:</p>
 * <pre>
 * Customer.class -> CustomerResponse.class
 * </pre>
 *
 * <p>The transformer uses the runtime class of the source object together
 * with the requested target type to locate the appropriate transformation
 * operation.</p>
 *
 * <p>The individual {@link ObjectTransformationOperation} is responsible
 * for performing the actual transformation. This class is responsible for
 * locating the operation and ensuring that the returned object is of the
 * requested target type.</p>
 */
@Component
public class ObjectTransformer {

    /**
     * Registry containing all available transformation operations.
     *
     * <p>The key identifies the source and target types, while the associated
     * operation performs the actual transformation.</p>
     */
    private final Map<ObjectTransformationKey, ObjectTransformationOperation> transformations;

    /**
     * Creates an {@code ObjectTransformer} and registers all available
     * transformation definitions.
     *
     * <p>Spring automatically provides all implementations of
     * {@link ObjectTransformationDefinition} through the constructor.</p>
     *
     * @param transformationDefinitions definitions containing the key and
     *                                   operation for each supported transformation
     * @throws NullPointerException if {@code transformationDefinitions} is null
     * @throws IllegalStateException if multiple definitions have the same
     *                              {@link ObjectTransformationKey}
     */
    public ObjectTransformer(List<ObjectTransformationDefinition> transformationDefinitions) {

        Objects.requireNonNull(transformationDefinitions,"Transformation definitions must not be null");

        try {
            transformations =
                    transformationDefinitions
                            .stream()
                            .collect(Collectors.toMap(
                                    ObjectTransformationDefinition::key,
                                    ObjectTransformationDefinition::operation
                            ));
        }catch(IllegalStateException exception){
            throw new MultipleObjectTransformationDefinitionFoundForOneTransformationException(
                    exception.getMessage(), exception);
        }
    }

    /**
     * Transforms the given source object into the requested target type.
     *
     * <p>The transformation operation is selected using the runtime class
     * of {@code obj} and the supplied {@code targetType}. For example, if
     * {@code obj} is a {@code Customer} and {@code targetType} is
     * {@code CustomerResponse.class}, the transformer looks for a
     * transformation registered for:</p>
     *
     * <pre>
     * Customer.class -> CustomerResponse.class
     * </pre>
     *
     * <p>The actual input type validation is the responsibility of the
     * registered transformation operation. The returned value, however,
     * is explicitly verified against {@code targetType} using
     * {@link Class#cast(Object)}.</p>
     *
     * @param obj        source object to transform
     * @param targetType class representing the required target type
     * @param <V>        target type
     * @return transformed object of the requested target type
     *
     * @throws NullPointerException if {@code obj} or {@code targetType} is null
     * @throws NoValidTransformationDefinitionFoundException if no transformation
     *         is registered for the source and target type combination
     * @throws ClassCastException if the registered transformation returns an
     *         object that cannot be assigned to {@code targetType}
     */
    public <V> V transform(Object obj, Class<V> targetType) {

        Objects.requireNonNull(obj, "Source object cannot be null");
        Objects.requireNonNull(targetType, "Target Type cannot be null");

        ObjectTransformationKey key =
                new ObjectTransformationKey(obj.getClass(), targetType);

        ObjectTransformationOperation transformation =
                transformations.get(key);

        if (transformation == null) {
            throw new NoValidTransformationDefinitionFoundException(
                    "No valid Transformation For :" + key
            );
        }

        return targetType.cast(transformation.transform(obj));
    }
}

