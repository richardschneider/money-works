'use strict';

/* global Intl */

const fallbackIntl = require('intl');
var fallbackLanguage; // 'undefined' lets the enviroment determine the best language

let cache = {};

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

function cachedCurrencyFormat(language, currency) {
    if (!currency) {
        currency = language;
        language = fallbackLanguage;
    }

    let id = (language || 'undefined') + '/' + currency,
        locale = cache[id];

    if (locale === undefined) {
        locale = currencyFormat(language, currency);
        cache[id] = locale;
    }

    return locale;
}

module.exports = cachedCurrencyFormat;
