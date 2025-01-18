import React, { useState } from 'react';
import useWallet from '../hooks/Wallet/useWallet';

const WalletPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const {loaded, wallet} = useWallet();
  // const [balance] = useState(1250.0);

  const handleQuickAmount = (value) => {
    setAmount(value);
  };

  const handleAddFunds = () => {
    // Handle payment processing here
    console.log('Processing payment for:', amount);
    setIsModalOpen(false);
    setAmount('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border border-gray-300 bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Wallet</h1>

        <div className="bg-gray-50 rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-4xl font-bold text-gray-900">
                ₹{wallet.amount || 0}
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Funds
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add Funds to Wallet</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="grid grid-cols-3 gap-2">
                  {[50, 150, 500].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleQuickAmount(value.toString())}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      +₹{value}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAddFunds}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
