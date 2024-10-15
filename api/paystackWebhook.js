import { json } from 'micro';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';  // Update with correct path

export default async (req, res) => {
  if (req.method === 'POST') {
    const payload = await json(req);

    const secret = process.env.PAYSTACK_SECRET_KEY;
    const receivedSecret = req.headers['x-paystack-signature'];

    // Verify the webhook using Paystack's secret key
    if (receivedSecret !== secret) {
      return res.status(401).send('Invalid signature');
    }

    const event = payload.event;

    if (event === 'charge.success') {
      const { email, amount } = payload.data.customer;
      const userId = payload.data.metadata.userId;

      // Fetch user from Firebase and update balance
      const userRef = doc(FIREBASE_DB, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentBalance = userData.wallet || 0;
        const newBalance = currentBalance + amount / 100;  // Convert kobo to naira

        await updateDoc(userRef, { wallet: newBalance });
      }

      return res.status(200).send('Wallet updated');
    }
  }

  return res.status(400).send('Invalid event');
};
