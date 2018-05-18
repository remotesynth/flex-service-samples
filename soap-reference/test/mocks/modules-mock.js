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

module.exports = {
  kinveyEntity: {
    entity: function createEntity(entity) {
      let kinveyEntity = {};
      if (entity != null) {
        kinveyEntity = JSON.parse(JSON.stringify(entity));
      }

      kinveyEntity._acl = { creator: uuid.v4() };
      kinveyEntity._kmd = {
        lmt: new Date().toISOString(),
        ect: new Date().toISOString()
      };
      return kinveyEntity;
    }
  }
};
