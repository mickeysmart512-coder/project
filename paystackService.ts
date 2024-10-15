// paystackService.ts

import axios from 'axios';

const PAYSTACK_SECRET_KEY = 'sk_test_8246f76e8d309d189364e3b0f0fcee40ddebd688';

export const createPaystackSubAccount = async (userDetails: any) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/subaccount', 
      {
        business_name: userDetails.name,  // User's name
        bank_code: "058",                 // Example bank code for GTBank
        account_number: userDetails.accountNumber,  // Replace with valid account number
        percentage_charge: 0.2            // Example percentage Paystack takes
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        }
      }
    );
    
    return response.data.data;  // Subaccount details from Paystack
  } catch (error) {
    console.error("Error creating subaccount:", error);
    throw error;
  }
};
