# moderate-text FlexService

moderate-text is a FlexService intended to be used as a FlexFunction. It has several functions, some of which are designed to be used as custom endpoints (i.e. `moderateText` and `checkForProfanity`) while the other (`cleanCommentOnPreSave`) is intended to be used as a collection hook that runs `onPreSave` (i.e. prior to a create or update).

The `moderateText` method only assumes that you are sending a `message` property in the POST body, which is cleaned of anything that appears to be profanity and then returned.

The `cleanCommentOnPreSave` method only assumes that whatever you are inserting has a `message` property, which is cleaned of anything that appears to be profanity and then inserted or updated. The function could be easily modified to alter a different property of an entity by changing the name of the property on lines 23, 24 and 27.