'use strict';

const Big = require('big.js');
const l10n = require('./l10n');

let iso4217 = /^[A-Z]{3}$/,
    roundingMode = 2, // ROUND_HALF_EVEN, banker's rounding
    zero = new Big(0);

function Money(amount, currency) {
    // Allow new Money(json)
    if (arguments.length === 1) {
        let o = amount;
        amount = o.amount;
        currency = o.currency;
    }

    // Validation
    amount = new Big(amount);
    if (!iso4217.test(currency)) {
        throw new Error(`'${currency}' is not a valid ISO-4217 currency code`);
    }

    this.amount = Object.freeze(amount);
    this.currency = currency;

    Object.freeze(this);
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

Money.prototype.allocate = function allocate(ratios) {
    if (!Array.isArray(ratios)) {
        throw new TypeError('Money allocation needs an Array');
    }
    if (ratios.length < 1) {
        throw new TypeError('Money allocation needs a non-empty Array');
    }

    let total = ratios.reduce((a,b) => a + b, 0),
        amount = this.round(),
        remainder = amount,
        shares = ratios.map(ratio => {
            let share = amount.times(ratio / total).round();
            remainder = remainder.minus(share);
            return share;
        })
    ;

    if (remainder.isNotZero()) {
        shares[0] = shares[0].plus(remainder).round();
    }

    return shares;
};

Money.prototype.round = function round() {
    return new Money(this.amount.round(this.precision(), roundingMode), this.currency);
};

Money.prototype.toString = function toString() {
    return this.amount.toString() + ' ' + this.currency;
};

Money.prototype.toLocaleString = function toLocaleString(lang) {
    return l10n(lang, this.currency).format(Number(this.round().amount));
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

Money.prototype.isZero = function isZero() {
    return this.amount.cmp(zero) === 0;
};

Money.prototype.isNotZero = function isNotZero() {
    return this.amount.cmp(zero) !== 0;
};

Money.prototype.isPositive = function isPositive() {
    return this.amount.cmp(zero) > 0;
};

Money.prototype.isNegative = function isNegative() {
    return this.amount.cmp(zero) < 0;
};

module.exports = Money;
