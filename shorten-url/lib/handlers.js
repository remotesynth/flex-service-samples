const request = require('request');

const configKey = 'Google URL Shortener API';

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

function shortenURL(context, complete, modules) {
  const requestOptions = {
    uri: 'https://www.googleapis.com/urlshortener/v1/url?key=',
    body: {
      longUrl: context.body.longUrl
    },
    json: true,
    resolveWithFullResponse: true
  };
  _getConfig(complete, modules).then((result) => {
    requestOptions.uri += result;
    request.post(requestOptions, (error, res, body) => {
      if (error) {
        return complete().setBody(error).runtimeError().done();
      }
      complete()
        .setBody({ shortUrl: body.id })
        .done();
    });
  });
}

exports.shortenURL = shortenURL;
