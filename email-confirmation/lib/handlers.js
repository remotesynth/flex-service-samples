// pre save, we determine if an email confirmation needs to be sent
function emailConfirmationRequiredPreSave(context, complete, modules) {
  const tempObjectStore = modules.tempObjectStore;
  const options = {
    useUserContext: false
  };
  const store = modules.dataStore(options);
  const config = store.collection('subscriptions');

  // default to not sending the email
  tempObjectStore.set('emailType', 'none');
  // does the record have an ID, if not then assume it is new and send an email
  if (context.entityId === undefined && context.body.subscribed === 'true') {
    tempObjectStore.set('emailType', 'new');
    complete()
      .ok()
      .next();
  } else if (context.entityId !== undefined) {
    // if the ID is defined, check to see if the subscription value changed
    config.findById(context.entityId, (err, result) => {
      if (err) {
        complete().setBody(err);
      }
      // if no record found consider it new
      if (!result) {
        tempObjectStore.set('emailType', 'new');
        complete()
          .ok()
          .next();
      } else if (result.subscribed === 'false' && context.body.subscribed === 'true') {
        // if they were not subscribed but are subscribing
        tempObjectStore.set('emailType', 'existing');
        complete()
          .ok()
          .next();
      } else if (result.subscribed === 'true' && context.body.subscribed === 'false') {
        // if they were subscribed but are unsubscribing
        tempObjectStore.set('emailType', 'unsubscribed');
        complete()
          .ok()
          .next();
      } else {
        // else nothing changed and move on
        complete()
          .ok()
          .next();
      }
    });
  } else {
    // else just move on
    complete()
      .ok()
      .next();
  }
}

// but we don't send the confirmation until the save succeeds
function sendEmailConfirmationPostSave(context, complete, modules) {
  const email = modules.email;
  const tempObjectStore = modules.tempObjectStore;
  const emailType = tempObjectStore.get('emailType');
  const mailOptions = {
    from: 'brian.rinaldi@progress.com',
    to: '',
    subject: '',
    text_body: '',
    reply_to: null,
    html_body: '',
    cc: null,
    bcc: null
  };

  mailOptions.to = context.body.email;

  // new subscription
  if (emailType === 'new') {
    mailOptions.subject = 'Welcome to our site!';
    mailOptions.text_body = 'We\'re excited that you joined!';
    mailOptions.html_body = '<html>We\'re <strong>excited</strong> that you joined!</html>';
  } else if (emailType === 'existing') {
    // existing member
    mailOptions.subject = 'Thanks for subscribing!';
    mailOptions.text_body = 'We\'ll send you some exciting info!';
    mailOptions.html_body = '<html>We\'ll send you some  <strong>exciting</strong> info!</html>';
  } else if (emailType === 'unsubscribed') {
    mailOptions.subject = 'You\'ve been unsubscribed';
    mailOptions.text_body = 'We\'re sad to see you go!';
    mailOptions.html_body = '<html>We\'re <strong>sad</strong> to see you go!</html>';
  }

  if (emailType !== 'none') {
    email.send(
      mailOptions.from,
      mailOptions.to,
      mailOptions.subject,
      mailOptions.text_body,
      mailOptions.reply_to,
      mailOptions.html_body,
      mailOptions.cc,
      mailOptions.bcc,
      (err) => {
        if (err) {
          return complete().setBody(err);
        }
        complete()
          .setBody(context.body)
          .ok()
          .next();
      }
    );
  }
  complete()
    .setBody(context.body)
    .ok()
    .next();
}

exports.emailConfirmationRequiredPreSave = emailConfirmationRequiredPreSave;
exports.sendEmailConfirmationPostSave = sendEmailConfirmationPostSave;
