const   sdk = require('kinvey-flex-sdk');

sdk.service((err, flex) => {
    const   flexFunctions = flex.functions;

    // pre save, we determine if an email confirmation needs to be sent
    function emailConfirmationRequiredPreSave(context, complete, modules) {
        var tempObjectStore = modules.tempObjectStore,
            options = {
                useUserContext: false
            },
            store = modules.dataStore(options),
            config = modules.dataStore().collection("subscriptions");

        // default to not sending the email
        tempObjectStore.set("emailType","none");
        console.log(context.entityId);
        // does the record have an ID, if not then assume it is new and send an email
        if ((context.entityId===undefined) && (context.body.subscribed==="true")) {
            tempObjectStore.set("emailType","new");
            complete().ok().next();
        }
        // if the ID is defined, check to see if the subscription value changed
        else if (context.entityId!=undefined) {
            config.findById(context.entityId, (err, result) => {
                if (err) {
                    complete().setBody(err);
                }
                // if no record found consider it new
                if (!result) {
                    tempObjectStore.set("emailType","new");
                    complete().ok().next();
                }
                // if they were not subscribed but are subscribing
                else if ((result.subscribed === false) && (context.body.subscribed === "true")) {
                    tempObjectStore.set("emailType","existing");
                    complete().ok().next();
                }
                // if they were subscribed but are unsubscribing
                else if ((result.subscribed === true) && (context.body.subscribed === "false")) {
                    tempObjectStore.set("emailType","unsubscribed");
                    complete().ok().next();
                }
                // else nothing changed and move on
                else {
                    complete().ok().next();
                }
            });
        }
        // else just move on
        else {
            complete().ok().next();
        }
    }

    // but we don't send the confirmation until the save succeeds
    function sendEmailConfirmationPostSave(context, complete, modules) {
        const email = modules.email;
        var mailOptions = {
            from: "brian.rinaldi@progress.com",
            to: "",
            subject: "",
            text_body: "",
            reply_to: null,
            html_body: "",
            cc: null,
            bcc: null
        },
        tempObjectStore = modules.tempObjectStore,
        emailType = tempObjectStore.get("emailType");

        mailOptions.to = context.body.email;

        // new subscription
        if (emailType === "new") {
            mailOptions.subject = "Welcome to our site!";
            mailOptions.text_body = "We're excited that you joined!";
            mailOptions.html_body = "<html>We're <strong>excited</strong> that you joined!</html>";
        }
        // existing member
        else if (emailType === "existing") {
            mailOptions.subject = "Thanks for subscribing!";
            mailOptions.text_body = "We'll send you some exciting info!";
            mailOptions.html_body = "<html>We'll send you some  <strong>exciting</strong> info!</html>";
        }
        else if (emailType === "unsubscribed") {
            mailOptions.subject = "You've been unsubscribed";
            mailOptions.text_body = "We're sad to see you go!";
            mailOptions.html_body = "<html>We're <strong>sad</strong> to see you go!</html>";
        }

        if (emailType) {
            email.send(mailOptions.from,
                mailOptions.to,
                mailOptions.subject,
                mailOptions.text_body,
                mailOptions.reply_to,
                mailOptions.html_body,
                mailOptions.cc,
                mailOptions.bcc,
                (err, result) => {
                    if (err) {
                        complete().setBody(err);
                    }
                    complete().ok().next();
                });
        }
        complete().ok().next();
    }

    flexFunctions.register('sendEmailConfirmationPreSave', emailConfirmationRequiredPreSave);
    flexFunctions.register('sendEmailConfirmationPostSave', sendEmailConfirmationPostSave);
});