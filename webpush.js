var admin = require('firebase-admin');
var serviceAccount = require('./web-push-from-acs-firebase.json');

// configuration
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://web-push-from-acs.firebaseio.com"
});


function sendWebPushNotification(payload) {
    var count = payload.params.count;
    var title = payload.params.title;
    var body = payload.params.body;
    var icon = payload.params.icon;
    console.log("count: " + count);
    console.log("title: " + title);
    console.log("body: " + body);

    var tokens = [];
    for (var i=0; i < count; i++) {
        console.log("Token: " + payload.data[i].deviceToken);
        tokens.push(payload.data[i].deviceToken);
    }
    var message = {
        tokens: tokens,

        notification: {
            title: title,
            body: body
        }
    };

    var acsResponse = {
        data: []
    };

    var messageString = JSON.stringify(message);
    console.log("The web push notification message we're about to send:\n" + messageString);

    return new Promise (function (resolve, reject) {
        admin.messaging().sendMulticast(message)
            .then((response) => {
                console.log("Response we got from FCM: " + JSON.stringify(response));
                var count = response.responses.length;
                for (var i=0; i<count; i++) {
                    var sendResponse = {
                        success: response.responses[i].success,
                        messageId: response.responses[i].messageId,
                        deviceToken: tokens[i]
                    };
                    // build up specific ACS response
                    acsResponse['data'].push(sendResponse);
                }
                resolve(acsResponse);
            })

    });
}

exports.sendWebPushNotification = sendWebPushNotification;