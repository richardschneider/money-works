'use strict';

const Money = require('..');
const Big = require('big.js');
const should = require('should');

describe('Money', () => {

    it('should have a Big amount', () => {
        let money = new Money(10, 'YEN');
        money.should.have.property('amount');
        money.amount.should.be.instanceof(Big);
        money.amount.should.eql(new Big(10));
    });

    it('should have an ISO-4217 currency code', () => {
        let money = new Money(10, 'YEN');
        money.should.have.property('currency', 'YEN');
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

    });

});
