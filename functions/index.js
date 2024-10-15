const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();

const PAYSTACK_SECRET_KEY = 'sk_test_8246f76e8d309d189364e3b0f0fcee40ddebd688';

exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
    const paystackSignature = req.headers['x-paystack-signature'];

    // Verify Paystack signature
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== paystackSignature) {
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    const data = req.body.data;

    // Handle successful payment event
    if (event === 'charge.success') {
        const userId = data.metadata.user_id; // user_id from the payment metadata
        const amount = data.amount / 100; // Amount in naira (convert from kobo)

        try {
            // Update user's wallet balance in Firestore
            const userRef = admin.firestore().collection('users').doc(userId);
            await userRef.update({
                walletBalance: admin.firestore.FieldValue.increment(amount)
            });
            return res.status(200).send('Payment processed and balance updated');
        } catch (error) {
            console.error('Error updating user balance:', error);
            return res.status(500).send('Internal Server Error');
        }
    }

    return res.status(400).send('Event not handled');
});
