const https = require('https');
const configKey = 'Azure Text Analytics';
// you may need to change this
const hostname = 'westcentralus.api.cognitive.microsoft.com';

// this actually calls the sentiment service
// moved to a separate function solely to help with readability
function _getSentiment(language, key, context, complete) {
  const requestOptions = {
    hostname,
    path: '/text/analytics/v2.0/sentiment',
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key
    }
  };
  const documents = {
    documents: [{ id: '1', language, text: context.body.message }]
  };
  const req = https.request(requestOptions, (response) => {
    let responseBody = '';
    response.on('data', (d) => {
      responseBody += d;
    });
    response.on('end', () => {
      complete()
        .setBody(responseBody)
        .done();
    });
    response.on('error', (e) => {
      complete()
        .setBody(e)
        .done();
    });
  });
  req.write(JSON.stringify(documents));
  req.end();
}

function _getConfig(complete, modules) {
  return new Promise((resolve) => {
    const options = {
      useUserContext: false
    };
    const store = modules.dataStore(options);
    const config = store.collection('config');
    const query = new modules.Query();

    query.equalTo('configKey', configKey);
    config.find(query, (err, result) => {
      if (err) {
        reject(err);
      } else if (result === undefined || result[0] === undefined || result[0].configVal === undefined) {
        reject(new Error('Configuration value does not exist'));
      }
      resolve(result[0].configVal);
    });
  });
}

function detectLanguage(context, complete, modules) {
  const requestOptions = {
    hostname,
    path: '/text/analytics/v2.0/languages',
    method: 'POST'
  };
  const documents = {
    documents: [{ id: '1', text: context.body.message }]
  };
  let req;
  _getConfig(complete, modules).then((result) => {
    requestOptions.headers = {
      'Ocp-Apim-Subscription-Key': result
    };
    req = https.request(requestOptions, (response) => {
      let responseBody = '';
      response.on('data', (d) => {
        responseBody += d;
      });
      response.on('end', () => {
        complete()
          .setBody(responseBody)
          .done();
      });
      response.on('error', (e) => {
        complete()
          .setBody(e)
          .done();
      });
    });
    req.write(JSON.stringify(documents));
    req.end();
  });
}

function getSentiment(context, complete, modules) {
  // get the language first
  // in the future, it could be worth refactoring the language method to be reusable here
  const requestOptions = {
    hostname,
    path: '/text/analytics/v2.0/languages',
    method: 'POST'
  };
  const documents = {
    documents: [{ id: '1', text: context.body.message }]
  };
  let req;
  _getConfig(complete, modules).then((result) => {
    const key = result;
    requestOptions.headers = {
      'Ocp-Apim-Subscription-Key': key
    };
    req = https.request(requestOptions, (response) => {
      let responseBody = '';
      response.on('data', (d) => {
        responseBody += d;
      });
      response.on('end', () => {
        const res = JSON.parse(responseBody);
        const language = res.documents[0].detectedLanguages[0].iso6391Name;
        // now get the sentiment
        _getSentiment(language, key, context, complete);
      });
      response.on('error', (e) => {
        complete()
          .setBody(e)
          .done();
      });
    });
    req.write(JSON.stringify(documents));
    req.end();
  });
}

exports.detectLanguage = detectLanguage;
exports.getSentiment = getSentiment;