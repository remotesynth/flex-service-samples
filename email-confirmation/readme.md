# email-confirmation FlexService

email-confirmation is a FlexService intended to be used as a FlexFunction for an `onPreSave` and `onPostSave` collection hook. The function will determine if a subscription confirmation should be sent (and what type) or an unsubscribe confirmation should be sent (or if no email should be sent).

The `onPreSave` method is `emailConfirmationRequiredPreSave`. This method determines if the user is new and subscribed, existing and changed their subscription status to subscribe or existing and changed their subscription status to unsubscribed. However, this is stored in the temporary object store so that no email is sent prior to the create/update successfully occuring.

The `onPostSave` method is `sendEmailConfirmationPostSave`. This method checks the temporary object store to determine what type of email needs to be sent (if any) and sends the email before proceeding.

Neither method alters the data being passed in or out of the collection.

As currently written, these methods assume a collection named `subscriptions` that has at least two columns: `email` and `subscribed`. The collection can have additional columns. The column names can also be adjusted to match a collection with different column names with only small code changes.

Obviously, it is assumed that you will customize the email sender, subject and contents (or add cc and bcc as needed) as well.