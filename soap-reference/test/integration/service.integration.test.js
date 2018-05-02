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
const request = require('request');
require('../../index');

describe('service testing', () => {
  it('should get all HCPCS Codes', (done) => {
    const requestOptions = {
      uri: 'http://localhost:10001/HCPCS/',
      json: true
    };

    request.get(requestOptions, (err, res, body) => {
      res.statusCode.should.eql(200);
      Array.isArray(body).should.be.true();
      res.body.length.should.be.greaterThan(0);
      body.forEach((item) => {
        should.exist(item._id);
        should.exist(item.description);
        should.exist(item._kmd);
        should.exist(item._acl);
      });
      done();
    });
  });

  it('should get one HCPCS Codes', (done) => {
    const requestOptions = {
      uri: 'http://localhost:10001/HCPCS/S2112',
      json: true
    };

    request.get(requestOptions, (err, res, body) => {
      res.statusCode.should.eql(200);
      Array.isArray(body).should.be.false();
      should.exist(body._id);
      should.exist(body.title);
      should.exist(body.description);
      should.exist(body._kmd);
      should.exist(body._acl);
      done();
    });
  });

  it('should return a 404 if HCPCS code is not found', (done) => {
    const requestOptions = {
      uri: 'http://localhost:10001/HCPCS/foo',
      json: true
    };

    request.get(requestOptions, (err, res, body) => {
      res.statusCode.should.eql(404);
      body.error.should.eql('NotFound');
      body.description.should.eql('The requested entity or entities were not found in the serviceObject');
      done();
    });
  });

  it('should return a count of all HCPCS codes', (done) => {
    const requestOptions = {
      uri: 'http://localhost:10001/HCPCS/_count',
      json: true
    };

    request.get(requestOptions, (err, res, body) => {
      res.statusCode.should.eql(200);
      Array.isArray(body).should.be.false();
      Object.keys(body).length.should.eql(1);
      should.exist(body.count);
      body.count.should.be.greaterThan(1);
      done();
    });
  });
});
