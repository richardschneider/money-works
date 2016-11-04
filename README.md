# money-works
[![Travis build status](https://travis-ci.org/richardschneider/money-works.svg)](https://travis-ci.org/richardschneider/money-works)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/money-works/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/money-works?branch=master)
[![npm version](https://badge.fury.io/js/money-works.svg)](https://badge.fury.io/js/money-works) 

Work with money in multiple currencies and different locales.

The [change log](https://github.com/richardschneider/money-works/releases) is automatically produced with
the help of [semantic-release](https://github.com/semantic-release/semantic-release).

## Features

- Precision decimal arithmetic using a [big number](https://www.npmjs.com/package/big.js) package
- [ISO-4217](https://en.wikipedia.org/wiki/ISO_4217) currency codes
- Uses [Martin Folwer's](http://martinfowler.com/) design pattern for [Money](http://martinfowler.com/eaaCatalog/money.html)
- Allocation of funds without loosing pennies (smallest denomination)
- [Banker's rounding](https://en.wikipedia.org/wiki/Rounding) to the precision of the currency 
- Formats to the user's conventions using the [Internationalization API](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl); including non-latin numbering systems
- Uses [Andy Earnshaw's Intl](https://github.com/andyearnshaw/Intl.js) when the environment's `Intl` package doesn't support the language.
- Maintains a cache of locales for performance
- Supports the common cryptocurrencies XBT(BTC), ETH, XMR and XRP

## Getting started

Install with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install money-works --save

### Usage

    const Money = require('money-works');
    const price = new Money(1000.6, 'JPY');

`toString` always returns the exact amount and currency

    price.toString()                // '1000.6 JPY'

`toLocaleString` returns the localised version of the Money.  Note that YEN is not displayed with decimal places.

    price.toLocaleString('en-NZ')   // '¥1,001'
    price.toLocaleString('fr-CA')   // '1 001 ¥'

`allocate` distributes the Money based on the ratio without loosing any pennies.  It returns an Array of Money.

    price.allocate([1, 1])          // '501 JPY' and '500 JPY'
    price.allocate([70, 20, 10])    // '701 JPY', '200 JPY' and '100 JPY'
    
with ES6, `me` gets 70% and `other` only 30% of the price

    let [me, other] = price.allocate([70, 30]);

The standard Math functions (`plus`, `minus` and `times`) are available and are chainable.  `plus` and `minus` require Money of the same currency.  Its always a good idea to `round` the result of a calculation, which uses banker's rounding to the precision of the currency.

    let gst = 0.15,
        total = price               // '1151 YPN' = 1000.6 + 150.09
            .plus(price.times(gst))
            .round();

Comparision functions are `eq`, `ne`, `lt`, `lte`, `gt`, `gte` and require Money of the same currency. Testing the amount against zero is done with `isZero`, `isNotZero`, `isPositive` and `isNegative`.

    if (total.isPositive()) {
        placeOrder();
    }

### Forex

Foreign exchange of currencies usually requires more precision than the currency default.  `round` can accept the number of decimal places.

    new Money(123.57719, 'NZD').round(4);   // '123.5772 NZD'
    
The `allocate` method also has an optional precision

    const fund = new Money(1000.6, 'JPY');
    fund.allocate([1, 1])                   // '501 JPY' and '500 JPY'
    fund.allocate([1, 1], 4)                // '501.3 JPY' and '500.3 JPY'
    
And `toLocaleString`
    
     let money = new Money(123.57719, 'NZD');
     let options = { maximumFractionDigits: 4 };
     money.toLocaleString('fr-FR', options);    // '123,5772 $NZ'
     
### Localisation

`toLocaleString([locales], [options])` gets the local representation of the Money in the locale; see [MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) for the details. The `options.style` and `options.currency` are always set to 'currency' and Money.currency, respectively.

    price.toLocaleString('fr-CA')       // '1 001 ¥'
    let opt = { currencyDisplay: 'code' }
    price.toLocaleString('fr-CA', opt)  // '1 001 YEN'

