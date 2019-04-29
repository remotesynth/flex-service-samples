# SOAP API Reference Flex Connector

## Introduction

Kinvey's native API format is JSON over HTTP.  Many APIs, however, use SOAP as a document format.
This project is a reference Flex Connector for connecting to SOAP-based APIs.  This reference connector consumes a database of medical insurance HCPCS codes.

## Installation

To use this connector, clone this GitHub repository, and install the associated dependencies:

```npm install```

The DLC can either be deployed to the FlexService Runtime, or run locally.  To run locally, you must have node.js
v6.x or greater.  Execute:

```node .```

## Dependencies

This Flex Connector uses the following dependencies, in addition to the `kinvey-flex-sdk`:

* *async:* The async.js module is used managing concurrency in transforming data
* *soap:* A library for consuming SOAP APIs
* *xml2js:* Used for converting XML to JSON, and JSON to XML

## Testing

This reference connector contains sample automated tests, both unit and integration.  To run the tests, execute:

```npm test```

## Overview

The Flex Connector implements three methods associated with the Kinvey DataLink API:

* onGetAll
* onGetById
* onGetCount

The service objects and handlers are defined in the `index.js` file.  The handlers are loaded seperately from `lib/handlers`.  This separation is done for two purposes:
 a) to increase modularity and reusability of code
 b) to facilitate unit testing

```
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
```

The handlers then perform two steps for every request:
1) Make a request to `lib/soap-client` for processing the SOAP call and converting the response to JSON
2) Transform the result into valid Kinvey entities and map to new field names in `transformers.coffee`

For example, for `onGetById`, the handler makes a call to the `soap-client`:

```soap.getHCPCS(context.entityId, (err, result) => {```

The SOAP Client calls the API, gets the result, and converts the result to JSON:

```
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
```

Finally, the transformer is called to return the result:

```
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
```

After transforming, we complete the flex request and return the results to the request pipeline for further processing:

```
return complete().setBody(result).ok().next();
```