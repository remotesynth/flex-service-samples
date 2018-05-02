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

const should = require('should');
const responses = require('../fixtures/json-data');

function transformEntity(entity, modules) {
  Array.isArray(entity).should.be.false();
  entity.should.be.an.Object();
  should.exist(entity.LongDescription);
  should.exist(entity.ShortDescription);
  should.exist(entity.HCPC);
  should.exist(modules);
  should.exist(modules.kinveyEntity.entity);
  modules.kinveyEntity.entity.should.be.a.Function();
  entity.should.eql(responses.getOneResponse);
  return responses.transformedGetOne;
}

function transformArray(array, modules, callback) {
  Array.isArray(array).should.be.true();
  array.length.should.be.greaterThan(1);
  const entity = array[0];
  should.exist(entity.LongDescription);
  should.exist(entity.ShortDescription);
  should.exist(entity.HCPC);
  should.exist(modules);
  should.exist(modules.kinveyEntity.entity);
  modules.kinveyEntity.entity.should.be.a.Function();
  array.should.eql(responses.getAllResponse);
  callback(null, responses.transformedGetAll);
}

function transformCount(array) {
  return { count: array.length };
}

exports.transformArray = transformArray;
exports.transformEntity = transformEntity;
exports.transformCount = transformCount;
