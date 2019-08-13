# ACS - Adobe I/O Firebase Cloud Messaging Web Push Notification

This code allows you to send web push notifications using an Adobe I/O Runtime service. Specific usage scenario is for Adobe Campaign Standard, where you can connect to this service using the External API activity.

## Prerequisites

### Firebase

You have set up a Firebase project and within that project a web based application. From that web application you must have generated a private key, which results in a json file. Ensure you name the file `web-push-from-acs-firebase.json`. See [here](https://firebase.google.com/docs/admin/setup?authuser=0#initialize_the_sdk) for more information.
You also must have setup web push notification registration within your web site/pages (see [Wiki](https://wiki.corp.adobe.com/display/neolane/ACS+-+Web+Push#ACS-WebPush-RuntimeAction) for more details).

### Adobe Campaign Standard

In Adobe Campaign Standard you must have deployed an additional resource to keep track of the web push notifications. See [Wiki](https://wiki.corp.adobe.com/display/neolane/ACS+-+Web+Push#ACS-WebPush-RuntimeAction) for more details.

### Adobe I/O Runtime

You need to ...

- have access to Adobe I/O Runtime namespace,
- have installed the OpenWhisk binaries for your platform and
- have configured your environment properly, using the `.wskprops` in your `$HOME` directory,

... so you can properly execute commands like ```wsk action list```.

### Node and Serverless

You must have Node JS installed.
Also you need to install Serverless for easy deployment.
If you don't have Serverless installed, install it using ```npm install -g serverless```.

## Installation

1. Download or clone this repository.
2. Ensure you have created and named your authentication file as instructed in the Firebase prerequisites.
3. Install the service using ```npm install```.

## Deploy

1. Use the `serverless` command to deploy your service: `serverless deploy`.

2. Once deployed successfully, check whether the service is available as an action using `wsk action list`.
The output should be something like:
```
RIdM-MacBookPro:acsfcmwebpush rmaur$ wsk action list
actions
/rmaur/acsutils/sendWebPushNotification               private nodejs:10 

```

3. Turn the action into a REST based API using:
`
wsk api create -n "ACSUtils" /acsutils /sendWebPushNotification post acsutils/sendWebPushNotification --response-type json
`

Your API will be: `https://runtime.adobe.io/apis/your_namespace/acsutils/sendWebPushNotification` which you can invoke using POST and a payload, and which will return JSON.

Both the payload, and the response should conform to a specific JSON format (for ACS purposes). See the [External API documentation](https://docs.adobe.com/content/help/en/campaign-standard/using/managing-processes-and-data/data-management-activities/external-api.html) for more details.

You can test the API using this [Postman collection](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/Firebase%20push%20notifications.postman_collection.json). Ensure you modify it according to your setup.

## Usage

1. Build a workflow in ACS that select web push notification subscribers, sends them a web push notification and updates the notification status. E.g.:
![Workflow](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushflow.png)
   - Ensure you use **Additional Data** to add the device token to the data coming from your query activity.
   - You can [download](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/webpushnotificationworkflow.zip) a package to import a template for the workflow.

2. Configure the **External API** activity as follows:
(**Note**: change the example values in line with your Firebase configuration and Adobe I/O Runtime service API)

   1. **Inbound Mapping**
![inbound mapping](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushinboundmapping.png)
   2. **Outbound Mapping**
![outbound mapping](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushoutboundmapping.png)
   3. **Execution**
![execution](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushexecution.png)
   4. **Column Definition**
![column definition](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushcolumndefinition.png)

3. Run the workflow to send push notifications to registered browsers.
![result](https://robindermauracs.s3.eu-west-1.amazonaws.com/webpush/screenshots/acswebpushresult.png)
