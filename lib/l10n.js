'use strict';

/* global Intl */

var language;

function NumberFormat(currency) {
    // TODO: Cache the number format
    return new Intl.NumberFormat(language, { style: 'currency', currency: currency });
}

module.exports = NumberFormat;
