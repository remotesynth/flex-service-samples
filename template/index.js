const sdk = require('kinvey-flex-sdk');
const handlers = require('./lib/handlers');

sdk.service((err, flex) => {
  const flexFunctions = flex.functions;

  flexFunctions.register('exampleFunction', handlers.exampleFunction);
});