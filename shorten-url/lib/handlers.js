const request = require('request');

const configKey = 'Rebrandly URL Shortener';

function _getConfig(complete, modules) {
  return new Promise((resolve, reject) => {
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
    uri: 'https://api.rebrandly.com/v1/links',
    body: {
      destination: context.body.longUrl
    },
    json: true,
    resolveWithFullResponse: true
  };
  _getConfig(complete, modules).then((result) => {
    requestOptions.headers = {
      'apikey': result
    };
    request.post(requestOptions, (error, res, body) => {
      if (error) {
        return complete().setBody(error).runtimeError().done();
      }
      console.log(body);
      complete()
        .setBody({ shortUrl: body.shortUrl })
        .done();
    });
  });
}

exports.shortenURL = shortenURL;
