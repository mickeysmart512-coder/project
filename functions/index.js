const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create an Express app
const app = express();

// Use bodyParser to parse incoming JSON requests
app.use(bodyParser.json());

// Webhook endpoint for Monnify
app.post('/monnify-webhook', async (req, res) => {
  try {
    const data = req.body; // The payload from Monnify

    // Log data for debugging purposes
    console.log('Webhook Data Received:', data);

    // Extract necessary fields (e.g., transaction details)
    const transactionStatus = data.event; // e.g., "SUCCESSFUL_PAYMENT"
    const paymentDetails = data.paymentDetails;

    // Check if the event is a successful payment
    if (transactionStatus === 'SUCCESSFUL_PAYMENT') {
      const transactionId = paymentDetails.transactionReference;
      const amountPaid = paymentDetails.amountPaid;
      const userId = paymentDetails.customer.email;

      // Save transaction details in Firestore
      await admin.firestore().collection('transactions').doc(transactionId).set({
        userId,
        amountPaid,
        status: transactionStatus,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Respond to Monnify
    res.status(200).send('Webhook received successfully');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).send('Server Error');
  }
});

// Expose the Express app as a Firebase function
exports.api = functions.https.onRequest(app);
