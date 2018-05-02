const sdk = require('kinvey-flex-sdk');
var parser = require('xml2json');
fs = require('fs');

sdk.service((err, flex) => {
    const flexData = flex.data;
    function getXMLData(request, complete, modules) {
      //define where to read the XML file from
        fs.readFile( './XMLsData.xml', function(err, data) {
          //Parse XML to JSON
            var json = parser.toJson(data);
            var body=JSON.parse(json); // { foo: bar }
            return complete().setBody(body).ok().next(); 
        });      
      }
    const data = flex.data;   // gets the datalink object from the service      
    const flexXMLData = data.serviceObject('getWeather');   
    flexXMLData.onGetAll(getXMLData);
  });