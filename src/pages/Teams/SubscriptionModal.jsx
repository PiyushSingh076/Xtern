import React from 'react';

const SubscriptionModal = ({ isOpen, onClose, stipend, setStipend, onSubmit, loading }) => {
    if (!isOpen) return null;

    const handleStipendChange = (e) => {
        // Convert to string to handle the input properly
        const value = e.target.value;
        setStipend(value);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-3">Enter Stipend Amount</h2>
                <input
                    type="number"
                    value={stipend}
                    onChange={handleStipendChange}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter stipend"
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <button 
                        onClick={onClose} 
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className={`px-3 py-1 rounded ${
                            loading 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg 
                                    className="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full" 
                                    viewBox="0 0 24 24"
                                />
                                Submitting...
                            </span>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;