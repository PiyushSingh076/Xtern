import React, { useState } from "react";
import "./wallet.css"; // Import wallet.css for styling


// Wallet Balance Component
const WalletBalance = ({ balance, setBalance }) => {
  const handleAddBalance = () => {
    const amount = prompt("Enter amount to add:");
    if (amount) setBalance(balance + parseInt(amount, 10));
  };

  const handleWithdrawBalance = () => {
    const amount = prompt("Enter amount to withdraw:");
    if (amount && balance >= amount) setBalance(balance - parseInt(amount, 10));
    else alert("Insufficient balance");
  };

  return (
    <div className="wallet-balance">
      <div className="wallet-balance-circle">
        <p>₹{balance.toLocaleString()}</p>
      </div>
      <h2>Wallet Balance</h2>
      <div className="buttons">
        <button className="add-btn" onClick={handleAddBalance}>
          Add
        </button>
        <button className="withdraw-btn" onClick={handleWithdrawBalance}>
          Withdraw
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
      <label>Account number</label>
      <input type="text" placeholder="Add account number" />
      <label>Bank name</label>
      <input type="text" placeholder="Add bank name" />
      <label>IFSC</label>
      <input type="text" placeholder="Add IFSC code" />
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
                <button>Edit</button>
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
    {
      name: "Elizabeth Lopez",
      service: "elizabethlopez@example.com",
      amount: 1000,
      type: "Admin",
    },
    {
      name: "Matthew Martinez",
      service: "mmartinez1997@example.com",
      amount: 2000,
      type: "Owner",
    },
    {
      name: "Elizabeth Hall ",
      service: "elizabeth_hall_1998@example.com",
      amount: 500,
      type: "Owner",
    },
    {
      name: "Maria White",
      service: "maria.white@example.com",
      amount: 800,
      type: "Admin",
    },
    {
      name: "Elizabeth Watson",
      service: "ewatson@example.com",
      amount: 1200,
      type: "Admin",
    },
    {
      name: "Elizabeth Allen",
      service: "eallen@example.com",
      amount: 900,
      type: "Owner",
    },
    {
      name: "Caleb Jones",
      service: "calebiones@example.com",
      amount: 750,
      type: "Member",
    },
  ]);

  return (
    <div className="wallet-container">
   
      <div className="main-content">
        <div className="left-section">
          <WalletBalance balance={balance} />
          <BankAccountDetails />
        </div>
        <div className="right-section">
          <TransactionTable
            transactions={transactions}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </div>
  );
};

export default WalletAndContactsPage;
