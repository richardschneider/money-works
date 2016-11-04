'use strict';

/* global Intl */

const fallbackIntl = require('intl'),
      memoize = require('memoize-immutable');

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
    if (language) {
        let supported = i18n.NumberFormat.supportedLocalesOf(language)[0] === language;
        if (!supported) {
            i18n = fallbackIntl;
        }
    }
    options = Object.assign({}, defaults[currency], options, { style: 'currency', currency: currency });
    return new i18n.NumberFormat(language, options);
}

module.exports = memoize(currencyFormat);
