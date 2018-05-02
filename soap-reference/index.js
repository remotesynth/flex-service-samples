/**
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

const sdk = require('kinvey-flex-sdk');
const handlers = require ('./lib/handlers');

// Initiate the Flex SDK Service
sdk.service((err, flex) => {
  if (err) {
    console.log('Error initializing the Flex SDK, exiting.');
    throw err;
  }

  const data = flex.data;   // gets the datalink object from the service
  const partner = data.serviceObject('HCPCS');        // Creates the HCPCS Service Object

  // wire up the events that we want to process
  partner.onGetById(handlers.getOneHCPCSCode);
  partner.onGetAll(handlers.getAllHCPCSCodes);
  partner.onGetCount(handlers.countHCPCSCodes);
});
