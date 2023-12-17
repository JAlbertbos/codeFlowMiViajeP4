// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onValueCreated} = require("firebase-functions/v2/database");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const {getFirestore} = require("firebase-admin/firestore");

const admin = require("firebase-admin");
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
      .collection("messages")
      .add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({uppercase}, {merge: true});
});


// All Realtime Database instances in default function region us-central1 at path "/user/{uid}"
// There must be at least one Realtime Database present in us-central1.
const onWrittenFunctionDefault = onValueWritten("/user/{uid}", (event) => {
  // …
});

// Instance named "my-app-db-2", at path "/user/{uid}".
// The "my-app-db-2" instance must exist in this region.
const OnWrittenFunctionInstance = onValueWritten(
  {
    ref: "/user/{uid}",
    instance: "my-app-db-2"
    // This example assumes us-central1, but to set location:
    // region: "europe-west1"
  },
  (event) => {
    // …
  }
);

// Instance with "my-app-db-" prefix, at path "/user/{uid}", where uid ends with @gmail.com.
// There must be at least one Realtime Database with "my-app-db-*" prefix in this region.
const onWrittenFunctionInstance = onValueWritten(
  {
    ref: "/user/{uid=*@gmail.com}",
    instance: "my-app-db-*"
    // This example assumes us-central1, but to set location:
    // region: "europe-west1"
  },
  (event) => {
    // …
  }
);