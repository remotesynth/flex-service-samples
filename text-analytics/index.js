const   sdk = require('kinvey-flex-sdk'),
        https = require('https'),
        configKey = 'Azure Text Analytics';

sdk.service((err, flex) => {
    const   flexFunctions = flex.functions;

    function detectLanguage(context, complete, modules) {
        var requestOptions = {
                hostname: 'westcentralus.api.cognitive.microsoft.com', // you may need to change this
                path: '/text/analytics/v2.0/languages',
                method: 'POST'
            },
            req,
            documents = { 'documents': [
                { 'id': '1','text': context.body.message }
            ]};
        _getConfig(complete, modules).then( (result) => {
            requestOptions.headers = {
                'Ocp-Apim-Subscription-Key' : result
            };
            req = https.request(requestOptions, (response)=> {
                var response_body = '';
                response.on('data', function (d) {
                    response_body += d;
                });
                response.on('end', function () {
                    complete().setBody(response_body).done();
                });
                response.on('error', function (e) {
                    complete().setBody(e).done();
                });
            });
            req.write(JSON.stringify(documents));
            req.end();
        })
    }

    function _getConfig(complete, modules) {
        return new Promise(resolve => {
            const   options = {
                        useUserContext: false
                    },
                    store = modules.dataStore(options),
                    config = modules.dataStore().collection("config"),
                    query = new modules.Query();
            
            query.equalTo('configKey',configKey);
            config.find(query,(err, result) => {
                if (err) {
                    reject(err);
                }
                else if (result === undefined || result[0] === undefined ||result[0]["configVal"] === undefined) {
                    reject(new Error("Configuration value does not exist"));
                }
                resolve(result[0].configVal);
            });
        });
    }

    flexFunctions.register('detectLanguage', detectLanguage);
});