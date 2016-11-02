'use strict';

/* global Intl */

const fallbackIntl = require('intl');
var fallbackLanguage; // 'undefined' lets the enviroment determine the best language

function CurrencyFormat(language, currency) {
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
    // TODO: Cache the number format
    let locale = new i18n.NumberFormat(language, { style: 'currency', currency: currency });
    return locale;
}

module.exports = CurrencyFormat;
