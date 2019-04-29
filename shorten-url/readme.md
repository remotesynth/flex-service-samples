# shorten-url FlexService

shorten-url is a FlexService intended to be used as a FlexFunction that is hooked to a custom endpoint within Kinvey. It relies on the [Rebrandly URL Shortener API](https://developers.rebrandly.com/docs/api-custom-url-shortener) to create short URLs. This API requires an [API Key](https://app.rebrandly.com/account/api-keys).

As written, the FlexFunction depends on a private Kinvey collection named `config` that can be used to store configuration information, such as API keys, for this and other similar integrations. The collection has two columns (beyond the default Kinvey columns): `configKey` and `configVal`. It is set to be private (i.e. All Users permissions are all set to Never) to prevent unauthorized outside access to these keys, but since the FlexFunctions connect via the Master Secret, we are still able to access them from within the code. The configKey column should have a value of `Rebrandly URL Shortener`, with the corresponding configVal being your API key.

This was done to allow this and other similar functions that require configuration values to be flexible without requiring the need to put configuration information in plain text in the code.

If you prefer, the code can be modified to eliminate this collection dependency easily. Eliminate the `_getConfig()` method and within `shortenUrl` get rid of the call to `_getConfig()` on line 17 and the closing bracket/parenthesis on line 27. Next, change the URI to include your hardcoded API key.

```javascript
requestOptions.headers = {
  'apikey': <MY_API_KEY>
};
```