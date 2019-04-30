function exampleFunction(context, complete, modules) {
  const result = "";
  if (!Object.prototype.hasOwnProperty.call(context.body, 'requiredParameterName')) {
    return complete()
      .setBody('A \'requiredParameterName\' property must be included.')
      .badRequest()
      .done();
  }

  result.message = "Everything worked.";

  return complete()
    .setBody(result)
    .created()
    .ok()
    .next();
}

exports.exampleOnPreSave = exampleFunction;
