import Razorpay from "razorpay";
import toast from "react-hot-toast";
import { getFunctions, httpsCallable } from "firebase/functions";
import axios from "axios";
import useWallet from "./useWallet";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useEffect } from "react";

export function useTransactions() {
  const functions = getFunctions();
  const { createTransaction } = useWallet();


  async function createPaymentOrder(userId, amount, currency) {
    try {
      const createOrder = httpsCallable(functions, "createPaymentOrder");
      // const result = await createOrder({ userId, amount, currency });
      const result = await axios.post(
        "https://us-central1-startup-a54cf.cloudfunctions.net/createPaymentOrder",
        {
          amount: amount,
          userId: userId,
          currency: currency,
        }
      );

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

  async function verifyPayment(orderId, paymentId, signature, amount) {
    try {
      // const verifyOrder = httpsCallable(functions, "verifyPayment");
      // const result = await verifyOrder({
      //   order_id: orderId,
      //   payment_id: paymentId,
      //   signature: signature,
      // });

      const result = await axios.post(
        "https://us-central1-startup-a54cf.cloudfunctions.net/verifyPayment",
        {
          order_id: orderId,
          payment_id: paymentId,
          signature: signature,
          amount: amount,
        }
      );

      if (result.data.success) {
        console.log("Payment verified successfully:", result.data.message);
        toast.success("Payment verified successfully!");
        return true;
      } else {
        console.error("Failed to verify payment:", result.data.message);
        return false;
      }
    } catch (error) {
      toast.error("Error verifying payment.");
      console.error("Error verifying payment:", error);
      return false;
    }
  }

  async function initiatePayment(userId, amount, handler, loader) {
    const orderId = await createPaymentOrder(userId, amount, "INR");

    console.log("Order iD:", orderId);

    if (!orderId) {
      console.error("Failed to create Razorpay order");
      // toast.error("An error occurred. Please try again.");
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
      amount: amount * 100,
      currency: "INR",
      name: "Optacloud",
      description: "Add funds to wallet",
      order_id: orderId,
      handler: async function (response) {
        loader.start()
        console.log("Payment Successful:", response);
        const success = await verifyPayment(
          orderId,
          response.razorpay_payment_id,
          response.razorpay_signature,
          amount
        );
        if (success) {
          await createTransaction(
            userId,
            amount,
            "CREDIT",
            "Add Funds to Account"
          );
        }
        else{
          toast.error("An error occurred during payment.");
        }
        // await updateDoc(doc(db, "wallet", userId), {
        //   amount: increment(amount),
        // });

        await handler();
        loader.stop()
      },
      prefill: {},
      theme: {
        color: "#3399cc",
      },
    };

    console.log("Razorpay order options: ", options);

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error("Payment Failed:", response);
      toast.error(`Payment Failed.`);
    });
    rzp.open();
  }

  return { initiatePayment };
}
