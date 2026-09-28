package io.github.trip.shiv.dailydabba.web.entity.enums;

/**
 * Drives feature #7 for Saturday/Sunday (or any non-auto-order day):
 * skip entirely, ask the user for a yes/no first, or just order automatically
 * exactly like a weekday.
 */
public enum WeekendAction {
    NO_ORDER,
    ASK_CONSENT,
    AUTO_ORDER
}
