'use strict';

const Big = require('big.js');
const l10n = require('./l10n');

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

Money.prototype.precision = function precision() {
    let options = l10n(this.currency).resolvedOptions();
    return options.maximumFractionDigits;
};

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

Money.prototype.round = function round() {
    return new Money(this.amount.round(this.precision()), this.currency);
};

Money.prototype.toString = function toString() {
    return this.amount.toString() + ' ' + this.currency;
};

Money.prototype.compare = function compare(that) {
    if (this.currency !== that.currency) {
        throw new Error('Currencies must be the same');
    }

    return this.amount.cmp(that.amount);
};

Money.prototype.eq = function eq(that) {
    return this.compare(that) === 0;
};

Money.prototype.ne = function ne(that) {
    return this.compare(that) !== 0;
};

Money.prototype.lt = function lt(that) {
    return this.compare(that) < 0;
};

Money.prototype.lte = function lte(that) {
    return this.compare(that) <= 0;
};

Money.prototype.gt = function gt(that) {
    return this.compare(that) > 0;
};

Money.prototype.gte = function gte(that) {
    return this.compare(that) >= 0;
};

module.exports = Money;
