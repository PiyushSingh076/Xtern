import React, { useState } from 'react';

function Payment() {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const userId = 'USER_ID'; // Replace with the actual user ID from your app
    const response = await fetch('https://us-central1-startup-a54cf.cloudfunctions.net/createPaymentOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: parseFloat(amount), currency: 'INR', userId }),
    });

    const data = await response.json();
    if (data.success) {
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Your Company',
        description: 'Add funds to your wallet',
        order_id: data.orderId,
        handler: async function (response) {
          const verifyResponse = await fetch('https://us-central1-startup-a54cf.cloudfunctions.net/verifyPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            alert('Payment successful and wallet updated!');
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } else {
      alert('Payment order creation failed');
    }
  };

  return (
    <div>
      <h2>Add Money to Wallet</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
}

export default Payment;
