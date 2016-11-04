'use strict';

const l10n = require('../lib/l10n');
require('should');

describe('Localisation', () => {
    it('should cache locales', () => {
        let a = l10n('en-NZ', 'EUR'),
            b = l10n('en-NZ', 'EUR'),
            c = l10n('en-NZ', 'EUR', { currencyDisplay: 'code' });
        a.should.equal(b);
        a.should.not.equal(c);
    });

    it('should accept any language', () => {
        let a = l10n('xx-XX', 'EUR');
        a.should.have.property('format');
    });
});
