'use strict';

/* global Intl */

const fallbackIntl = require('intl'),
      memoize = require('memoize-immutable');

var fallbackLanguage; // 'undefined' lets the enviroment determine the best language

function currencyFormat(language, currency) {
    let i18n = Intl;
    if (!currency) {
        currency = language;
        language = fallbackLanguage;
    }
    if (language) {
        let supported = i18n.NumberFormat.supportedLocalesOf(language)[0] === language;
        if (!supported) {
            i18n = fallbackIntl;
        }
    }

    let locale = new i18n.NumberFormat(language, { style: 'currency', currency: currency });
    return locale;
}

module.exports = memoize(currencyFormat);
