'use strict';

function getSecureJSON(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (this.status < 200 || this.status > 299) {
                reject(new Error('Failed to get data: ' + this.status));
            } else {
                resolve(JSON.parse(xhr.response));
            }
        };
        xhr.onerror = function () {
            reject(new Error(xhr.statusText));
        };
        xhr.send();
    });
}

module.exports = getSecureJSON;
