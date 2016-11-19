/*
 * Get the exchange rate from the European Central Bank via http://fixer.io
 */

'use strict';

const getJSON = require('./secure-json');

function getExchangeRate(from, to) {
    let url = `https://api.fixer.io/latest?base=${from}`;
    return getJSON(url)
        .then(body => body.rates[to]);
}


module.exports = getExchangeRate;

