const express = require('express');
const admin = require('firebase-admin');
const crypto = require('crypto');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./paystack-backend/savii-8d155-firebase-adminsdk-15y4d-49f190c81b.json'); // You need to download the Firebase service account key from Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

const PAYSTACK_SECRET_KEY = 'sk_test_8246f76e8d309d189364e3b0f0fcee40ddebd688';

app.post('/paystack-webhook', (req, res) => {
  const paystackSignature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== paystackSignature) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body.event;
  const data = req.body.data;

  if (event === 'charge.success') {
    const userId = data.metadata.user_id; // Retrieve user ID from metadata
    const amount = data.amount / 100; // Convert from kobo to naira

    // Update the user's balance in Firebase Firestore
    const userRef = admin.firestore().collection('users').doc(userId);
    userRef.update({
      walletBalance: admin.firestore.FieldValue.increment(amount),
    })
    .then(() => {
      res.status(200).send('Balance updated successfully');
    })
    .catch((error) => {
      console.error('Error updating balance:', error);
      res.status(500).send('Internal server error');
    });
  } else {
    res.status(400).send('Event not handled');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
