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

Money.prototype.plus = function plus(that) {
    if (this.currency !== that.currency) {
        throw new Error('Currencies must be the same');
    }

    return new Money(this.amount.plus(that.amount), this.currency);
};

Money.prototype.minus = function plus(that) {
    if (this.currency !== that.currency) {
        throw new Error('Currencies must be the same');
    }

    return new Money(this.amount.minus(that.amount), this.currency);
};

Money.prototype.times = function times(that) {
    if (typeof that !== 'number') {
        throw new TypeError('Money multiplication needs a Number');
    }
    return new Money(this.amount.times(that), this.currency);
};

Money.prototype.toString = function toString() {
    return this.amount.toString() + ' ' + this.currency;
};

module.exports = Money;
