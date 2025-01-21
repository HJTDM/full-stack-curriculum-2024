// Importing Firebase Admin SDK to interact with Firebase services
const admin = require("firebase-admin");
require("dotenv").config();

const creds = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Initializing Firebase Admin SDK with credentials and database URL
admin.initializeApp({
  credential: admin.credential.cert(creds),
});

const db = admin.firestore();

module.exports = db;
