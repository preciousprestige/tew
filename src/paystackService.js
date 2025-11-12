// frontend/src/services/paystackService.js
import axios from "axios";
import PaystackPop from "@paystack/inline-js";

const API_URL = "/api/orders";

// ✅ Initialize Paystack payment (get URL + reference from backend)
export const initPaystackPayment = async (orderId, token) => {
  const { data } = await axios.post(
    `${API_URL}/${orderId}/paystack/init`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; // { authorizationUrl, reference }
};

// ✅ Verify Paystack payment after redirect/callback
export const verifyPaystackPayment = async (reference, token) => {
  const { data } = await axios.get(
    `${API_URL}/paystack/verify/${reference}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; // updated order
};

// ✅ Utility: Open Paystack inline popup
export const payWithPaystack = (order, user, onSuccess, onCancel) => {
  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: order.totalPrice * 100,
    reference: order.paymentResult.id, // backend-generated
    onSuccess: async (transaction) => {
      console.log("Payment success:", transaction);
      if (onSuccess) onSuccess(transaction);
    },
    onCancel: () => {
      console.log("Payment canceled");
      if (onCancel) onCancel();
    },
  });
};
