import Razorpay from "razorpay";
import toast from "react-hot-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import axios from "axios";

export function useTransactions() {
  const functions = getFunctions();

  async function createPaymentOrder(userId, amount, currency) {
    try {
      const createOrder = httpsCallable(functions, "createPaymentOrder");
      // const result = await createOrder({ userId, amount, currency });
      const result = await axios.post("https://us-central1-startup-a54cf.cloudfunctions.net/createPaymentOrder", {
        amount: amount,
        userId:  userId,
        currency: currency
      })

      if (result.data.success) {
        console.log("Order created successfully:", result.data.orderId);
        return result.data.orderId;
      } else {
        toast.error("Failed to create payment order. Please try again.");
        console.error("Failed to create payment order:", result.data.message);
      }
    } catch (error) {
      toast.error("Failed to create payment order. Please try again.");
      console.error("Error creating payment order:", error);
    }
  }

  async function verifyPayment(orderId, paymentId, signature) {
    try {
      const verifyOrder = httpsCallable(functions, "verifyPayment");
      const result = await verifyOrder({
        order_id: orderId,
        payment_id: paymentId,
        signature: signature,
      });

      if (result.data.success) {
        console.log("Payment verified successfully:", result.data.message);
        toast.success("Payment verified successfully!");
      } else {
        console.error("Failed to verify payment:", result.data.message);
      }
    } catch (error) {
      toast.error("Error verifying payment.");
      console.error("Error verifying payment:", error);
    }
  }

  async function initiatePayment(userId, amount) {
    const orderId = await createPaymentOrder(userId, amount, "INR");

    console.log("Order iD:", orderId);

    if (!orderId) {
      console.error("Failed to create Razorpay order");
      // toast.error("An error occurred. Please try again.");
      return;
    }

    const options = {
      key_id: "rzp_test_w4aQ5dhNg17Owa",
      key_secret: "2W2tU9jVcJGNvQKXYdUr7pUQ",
      amount: amount * 100,
      currency: "INR",
      name: "Optacloud",
      description: "Add funds to wallet",
      order_id: orderId,
      handler: async function (response) {
        console.log("Payment Successful:", response);
        await verifyPayment(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );
      },
      prefill: {},
      theme: {
        color: "#3399cc",
      },
    };

    console.log("Razorpay options: ", options)

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return { initiatePayment };
}
