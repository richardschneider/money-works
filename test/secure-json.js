'use strict';

const getJSON = require('../lib/secure-json');
require('should');

describe('Secure JSON', () => {
    it('should reject DNS errors', () => {
        return getJSON('https://emanon.org.x')
            .should.be.rejected();
    });

    it('should reject HTTP errors', () => {
        return getJSON('https://api.fixer.io/not-latest')
            .should.be.rejectedWith({message: 'Failed to get data: 404'});
    });

    it('should fulfill with a JSON object', () => {
        return getJSON('https://free.currencyconverterapi.com/api/v5/convert?q=NZD_CNY&compact=ultra').should
            .finally.be.instanceOf(Object)
            .and.have.property('NZD_CNY');
    });

});
