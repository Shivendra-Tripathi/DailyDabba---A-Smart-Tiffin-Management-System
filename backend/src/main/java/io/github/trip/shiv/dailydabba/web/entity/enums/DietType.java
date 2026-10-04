package io.github.trip.shiv.dailydabba.web.entity.enums;

import io.github.trip.shiv.dailydabba.web.entity.MealItem;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public enum DietType {
    VEG,
    NON_VEG,
    EGGETARIAN,
    VEGAN,
    JAIN;

    public static DietType getUpperBoundType(Set<MealItem> mealItemSet){

        Objects.requireNonNull(mealItemSet,"The Diet List must not be null");

        Set<DietType> set =
                mealItemSet
                .stream()
                .map(mealItem -> mealItem.getDietType())
                .collect(Collectors.toSet());

        if(set.contains(NON_VEG))
            return NON_VEG;
        if(set.contains(EGGETARIAN))
            return EGGETARIAN;
        if(set.contains(VEG))
            return VEG;
        if(set.contains(VEGAN))
            return VEGAN;
        return JAIN;
    }
}
