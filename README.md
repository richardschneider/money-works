# money-works
[![Travis build status](https://travis-ci.org/richardschneider/money-works.svg)](https://travis-ci.org/richardschneider/money-works)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/money-works/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/money-works?branch=master)
[![npm version](https://badge.fury.io/js/money-works.svg)](https://badge.fury.io/js/money-works) 

Work with money in multiple currencies

**Not yet ready for prime time**

## Features

- Precision decimal arithmetic using a [big number](https://www.npmjs.com/package/big.js) package
- Uses [ISO-4217](https://en.wikipedia.org/wiki/ISO_4217) currency codes
- Uses [Martin Folwer's](http://martinfowler.com/) design pattern for [Money](http://martinfowler.com/eaaCatalog/money.html)
- Allocation of funds without losing pennies (smallest denomination)
- Rounding to the precision of the currency
- Formats to the user's conventions using the [Internationalization API](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl); including non-latin numbering systems
- Uses [Andy Yearnshaw's Intl](https://github.com/andyearnshaw/Intl.js) when the environment's `Intl` package doesn't support the language.
