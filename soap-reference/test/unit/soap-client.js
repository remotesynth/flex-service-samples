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

const nock = require('nock');
const should = require('should');
const soap = require('../../lib/soap-client');
const responses = require('../fixtures/soap-responses');

describe('soap-client', () => {
  it('should make a request with no specified HCPC', (done) => {
    nock('http://www.webservicex.net')
      .get('/hcpcs.asmx?wsdl')
      .reply(200, () => responses.wsdl);

    nock('http://www.webservicex.net')
      .replyContentLength()
      .post('/hcpcs.asmx', body => body.match(/<HCPC xsi:nil="true">/) != null)
      .reply(200, () => responses.getAllResponse,
        { 'Content-Type': 'application/soap+xml; charset=utf-8' });

    soap.getHCPCS(null, (err, result) => {
      nock.cleanAll();
      should.not.exist(err);
      Array.isArray(result).should.be.true();
      result.length.should.be.greaterThan(0);
      result.forEach((item) => {
        should.exist(item.HCPC);
        should.exist(item.LongDescription);
      });
      done();
    });
  });

  it('should make a request with a specified HCPC', (done) => {
    nock('http://www.webservicex.net')
      .get('/hcpcs.asmx?wsdl')
      .reply(200, () => responses.wsdl);

    nock('http://www.webservicex.net')
      .replyContentLength()
      .post('/hcpcs.asmx', body => body.match(/<HCPC>S2112<\/HCPC>/) != null)
      .reply(200, () => responses.getOneResponse,
        { 'Content-Type': 'application/soap+xml; charset=utf-8' });

    soap.getHCPCS('S2112', (err, result) => {
      nock.cleanAll();
      should.not.exist(err);
      Array.isArray(result).should.be.false();
      should.exist(result.HCPC);
      should.exist(result.LongDescription);
      should.exist(result.ShortDescription);
      done();
    });
  });

  it('should make a request with an invalid HCPC', (done) => {
    nock('http://www.webservicex.net')
      .get('/hcpcs.asmx')
      .reply(200, () => responses.wsdl);

    nock('http://www.webservicex.net')
      .replyContentLength()
      .post('/hcpcs.asmx', body => body.match(/foobar/) != null)
      .reply(200, () => responses.notFound,
        { 'Content-Type': 'application/soap+xml; charset=utf-8' });

    soap.getHCPCS('foobar', (err, result) => {
      nock.cleanAll();
      should.not.exist(err);
      should.not.exist(result);
      done();
    });
  });
});
