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

const proxyquire = require('proxyquire');
const sinon = require('sinon');
const should = require('should');
const completeMock = require('../mocks/complete-mock');
const soapMock = require('../mocks/soap-client-mock');
const transformersMock = require('../mocks/transformers-mock');
const modulesMock = require('../mocks/modules-mock');

const handler = proxyquire('../../lib/handlers', { './soap-client': soapMock, './transformers': transformersMock });

const complete = completeMock.complete;

describe('handlers', () => {
  beforeEach(() => {
    this.getOneTransformerSpy = sinon.spy(transformersMock, 'transformEntity');
    this.getAllTransformerSpy = sinon.spy(transformersMock, 'transformArray');
    this.transformCount = sinon.spy(transformersMock, 'transformCount');
    this.clientSpy = sinon.spy(soapMock, 'getHCPCS');
  });

  afterEach(() => {
    this.getOneTransformerSpy.restore();
    this.getAllTransformerSpy.restore();
    this.transformCount.restore();
    this.clientSpy.restore();
    completeMock.completeEmitter.removeAllListeners('done');
  });

  it('should return all entities', (done) => {
    const context = {};

    completeMock.completeEmitter.on('done', (response) => {
      response.statusCode.should.eql(200);
      Array.isArray(response.body).should.be.true();
      should.exist(response.body[0].title);
      should.exist(response.body[0].description);
      this.clientSpy.calledOnce.should.be.true();
      this.getOneTransformerSpy.callCount = response.size;
      this.getAllTransformerSpy.calledOnce.should.be.true();
      this.getAllTransformerSpy.calledAfter(this.clientSpy);
      done();
    });

    handler.getAllHCPCSCodes(context, complete, modulesMock);
  });

  it('should return a single entity', (done) => {
    const context = {
      entityId: 'S2112'
    };

    completeMock.completeEmitter.on('done', (response) => {
      response.statusCode.should.eql(200);
      Array.isArray(response.body).should.be.false();
      response.body.should.be.an.Object();
      response.body._id.should.eql(context.entityId);
      should.exist(response.body.title);
      should.exist(response.body.description);
      this.clientSpy.calledOnce.should.be.true();
      this.getOneTransformerSpy.calledOnce.should.be.true();
      this.getOneTransformerSpy.calledAfter(this.clientSpy);
      done();
    });

    handler.getOneHCPCSCode(context, complete, modulesMock);
  });


  it('should return notfound if the entity does not exist', (done) => {
    const context = {
      entityId: 'foo'
    };

    completeMock.completeEmitter.on('done', (response) => {
      response.statusCode.should.eql(404);
      this.clientSpy.calledOnce.should.be.true();
      this.getAllTransformerSpy.called.should.be.false();
      this.getOneTransformerSpy.called.should.be.false();
      done();
    });

    handler.getOneHCPCSCode(context, complete, modulesMock);
  });

  it('should handle a count', (done) => {
    const context = {};

    completeMock.completeEmitter.on('done', (response) => {
      response.statusCode.should.eql(200);
      Array.isArray(response.body).should.be.false();
      Object.keys(response.body).length.should.eql(1);
      should.exist(response.body.count);
      this.clientSpy.calledOnce.should.be.true();
      this.getOneTransformerSpy.called.should.be.false();
      this.getAllTransformerSpy.called.should.be.false();
      this.transformCount.calledOnce.should.be.true();
      done();
    });

    handler.countHCPCSCodes(context, complete, modulesMock);
  });
});
