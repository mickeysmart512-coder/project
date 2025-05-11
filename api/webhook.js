// const admin = require('firebase-admin');
// const express = require('express');
// const app = express();

// // Use Express's built-in JSON parser
// app.use(express.json());

// // Environment variables
// require('dotenv').config();

// function getFirebasePrivateKey() {
//   if (!process.env.FIREBASE_PRIVATE_KEY) {
//     console.error("FIREBASE_PRIVATE_KEY is not defined.");
//     return null;
//   }
//   return process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
// }

// // Firebase setup
// if (!admin.apps.length) {
//   try {
//     admin.initializeApp({
//       credential: admin.credential.cert({
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//         privateKey: getFirebasePrivateKey(),
//       }),
//     });
//     console.log('Firestore initialized successfully.');
//   } catch (error) {
//     console.error('Error initializing Firestore:', error);
//   }
// }

// const db = admin.firestore();

// app.post('/api/webhook', async (req, res) => {
//   try {
//     console.log('Webhook triggered.');
//     const { userId, transactionAmount, transactionType } = req.body;

//     console.log('Received body:', req.body);
//     console.log(`Processing transaction for user ID: ${userId}`);
//     console.log(`Transaction type: ${transactionType}, Amount: ${transactionAmount}`);

//     // Firestore reference to the user's document
//     const userRef = db.collection('users').doc(userId);
//     const userDoc = await userRef.get();

//     if (!userDoc.exists) {
//       throw new Error('User not found');
//     }

//     // Update user's balance based on transaction type
//     const userData = userDoc.data();
//     let updatedBalance = userData.balance || 0;

//     if (transactionType === 'deposit') {
//       updatedBalance += transactionAmount;
//     } else if (transactionType === 'withdraw') {
//       updatedBalance -= transactionAmount;
//     } else {
//       throw new Error('Invalid transaction type');
//     }

//     await userRef.update({ balance: updatedBalance });
//     console.log(`User balance updated successfully. New balance: ${updatedBalance}`);

//     res.status(200).send('Webhook processed successfully.');
//   } catch (error) {
//     console.error('Error handling webhook:', error);
//     res.status(500).send('Error processing webhook.');
//   }
// });

// module.exports = app;










// api/webhook.js

module.exports = (req, res) => {
  res.status(200).json({ message: 'Webhook is working!' });
};
