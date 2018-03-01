const   sdk = require('kinvey-flex-sdk'),
        Filter = require('bad-words');

sdk.service((err, flex) => {
    const   flexFunctions = flex.functions;

    function checkForProfanity(context, complete, modules) {
        if (!context.body.hasOwnProperty('message')) {
            return complete().setBody("A 'message' property must be included").badRequest().done();
        }
        return complete().setBody({'containsProfanity' : _checkForProfanity(context.body.message) }).ok().next();
    }

    function moderateText(context, complete, modules) {
        if (!context.body.hasOwnProperty('message')) {
            return complete().setBody("A 'message' property must be included").badRequest().done();
        }

        return complete().setBody({'message' : _moderateText(context.body.message) }).ok().next();
    }

    function cleanCommentOnInsert(context, complete, modules) {
        if (!context.body.hasOwnProperty('message')) {
            return complete().setBody("A 'message' property must be included").badRequest().done();
        }

        context.body.message = _moderateText(context.body.message);

        complete().setBody(context.body).created().ok().next();
    }

    function _checkForProfanity(text) {
        const filter = new Filter();
        return filter.isProfaneLike(context.query.text);
    }

    function _moderateText(text) {
        const filter = new Filter();
        return filter.clean(text);
    }

    flexFunctions.register('checkForProfanity', checkForProfanity);
    flexFunctions.register('moderateText', moderateText);
    flexFunctions.register('cleanCommentOnInsert', cleanCommentOnInsert);
});