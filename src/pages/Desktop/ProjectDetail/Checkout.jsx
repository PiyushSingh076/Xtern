import React from "react";
import "./checkout.css";

const CheckoutPage = () => {
  // Hardcoded values for now
  const servicePrice = 500; // Example service price
  const walletBalance = 1000; // Current wallet balance
  const platformPrice = servicePrice - walletBalance; // Platform price after wallet deduction
  const gst = (platformPrice * 0.18).toFixed(2); // 18% GST
  const totalPrice = (platformPrice + parseFloat(gst)).toFixed(2); // Total price after adding GST

  return (
    <div className="page-container">
      <div className="checkout-container">
        <h2>Checkout</h2>

        <div className="price-details">
          <div className="price-row">
            <span>Service Price</span>
            <span>₹{servicePrice}</span>
          </div>

          <div className="price-row">
            <span>Current Wallet Balance</span>
            <span>₹{walletBalance}</span>
          </div>

          <div className="price-row">
            <span>Platform Price (after Wallet Deduction)</span>
            <span>₹{platformPrice}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>

          <div className="price-row">
            <span>
              <strong>Total Price</strong>
            </span>
            <span>
              <strong>₹{totalPrice}</strong>
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="checkout-button">Proceed to Payment</button>
      </div>
    </div>
  );
};

export default CheckoutPage;
