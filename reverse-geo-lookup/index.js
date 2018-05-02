const sdk = require('kinvey-flex-sdk');
const helper = require('./helper');

sdk.service((err, flex) => {

    const functions = flex.functions;

    //Register your flex functions here
    flex.functions.register('accountOnPostFetch', accountOnPostFetchFunction);

    //Post Fetch Hook for Accounts Collection
    function accountOnPostFetchFunction(context, complete, modules) {

        let promises = context.body.map(account => {
            
            //Assign lat and long values
            let lat = account._geoloc[0];
            let lon = account._geoloc[1];
    
            //Call reverse geocoder to append a formatted address to the account object and return the entire object
            return helper.reverseGeo(lat, lon)
            .then(res => {
                account.address = res[0].formattedAddress
                return account                       
            })
            .catch(err => console.log(err));
        })

        //Grab Accounts entities and uses stored Geolocation to reverse geo code and return a formatted address for the user
        Promise.all(promises)
        .then(res => complete().setBody(res).ok().next())
        .catch(err => console.log(err))
    }
});
