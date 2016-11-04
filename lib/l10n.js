'use strict';

/* global Intl */

const fallbackIntl = require('intl'),
      memoize = require('memoize-immutable');

var fallbackLanguage; // 'undefined' lets the enviroment determine the best language

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
    options = Object.assign({}, options, { style: 'currency', currency: currency });
    return new i18n.NumberFormat(language, options);
}

module.exports = memoize(currencyFormat);
