'use strict';

const normalise = require('../lib/number');
require('should');

describe('Numeric string', () => {
    it('should allow full stop for decimal point', () => {
        normalise('1.23').should.equal('1.23');
    });

    it('should allow comma for decimal point', () => {
        normalise('1,23').should.equal('1.23');
    });

    it('should allow space for group separator', () => {
        normalise('123 456.678 9').should.equal('123456.6789');
        normalise('123 456,678 9').should.equal('123456.6789');
    });

});
