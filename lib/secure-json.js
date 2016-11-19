// Thanks Tomas Dvorak for the initial idea (https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/)

'use strict';

const https = require('https');

function getSecureJSON(url) {
  // return new pending promise
  return new Promise((resolve, reject) => {
        let request = https.get(url, response => {

            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to get data: ' + response.statusCode));
            }
            let body = [];
            response.on('data', chunk => body.push(chunk));
            response.on('end', () => resolve(JSON.parse(body.join(''))));
        });
        request.on('error', e => reject(e));
    });
}

module.exports = getSecureJSON;
