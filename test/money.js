'use strict';

const Money = require('..');
const Big = require('big.js');
const should = require('should');

describe('Money', () => {

    it('should have a Big amount', () => {
        let money = new Money(10, 'JPY');
        money.should.have.property('amount');
        money.amount.should.be.instanceof(Big);
        money.amount.should.eql(new Big(10));
    });

    it('should have an ISO-4217 currency code', () => {
        let money = new Money(10, 'JPY');
        money.should.have.property('currency', 'JPY');
    });

    it('should be immutable', () => {
        let money = new Money(10, 'JPY');

        should.throws(() => money.amount = 0);
        should.throws(() => money.currency = 'NZD');
    });

    it('should print exact amount and currency code', () => {
        let money = new Money(10.7, 'JPY');
        money.toString().should.equal('10.7 JPY');
    });

    describe('constructor', () => {

        it('should allow an integer amount', () => {
            new Money(10, 'NZD').should.have.property('amount', new Big(10));
        });

        it('should allow a floating point amount', () => {
            new Money(10.123456789, 'NZD').should.have.property('amount', new Big(10.123456789));
        });

        it('should allow a Big amount', () => {
            new Money(new Big(10.123456789), 'NZD').should.have.property('amount', new Big(10.123456789));
        });

        it('should allow ISO-4217 currency code', () => {
            let ok = new Money(0, 'NZD');
            ok.should.be.an.instanceof(Money);

            should.throws(() => new Money(0, 'nzd'));
            should.throws(() => new Money(0, 'NZDX'));
        });

    });

    describe('Math', () => {

        it('should add when currencies are the same', () => {
            let a = new Money(0.30, 'NZD'),
                b = new Money(-0.20, 'NZD'),
                c = new Money(-0.20, 'USD');

            a.plus(b).amount.should.eql(new Big(0.1));
            a.plus(b).currency.should.equal('NZD');

            should.throws(() => a.plus(c));
        });

        it('should subtract when currencies are the same', () => {
            let a = new Money(0.30, 'NZD'),
                b = new Money(0.20, 'NZD'),
                c = new Money(0.20, 'USD');

            a.minus(b).amount.should.eql(new Big(0.1));
            a.minus(b).currency.should.equal('NZD');

            should.throws(() => a.minus(c));
        });

        it('should multiply with a Number', () => {
            let a = new Money(0.30, 'NZD');

            a.times(10).amount.should.eql(new Big(3.0));
            a.times(10).currency.should.equal('NZD');
            a.times(10.0).amount.should.eql(new Big(3.0));
            a.times(10.0).currency.should.equal('NZD');
            a.times(10.1).amount.should.eql(new Big(3.03));
            a.times(10.1).currency.should.equal('NZD');

            should.throws(() => a.times('10.1'));
            should.throws(() => a.times(new Money(10, 'NZD')));
        });

        it('should round to the precision of the currency', () => {
            let a = new Money(123.577, 'NZD');
            let b = new Money(123.577, 'JPY');

            a.round().toString().should.equal('123.58 NZD');
            b.round().toString().should.equal('124 JPY');
        });

        it('should round to the specified number of decimal places', () => {
            let a = new Money(123.57719, 'NZD');

            a.round().toString().should.equal('123.58 NZD');
            a.round(4).toString().should.equal('123.5772 NZD');
        });

        it('should use bankers rounding', () => {
            new Money(3.0, 'JPY').round().toString().should.equal('3 JPY');
            new Money(3.1, 'JPY').round().toString().should.equal('3 JPY');
            new Money(3.2, 'JPY').round().toString().should.equal('3 JPY');
            new Money(3.3, 'JPY').round().toString().should.equal('3 JPY');
            new Money(3.4, 'JPY').round().toString().should.equal('3 JPY');
            new Money(3.5, 'JPY').round().toString().should.equal('4 JPY');
            new Money(3.6, 'JPY').round().toString().should.equal('4 JPY');
            new Money(3.7, 'JPY').round().toString().should.equal('4 JPY');
            new Money(3.8, 'JPY').round().toString().should.equal('4 JPY');
            new Money(3.9, 'JPY').round().toString().should.equal('4 JPY');

            new Money(4.0, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.1, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.2, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.3, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.4, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.5, 'JPY').round().toString().should.equal('4 JPY');
            new Money(4.6, 'JPY').round().toString().should.equal('5 JPY');
            new Money(4.7, 'JPY').round().toString().should.equal('5 JPY');
            new Money(4.8, 'JPY').round().toString().should.equal('5 JPY');
            new Money(4.9, 'JPY').round().toString().should.equal('5 JPY');
        });

        it('should allocate to a ratio', () => {
            let funds = new Money(10, 'JPY');
            let shares = funds.allocate([1, 1, 1]);
            shares.should.have.length(3);
            shares[0].toString().should.equal('4 JPY');
            shares[1].toString().should.equal('3 JPY');
            shares[2].toString().should.equal('3 JPY');

            shares = new Money(0.10, 'USD').allocate([70, 30]);
            shares.should.have.length(2);
            shares[0].toString().should.equal('0.07 USD');
            shares[1].toString().should.equal('0.03 USD');

            shares = new Money(0.01, 'USD').allocate([70, 20, 10]);
            shares.should.have.length(3);
            shares[0].toString().should.equal('0.01 USD');
            shares[1].toString().should.equal('0 USD');
            shares[2].toString().should.equal('0 USD');

            shares = new Money(100, 'USD').allocate([1, 1, 1]);
            shares.should.have.length(3);
            shares[0].toString().should.equal('33.34 USD');
            shares[1].toString().should.equal('33.33 USD');
            shares[2].toString().should.equal('33.33 USD');

            should.throws(() => funds.allocate());
            should.throws(() => funds.allocate([]));
        });

    });

    describe('Logic', () => {
        it('should compare when currency codes are the same', () => {
            let a = new Money(30, 'NZD');
            let b = new Money(40, 'NZD');
            let c = new Money(50, 'USD');

            a.compare(a).should.equal(0);
            a.compare(b).should.equal(-1);
            b.compare(a).should.equal(1);

            a.eq(a).should.equal(true);
            a.eq(b).should.equal(false);

            a.ne(a).should.equal(false);
            a.ne(b).should.equal(true);

            a.lt(a).should.equal(false);
            a.lt(b).should.equal(true);
            b.lt(a).should.equal(false);

            a.lte(a).should.equal(true);
            a.lte(b).should.equal(true);
            b.lte(a).should.equal(false);

            a.gt(a).should.equal(false);
            a.gt(b).should.equal(false);
            b.gt(a).should.equal(true);

            a.gte(a).should.equal(true);
            a.gte(b).should.equal(false);
            b.gte(a).should.equal(true);

            should.throws(() => a.compare(c));
        });

        it('should test for zero', () => {
            new Money(-1, 'NZD').isZero().should.equal(false);
            new Money(0, 'NZD').isZero().should.equal(true);
            new Money(1, 'NZD').isZero().should.equal(false);
        });

        it('should test for not zero', () => {
            new Money(-1, 'NZD').isNotZero().should.equal(true);
            new Money(0, 'NZD').isNotZero().should.equal(false);
            new Money(1, 'NZD').isNotZero().should.equal(true);
        });

        it('should test for positive', () => {
            new Money(-1, 'NZD').isPositive().should.equal(false);
            new Money(0, 'NZD').isPositive().should.equal(false);
            new Money(1, 'NZD').isPositive().should.equal(true);
        });

        it('should test for negative', () => {
            new Money(-1, 'NZD').isNegative().should.equal(true);
            new Money(0, 'NZD').isNegative().should.equal(false);
            new Money(1, 'NZD').isNegative().should.equal(false);
        });

    });

    describe('Serialisation', () => {

        it('should roundtrip JSON', () => {
            let a = new Money(100, 'NZD'),
                json = JSON.stringify(a),
                b = new Money(JSON.parse(json));
            a.should.eql(b);
        });

    });

    describe('Localisation', () => {
        it('should format to the default locale', () => {
            let money = new Money(1234.7, 'JPY');
            money.toLocaleString().should.equal('¥1,235');
        });

        it('should format to the specified locale', () => {
            let money = new Money(1234.7, 'EUR');

            money.toLocaleString('en-US').should.equal('€1,234.70');
            money.toLocaleString('en-NZ').should.equal('€1,234.70');
            money.toLocaleString('fr-FR').should.equal('1\u00a0234,70\u00a0€');
        });

        it('should format non-latin digits', () => {
            let money = new Money(1234.7, 'EUR');

            money.toLocaleString('en-US').should.equal('€1,234.70');
            money.toLocaleString('en-US-u-nu-thai').should.equal('€๑,๒๓๔.๗๐');
        });

        it('should format to the specified locale with options', () => {
            let money = new Money(1234.7, 'EUR'),
                options = { currencyDisplay: 'code' };

            money.toLocaleString('en-US').should.equal('€1,234.70');
            money.toLocaleString('en-US', options).should.equal('EUR1,234.70');
        });

    });

});
