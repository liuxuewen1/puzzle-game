'use strict';

const Q = require('q');
const request = require('request');

exports.request = (url, form, headers, method) => {
  let deferred = Q.defer();
  request({
    url: url,
    method: method || 'POST',
    form: form,
    headers: headers,
    gzip: true
  }, (err, httpResponse, body) => {
    console.log(body, 888)
    if (err) {
      deferred.reject(new Error(err));
    } else {
      let res = {
        errorCode: 99,
        errorMessage: '系统繁忙'
      };
      try {
        res = JSON.parse(body);
      } catch (err) {
        console.error(body);
        console.trace(err);
        deferred.reject(new Error(err));
      }
      deferred.resolve({
        resp: httpResponse,
        body: res
      });
    }
  });
  return deferred.promise;
};