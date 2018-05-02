const NodeGeocoder = require('node-geocoder');

reverseGeo = function (lat, lon) {
    
    var options = {
        provider: 'google',
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        formatter: null       
    };
    
    var geocoder = NodeGeocoder(options);

    return geocoder.reverse({lat, lon});

}

module.exports = {
    reverseGeo
}