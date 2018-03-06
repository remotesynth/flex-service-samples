const   sdk = require('kinvey-flex-sdk'),
        https = require('https'),
        configKey = 'Azure Text Analytics',
        hostname = 'westcentralus.api.cognitive.microsoft.com'; // you may need to change this

sdk.service((err, flex) => {
    const   flexFunctions = flex.functions;

    function detectLanguage(context, complete, modules) {
        var requestOptions = {
                hostname: hostname,
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

    function getSentiment(context, complete, modules) {
        // get the language first
        // in the future, it could be worth refactoring the language method to be reusable here
        var requestOptions = {
                hostname: hostname,
                path: '/text/analytics/v2.0/languages',
                method: 'POST'
            },
            req,
            documents = { 'documents': [
                { 'id': '1','text': context.body.message }
            ]};
        _getConfig(complete, modules).then( (result) => {
            var key = result;
            requestOptions.headers = {
                'Ocp-Apim-Subscription-Key' : key
            };
            req = https.request(requestOptions, (response)=> {
                var response_body = '';
                response.on('data', function (d) {
                    response_body += d;
                });
                response.on('end', function () {
                    var res = JSON.parse(response_body),
                        language = res.documents[0].detectedLanguages[0].iso6391Name;
                    // now get the sentiment
                    _getSentiment(language,key,context, complete, modules);
                });
                response.on('error', function (e) {
                    complete().setBody(e).done();
                });
            });
            req.write(JSON.stringify(documents));
            req.end();
        })
    }

    // this actually calls the sentiment service
    // moved to a separate function solely to help with readability
    function _getSentiment(language, key, context, complete, modules) {
        var requestOptions = {
            hostname: hostname,
            path: '/text/analytics/v2.0/sentiment',
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key' : key
            }
        },
        req,
        documents = { 'documents': [
            { 'id': '1', 'language': language, 'text': context.body.message }
        ]};
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
    flexFunctions.register('getSentiment', getSentiment);
});