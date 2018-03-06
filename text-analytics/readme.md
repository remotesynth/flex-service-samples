# text-analytics FlexService

text-analytics is a FlexService intended to be used as a FlexFunction that is hooked to custom endpoints within Kinvey. It relies on the [Azure Text Analytics API](https://docs.microsoft.com/en-us/azure/cognitive-services/text-analytics/) to create short URLs. This API requires an [API Key](https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/?api=text-analytics). It implements the functions for determining language and sentiment included in the text analytics API.

As written, the FlexFunction depends on a private Kinvey collection named `config` that can be used to store configuration information, such as API keys, for this and other similar integrations. The collection has two columns (beyond the default Kinvey columns): `configKey` and `configVal`. It is set to be private (i.e. All Users permissions are all set to Never) to prevent unauthorized outside access to these keys, but since the FlexFunctions connect via the Master Secret, we are still able to access them from within the code. The configKey column should have a value of `Azure Text Analytics`, with the corresponding configVal being your API key.

This was done to allow this and other similar functions that require configuration values to be flexible without requiring the need to put configuration information in plain text in the code.

If you prefer, the code can be modified to eliminate this collection dependency easily. Eliminate the `_getConfig()` method and within `detectLanguage` and `getSentiment` get rid of the call to `_getConfig()` on line 19 and 52 and the closing bracket/parenthesis on line 37 and 74. Next, change the requestOptions to include the `headers` with your hardcoded API key.

```javascript
headers: {
    'Ocp-Apim-Subscription-Key' : <MY_API_KEY>
};
```