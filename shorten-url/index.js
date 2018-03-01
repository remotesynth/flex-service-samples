const   sdk = require('kinvey-flex-sdk'),
        request = require('request'),
        configKey = 'Google URL Shortener API';

sdk.service((err, flex) => {
    const   flexFunctions = flex.functions;
    
    function shortenURL(context, complete, modules) {
        var requestOptions = {
            uri: 'https://www.googleapis.com/urlshortener/v1/url?key=',
            body: {
                longUrl: context.body.longUrl,
            },
            json: true,
            resolveWithFullResponse: true
        };
        _getConfig(complete, modules).then( (result) => {
            requestOptions.uri += result;
            //complete().setBody(requestOptions.uri).done();
            request.post(requestOptions, (error, res, body) => {
                if (error){
                    complete().setBody(error);
                } else {
                    complete().setBody({"shortUrl": body.id }).done();
                }
            });
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

    flexFunctions.register('shortenURL', shortenURL);
});