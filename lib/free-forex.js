/*
 * Get the exchange rate from https://free.currencyconverterapi.com/
 */

'use strict';

const getJSON = require('./secure-json');

function getExchangeRate(from, to) {
    let key = from + '_' + to;
    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${key}&compact=ultra`;
    return getJSON(url)
        .then(body => body[key]);
}

module.exports = getExchangeRate;
