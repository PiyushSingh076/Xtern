import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiArrowDownCircle } from "react-icons/fi";
import "./wallet.css"; // Import wallet.css for styling
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

// Handle Payment Function
const handlePayment = async (amount, userId) => {
  try {
    const response = await fetch('https://us-central1-startup-a54cf.cloudfunctions.net/createPaymentOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: parseFloat(amount), currency: 'INR', userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      const options = {
        key: '2W2tU9jVcJGNvQKXYdUr7pUQ',
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Your Company',
        description: 'Add funds to your wallet',
        order_id: data.orderId,
        handler: async function (response) {
          try {
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
          } catch (error) {
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
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

// Wallet Balance Component
const WalletBalance = ({ balance, setBalance, userId }) => {
  const [amount, setAmount] = useState(""); // State to manage the entered amount
  const [showInput, setShowInput] = useState(false); // State to toggle input visibility

  const handleAddBalance = () => {
    if (amount) {
      handlePayment(amount, userId); // Call handlePayment with the current amount and userId
      setAmount(""); // Clear the input field after adding
      setShowInput(false); // Hide the input field
    } else {
      alert("Please enter a valid amount");
    }
  };

  const handleWithdrawBalance = () => {
    const withdrawAmount = prompt("Enter amount to withdraw:");
    if (withdrawAmount && balance >= parseInt(withdrawAmount, 10)) {
      setBalance(balance - parseInt(withdrawAmount, 10));
    } else {
      alert("Insufficient balance or invalid amount");
    }
  };

  return (
    <div className="wallet-balance">
      <div className="wallet-balance-circle">
        <p>₹{balance.toLocaleString()}</p>
      </div>
      <h2>Wallet Balance</h2>

      {showInput && (
        <div className="wallet-balance-actions">
          <div className="input-container">
            <span className="rupee-symbol">₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount} // Bind input value to state
              onChange={(e) => setAmount(e.target.value)} // Update state on change
              className="add-money-input"
            />
          </div>
          <button className="add-money-btn" onClick={handleAddBalance}>
            Add
          </button>
        </div>
      )}

      <div className="buttons">
        <button
          className="add-btn"
          onClick={() => setShowInput(!showInput)} // Toggle input field visibility
        >
          <AiOutlinePlus size={18} style={{ marginRight: "8px" }} /> Add
        </button>
        <button className="withdraw-btn" onClick={handleWithdrawBalance}>
          <FiArrowDownCircle size={18} style={{ marginRight: "8px" }} /> Withdraw
        </button>
      </div>
    </div>
  );
};

// Bank Account Details Component
const BankAccountDetails = () => {
  return (
    <div className="bank-account-details">
      <h2>Bank Account Details</h2>
      <div className="bank-detail-input">
        <label>Account number</label>
        <input type="text" placeholder="Add account number" />
        <label>Bank name</label>
        <input type="text" placeholder="Add bank name" />
        <label>IFSC</label>
        <input type="text" placeholder="Add IFSC code" />
      </div>
    </div>
  );
};

// Transaction Table Component
const TransactionTable = ({ transactions, activeTab, setActiveTab }) => {
  const filteredTransactions = transactions.filter((transaction) => {
    if (activeTab === "Received") {
      return transaction.type !== "Withdraw";
    } else if (activeTab === "Withdraw") {
      return transaction.type === "Withdraw";
    } else {
      return true;
    }
  });

  return (
    <div className="transaction-table">
      <div className="tabs">
        <button
          className={activeTab === "Received" ? "active" : "inactive"}
          onClick={() => setActiveTab("Received")}
        >
          Received
        </button>
        <button
          className={activeTab === "Withdraw" ? "active" : "inactive"}
          onClick={() => setActiveTab("Withdraw")}
        >
          Withdraw
        </button>
        <button
          className={activeTab === "History" ? "active" : "inactive"}
          onClick={() => setActiveTab("History")}
        >
          History
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Service</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td>{transaction.service}</td>
              <td>₹{transaction.amount.toLocaleString()}</td>
              <td>{transaction.type}</td>
              <td>
                <button className="trans-edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Page Component
const WalletAndContactsPage = () => {
  const [balance, setBalance] = useState(3000);
  const [activeTab, setActiveTab] = useState("Received");
  const [transactions, setTransactions] = useState([
    { name: "Elizabeth Lopez", service: "elizabethlopez@example.com", amount: 1000, type: "Admin" },
    { name: "Matthew Martinez", service: "mmartinez1997@example.com", amount: 2000, type: "Owner" },
    { name: "Elizabeth Hall", service: "elizabeth_hall_1998@example.com", amount: 500, type: "Owner" },
    { name: "Maria White", service: "maria.white@example.com", amount: 800, type: "Admin" },
    { name: "Elizabeth Watson", service: "ewatson@example.com", amount: 1200, type: "Admin" },
    { name: "Elizabeth Allen", service: "eallen@example.com", amount: 900, type: "Owner" },
    { name: "Caleb Jones", service: "calebiones@example.com", amount: 750, type: "Member" },
  ]);

  const { userData } = useFetchUserData();
  console.log(userData);

  const userId = userData?.uid; // Add actual user ID here

  return (
    <div className="wallet-container">
      <div className="main-content">
        <div className="left-section">
          <WalletBalance balance={balance} setBalance={setBalance} userId={userId} />
          <BankAccountDetails />
        </div>
        <div className="right-section">
          <TransactionTable transactions={transactions} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
};

export default WalletAndContactsPage;