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

const soap = require('soap');
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ explicitArray: false, async: true, preserveChildrenOrder: true });
const SERVICE_URL = 'http://www.webservicex.net/hcpcs.asmx?wsdl';

function getHCPCS(HCPC, callback) {
  soap.createClient(SERVICE_URL, (err, client) => {
    if (err) {
      return callback(err);
    }

    const args = {
      HCPC
    };

    return client.HCPCS.HCPCSSoap.GetHCPCSbyHCPCSCode(args, (err, result) => {
      if (err) {
        return callback(err);
      }

      return parser.parseString(result.GetHCPCSbyHCPCSCodeResult, (err, parsedResult) =>
        callback(null, parsedResult.NewDataSet.Table));
    });
  });
}

exports.getHCPCS = getHCPCS;
