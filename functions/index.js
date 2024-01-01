const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/*exports.sendPushNotification = functions.firestore.document('cities/{anyId}')
.onWrite(async (change, context) => {
    console.log("Cambios detectados en la base de datos");
  });
*/



const messaging = admin.messaging();
const db = admin.firestore();

// Token del dispositivo
const deviceToken = admin.messaging().getToken() ;

exports.sendPushNotificationOnWrite = functions.firestore.document('cities/{anyId}')
  .onWrite((change, context) => {
    // Obtiene el valor escrito en la base de datos
    const messageData = change.after.data();

    // Lógica para enviar el mensaje de notificación push
    const payload = {
      notification: {
        title: 'Se ha añadido o eliminado una ciudad',
        body: `La ciudad ${messageData.name} ha sido añadida o modificada.`, 
      },
    };

    // Enviar el mensaje al dispositivo con el token proporcionado
    return messaging.sendToDevice(deviceToken, payload)
      .then(response => {
        console.log('Notificación enviada con éxito:', response);
        return null;
      })
      .catch(error => {
        console.error('Ocurrió un error al enviar la notificación:', error);
      });
  });

exports.sendPushNotificationOnUpdate = functions.firestore.document('cities/{anyId}')
  .onUpdate((change, context) => {
    // Obtiene el valor actualizado en la base de datos
    const messageData = change.after.data();

    // Lógica para enviar el mensaje de notificación push
    const payload = {
      notification: {
        title: 'Se ha modificado una ciudad',
        body: `La ciudad ${messageData.name} ha sido actualizada.`, 
      },
    };

    // Enviar el mensaje al dispositivo con el token proporcionado
    return messaging.sendToDevice(deviceToken, payload)
      .then(response => {
        console.log('Notificación enviada con éxito:', response);
        return null;
      })
      .catch(error => {
        console.error('Ocurrió un error al enviar la notificación:', error);
      });
  });
