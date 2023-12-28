const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotification = functions.firestore.document('cities/{anyId}')
.onWrite(async (change, context) => {
    console.log("Cambios detectados en la base de datos");
  });
