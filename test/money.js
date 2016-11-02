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

    it('should print exact amount and currency code', () => {
        let money = new Money(10.6, 'JPY');
        money.toString().should.equal('10.6 JPY');
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

        it('should not allow a string amount', () => {
            should.throws(() => new Money('10.12', 'NZD'));
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

    });
});
