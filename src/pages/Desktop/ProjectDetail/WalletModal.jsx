import React, { useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../../../hooks/Wallet/useWallet";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import useFetchUserData from "../../../hooks/Auth/useFetchUserData";

const WalletModal = ({ serviceName, servicePrice, onClose, service }) => {
  const { wallet, loaded, buyService } = useWallet();
  const navigate = useNavigate();
  const { userData } = useFetchUserData();
  const [loading, setLoading] = useState(false);

  const platformFee = Number(servicePrice) * 0.2;
  const totalCost = Number(servicePrice) + platformFee;

  const hasSufficientBalance = wallet?.amount >= totalCost;

  const handleProceedPayment = async () => {
    setLoading(true);
    if (hasSufficientBalance) {
      await buyService(userData.uid, totalCost, serviceName, service);
      toast.success("Payment successful!");
      onClose();
      // Add your payment processing logic here
    } else {
      toast.error("Insufficient balance. Redirecting to wallet...");
      navigate("/wallet-screen");
    }
  };

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="spinner-border-sm spinner-border"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{serviceName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Service Price:</span>
            <span className="font-semibold">
              ₹{Number(servicePrice).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Platform Fee (20%):</span>
            <span className="font-semibold">₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Cost:</span>
            <span>₹{totalCost.toFixed(2)}</span>
          </div>
          <div
            className={`flex justify-between items-center p-3 rounded-lg ${
              hasSufficientBalance
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span>Wallet Balance:</span>
            <span className="font-bold">₹{wallet.amount.toFixed(2)}</span>
          </div>
          {!hasSufficientBalance && (
            <p className="text-red-600 text-sm">
              Insufficient balance! Please add funds to your wallet.
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white transition-colors ${
              hasSufficientBalance
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            onClick={handleProceedPayment}
          >
            {loading ? (
              <div className="spinner-border-sm spinner-border"></div>
            ) : hasSufficientBalance ? (
              "Buy now"
            ) : (
              "Add Funds"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
