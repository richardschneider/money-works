'use strict';

/* global Intl */

const memoize = require('memoize-immutable');

/* The fallback Intl is not shipped to a browser. */
var fallbackIntl = require('intl');
if (!('NumberFormat' in fallbackIntl)) {
    fallbackIntl = null;
}

var fallbackLanguage; // 'undefined' lets the enviroment determine the best language
var defaults = {
    'BTC': { maximumFractionDigits: 8 },
    'XBT': { maximumFractionDigits: 8 },
    'ETH': { maximumFractionDigits: 2 },
    'XMR': { maximumFractionDigits: 8 },
    'XRP': { maximumFractionDigits: 8 }
};

function currencyFormat(language, currency, options) {
    let i18n = Intl;
    if (arguments.length === 1) {
        currency = language;
        language = fallbackLanguage;
    }
    if (language && fallbackIntl) {
        let supported = i18n.NumberFormat.supportedLocalesOf(language)[0] === language;
        if (!supported) {
            i18n = fallbackIntl;
        }
    }
    options = Object.assign({}, defaults[currency], options, { style: 'currency', currency: currency });
    return new i18n.NumberFormat(language, options);
}

module.exports = memoize(currencyFormat);
