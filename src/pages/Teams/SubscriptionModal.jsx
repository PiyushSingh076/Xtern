import React from 'react';

const SubscriptionModal = ({ isOpen, onClose, stipend, setStipend, description, setDescription, onSubmit, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-3">Enter Stipend Details</h2>

                {/* Stipend Input */}
                <input
                    type="number"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full border px-3 py-2 rounded mb-3"
                    placeholder="Enter stipend amount"
                />

                {/* Description Input */}
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Enter description (optional)"
                    rows={3}
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
