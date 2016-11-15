'use strict';

/**
 * Convert a numeric string into an javascript numeric string.
 *
 * Supports ISO-31-0 numbers.  Full stop or comma for a decimal point mark and
 * spaces for group separator.
 */
function normalise(s) {
    return s
        .replace(',', '.')
        .replace(/ /g, '');
}

module.exports = normalise;
