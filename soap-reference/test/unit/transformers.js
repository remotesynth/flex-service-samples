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

const uuid = require('uuid');
const should = require('should');
const transformers = require('../../lib/transformers');
const modules = require('../mocks/modules-mock');

describe('transformers', () => {
  describe('transformArray', () => {
    beforeEach(() => {
      this.testData = [
        {
          ShortDescription: uuid.v4(),
          LongDescription: uuid.v4(),
          HCPC: uuid.v4()
        },
        {
          ShortDescription: uuid.v4(),
          LongDescription: uuid.v4(),
          HCPC: uuid.v4()
        }
      ];
    });

    it('should transform the _id field to the value of the HCPC field for each entity', (done) => {
      transformers.transformArray(this.testData, modules, (err, result) => {
        result.forEach((item, index) => {
          should.exist(item._id);
          item._id.should.eql(this.testData[index].HCPC);
          should.not.exist(item.HCPC);
        });
        done();
      });
    });

    it('should only contain keys that are transformed', (done) => {
      transformers.transformArray(this.testData, modules, (err, result) => {
        result.forEach((item) => {
          Object.keys(item).length.should.eql(5);
        });
        done();
      });
    });

    it('should transform data fields', (done) => {
      transformers.transformArray(this.testData, modules, (err, result) => {
        result.forEach((item, index) => {
          should.exist(item.title);
          should.exist(item.description);
          should.not.exist(item.LongDescription);
          should.not.exist(item.ShortDesctiption);
          item.title.should.eql(this.testData[index].ShortDescription);
          item.description.should.eql(this.testData[index].LongDescription);
        });
        done();
      });
    });

    it('should return an error if no _id field is supplied', (done) => {
      const testData = [
        {
          ShortDescription: 'foo',
          LongDescription: 'bar'
        }
      ];

      transformers.transformArray(testData, modules, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('Error: No HCPC field (_id) present in the resulting entity');
        done();
      });
    });

    it('should be a kinveyEntity', (done) => {
      transformers.transformArray(this.testData, modules, (err, result) => {
        result.forEach((item) => {
          should.exist(item._id);
          should.exist(item._kmd);
          should.exist(item._kmd.lmt);
          should.exist(item._kmd.ect);
          should.exist(item._acl);
        });
        done();
      });
    });

    it('should return an empty array if an empty array is passed in', (done) => {
      const testData = [];
      transformers.transformArray(testData, modules, (err, result) => {
        result.should.be.an.Array();
        result.length.should.eql(0);
        done();
      });
    });

    it('should return an array of one if a single object is passed in', (done) => {
      const testData = this.testData[1];
      Array.isArray(testData).should.be.false();
      transformers.transformArray(testData, modules, (err, result) => {
        result.should.be.an.Array();
        result.length.should.eql(1);
        done();
      });
    });

    it('should return an error if invalid data is supplied', (done) => {
      const testData = uuid.v4();
      Array.isArray(testData).should.be.false();
      transformers.transformArray(testData, modules, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('Item transformed must be an array or object');
        done();
      });
    });

    it('should return an error if array eleements are not objects', (done) => {
      const testData = [1, 2, 3];
      transformers.transformArray(testData, modules, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('Error: The entity must be an object.');
        done();
      });
    });

    it('should return an error if a single array eleement is not an object', (done) => {
      this.testData.push('foo');
      transformers.transformArray(this.testData, modules, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('Error: The entity must be an object.');
        done();
      });
    });

    it('should return an error if an invalid modules object is supplied', (done) => {
      const badModule = { foo: 'bar' };
      transformers.transformArray(this.testData, badModule, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('A valid modules object must be supplied');
        done();
      });
    });

    it('should return an error if a null modules object is supplied', (done) => {
      transformers.transformArray(this.testData, null, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('A valid modules object must be supplied');
        done();
      });
    });

    it('should return an error if no modules object is supplied', (done) => {
      transformers.transformArray(this.testData, (err, result) => {
        should.not.exist(result);
        err.message.should.eql('A valid modules object must be supplied');
        done();
      });
    });

    it('should throw an error if no callback function is supplied', (done) => {
      should.throws(() => transformers.transformArray(this.testData, modules));
      done();
    });
  });

  describe('transformEntity', () => {
    beforeEach(() => {
      this.testData = {
        ShortDescription: uuid.v4(),
        LongDescription: uuid.v4(),
        HCPC: uuid.v4()
      };
    });

    it('should transform the _id field to the value of the HCPC field for each entity', () => {
      const transformedData = transformers.transformEntity(this.testData, modules);
      should.exist(transformedData._id);
      transformedData._id.should.eql(this.testData.HCPC);
    });

    it('should only contain keys that are transformed', () => {
      const transformedData = transformers.transformEntity(this.testData, modules);
      Object.keys(transformedData).length.should.eql(5);
    });

    it('should transform data fields', () => {
      const transformedData = transformers.transformEntity(this.testData, modules);
      should.exist(transformedData.title);
      should.exist(transformedData.description);
      should.not.exist(transformedData.LongDescription);
      should.not.exist(transformedData.ShortDesctiption);
      transformedData.title.should.eql(this.testData.ShortDescription);
      transformedData.description.should.eql(this.testData.LongDescription);
    });

    it('should return an error if no _id field is supplied', () => {
      const testData = {
        ShortDescription: 'foo',
        LongDescription: 'bar'
      };

      const transformedData = transformers.transformEntity(testData, modules);
      transformedData.should.be.an.Error();
      transformedData.message.should.eql('No HCPC field (_id) present in the resulting entity');
    });

    it('should be a kinveyEntity', () => {
      const transformedEntity = transformers.transformEntity(this.testData, modules);
      should.exist(transformedEntity._id);
      should.exist(transformedEntity._kmd);
      should.exist(transformedEntity._kmd.lmt);
      should.exist(transformedEntity._kmd.ect);
      should.exist(transformedEntity._acl);
    });

    it('should return an error if an array is supplied.', () => {
      const testData = [this.testData];
      Array.isArray(testData).should.be.true();
      const transformedEntity = transformers.transformEntity(testData, modules);
      transformedEntity.should.be.an.Error();
      transformedEntity.message.should.eql('Arrays are not permitted.  Only a single entity may be supplied.');
    });

    it('should return an error if entity is not an object', () => {
      const testData = uuid.v4();
      const transformedEntity = transformers.transformEntity(testData, modules);
      transformedEntity.should.be.an.Error();
      transformedEntity.message.should.eql('The entity must be an object.');
    });

    it('should return an error if an invalid modules object is supplied', () => {
      const badModule = { foo: 'bar' };
      const transformedEntity = transformers.transformEntity(this.testData, badModule);
      transformedEntity.should.be.an.Error();
      transformedEntity.message.should.eql('A valid modules object must be supplied');
    });

    it('should return an error if an invalid modules object is supplied', () => {
      const transformedEntity = transformers.transformEntity(this.testData, null);
      transformedEntity.should.be.an.Error();
      transformedEntity.message.should.eql('A valid modules object must be supplied');
    });

    it('should return an error if no modules object is supplied', () => {
      const transformedEntity = transformers.transformEntity(this.testData);
      transformedEntity.should.be.an.Error();
      transformedEntity.message.should.eql('A valid modules object must be supplied');
    });
  });

  describe('transformCount', () => {
    it('should return the count as an object with a count', () => {
      const testData = [1, 2, 3, 4];
      const result = transformers.transformCount(testData);
      result.count.should.eql(testData.length);
    });

    it('should return the count as an object with a single entity', () => {
      const testData = [1];
      const result = transformers.transformCount(testData);
      result.count.should.eql(testData.length);
    });

    it('should return the count with an empty array', () => {
      const testData = [];
      const result = transformers.transformCount(testData);
      result.count.should.eql(testData.length);
    });

    it('should return a count of one with a single object', () => {
      const testData = { foo: uuid.v4() };
      const result = transformers.transformCount(testData);
      result.count.should.eql(1);
    });

    it('should return an error if invalid data', () => {
      const testData = 'foo';
      const result = transformers.transformCount(testData);
      result.should.be.an.Error();
      result.message.should.eql('Supplied data is not an array or object');
    });
  });
});
