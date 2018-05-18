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

const async = require('async');

function transformEntity(entity, modules) {
  if (typeof entity !== 'object') {
    return new Error('The entity must be an object.');
  }

  if (Array.isArray(entity)) {
    return new Error('Arrays are not permitted.  Only a single entity may be supplied.');
  }

  if (entity.HCPC == null) {
    return new Error('No HCPC field (_id) present in the resulting entity');
  }

  if (modules == null || modules.kinveyEntity == null || modules.kinveyEntity.entity == null) {
    return new Error('A valid modules object must be supplied');
  }

  const mappedEntity = modules.kinveyEntity.entity();
  mappedEntity._id = entity.HCPC;
  mappedEntity.title = entity.ShortDescription;
  mappedEntity.description = entity.LongDescription;
  return mappedEntity;
}

function transformArray(array, modules, callback) {
  if (Array.isArray(array) === false) {
    if (typeof array === 'object') {
      array = [array];
    } else {
      return callback(new Error('Item transformed must be an array or object'));
    }
  }

  if (typeof modules === 'function'
    || modules == null
    || modules.kinveyEntity == null
    || modules.kinveyEntity.entity == null) {
    if (typeof modules === 'function' && callback == null) {
      callback = modules;
    }

    if (callback !== null) {
      return setImmediate(() => callback(new Error('A valid modules object must be supplied')));
    }
  }

  if (callback == null || typeof callback !== 'function') {
    throw new Error('A callback function must be supplied');
  }

  return async.map(array, (item, cb) => {
    const mappedItem = transformEntity(item, modules);

    if (mappedItem instanceof Error) {
      return setImmediate(() => cb(mappedItem));
    }

    return setImmediate(() => cb(null, mappedItem));
  }, (err, transformedResult) => {
    if (err) {
      return callback(new Error(err));
    }
    return callback(null, transformedResult);
  });
}

function transformCount(array) {
  if (Array.isArray(array) === false && typeof array !== 'object') {
    return new Error('Supplied data is not an array or object');
  }

  if (Array.isArray(array) === false && typeof array === 'object') {
    return { count: 1 };
  }
  return { count: array.length };
}

exports.transformArray = transformArray;
exports.transformEntity = transformEntity;
exports.transformCount = transformCount;
