const Filter = require('bad-words');

function _checkForProfanity(text) {
  const filter = new Filter();
  return filter.isProfaneLike(text);
}

function _moderateText(text) {
  const filter = new Filter();
  return filter.clean(text);
}

function checkForProfanity(context, complete) {
  if (!Object.prototype.hasOwnProperty.call(context.body, 'message')) {
    return complete()
      .setBody('A \'message\' property must be included.')
      .badRequest()
      .done();
  }
  return complete()
    .setBody({ containsProfanity: _checkForProfanity(context.body.message) })
    .ok()
    .next();
}

function moderateText(context, complete) {
  if (!Object.prototype.hasOwnProperty.call(context.body, 'message')) {
    return complete()
      .setBody('A \'message\' property must be included.')
      .badRequest()
      .done();
  }

  return complete()
    .setBody({ message: _moderateText(context.body.message) })
    .ok()
    .next();
}

function cleanCommentOnPreSave(context, complete) {
  const result = context.body;
  if (!Object.prototype.hasOwnProperty.call(context.body, 'message')) {
    return complete()
      .setBody('A \'message\' property must be included.')
      .badRequest()
      .done();
  }

  result.message = _moderateText(result.message);

  return complete()
    .setBody(result)
    .created()
    .ok()
    .next();
}

exports.checkForProfanity = checkForProfanity;
exports.moderateText = moderateText;
exports.cleanCommentOnPreSave = cleanCommentOnPreSave;
