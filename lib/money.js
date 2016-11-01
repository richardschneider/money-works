'use strict';

const Big = require('big.js');

let iso4217 = /^[A-Z]{3}$/;

function Money(amount, currency) {
    // Do not allow strings because they are usually locale dependent.
    if (typeof amount === 'number') {
        amount = new Big(amount);
    } else if (amount instanceof Big) {
        // ok
    } else {
        throw new Error('The amount must be a Number or a Big');
    }

    if (!iso4217.test(currency)) {
        throw new Error(`'${currency}' is not a valid ISO-4217 currency code`);
    }

    this.amount = amount;
    this.currency = currency;
}

module.exports = Money;
