# Kinvey FlexServices Examples

[FlexServices](https://devcenter.kinvey.com/html5/guides/flex-services) are microservices that can be used for data integrations or business logic within the [Kinvey mBaas](https://www.kinvey.com/). There are three types of FlexServices:

* **FlexData** for data integrations.
* **FlexAuth** for authentication integrations.
* **FlexFunctions** for business logic (along the lines of what is often called _serverless_). These can be used as custom endpoints, which can be called directly via REST or the Kinvey SDK, or can be added as business logic during the [collection hook pipeline](https://devcenter.kinvey.com/html5/reference/business-logic/reference.html#CollectionHookPipeline).

This repository contains a number of examples of FlexServices. The goal is to eventually offer a variety of examples of all the various types of FlexServices.

## Using the Example Services

To use each service, you'll have to add a new service within the service catalog on your Kinvey console. You'll also need the [Kinvey CLI](https://www.npmjs.com/package/kinvey-cli).

Navigate to the folder of the FlexService example that you'd like to use. Assuming you have already authenticated within the Kinvey CLI, you can run `kinvey flex init` to configure the service to connect it to the service that you created in the console (the CLI will walk you through the steps). Once this is complete, you can use `kinvey flex deploy` to deploy the service to the Kinvey Flex runtime (you could run them as External Flex as well - see the [FlexService Runtime guide](https://devcenter.kinvey.com/rest/guides/flexservice-runtime) for more details).

Each service is intended to be used differently as currently written. Some of the current examples are intended to be used as a [custom endpoint](https://devcenter.kinvey.com/rest/guides/business-logic#custom-endpoints), while others are intended to be used as [collection hooks](https://devcenter.kinvey.com/rest/guides/business-logic#collection-hooks). Please check the readme for each service as to its intended use.