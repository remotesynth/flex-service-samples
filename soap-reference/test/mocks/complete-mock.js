/**
 * Copyright (c) 2017 Kinvey Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const EventEmitter = require('events').EventEmitter;

const completeEmitter = new EventEmitter();

function complete() {
  let body = {};
  let statusCode = 0;
  let obj = {};

  function setBody(result) {
    body = result;
    return obj;
  }

  function ok() {
    statusCode = 200;
    return obj;
  }

  function notFound() {
    statusCode = 404;
    return obj;
  }

  function next() {
    const response = {
      body,
      statusCode,
      continue: true
    };

    completeEmitter.emit('done', response);
  }

  function done() {
    const response = {
      body,
      statusCode,
      continue: false
    };

    completeEmitter.emit('done', response);
  }

  obj = {
    setBody,
    ok,
    notFound,
    next,
    done
  };

  return obj;
}

exports.complete = complete;
exports.completeEmitter = completeEmitter;
