import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCreditCard, FiArrowDown, FiArrowUp } from 'react-icons/fi';

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWallet(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load wallet');
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/wallet/${user.userId}/add-money`,
        {
          amount: parseInt(amount),
          paymentMethod: 'razorpay',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Money added successfully!');
      setAddMoneyModal(false);
      setAmount('');
      fetchWallet();
    } catch (error) {
      toast.error('Failed to add money');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg shadow-xl p-8 mb-6">
            <p className="text-lg opacity-90 mb-2">Available Balance</p>
            <h1 className="text-5xl font-bold mb-6">
              ₹{wallet?.balance || 0}
            </h1>

            <button
              onClick={() => setAddMoneyModal(true)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <FiCreditCard className="inline mr-2" /> Add Money
            </button>
          </div>

          {/* Quick Add Options */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Quick Add</h2>
            <div className="grid grid-cols-4 gap-4">
              {[100, 250, 500, 1000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => {
                    setAmount(quickAmount.toString());
                    setAddMoneyModal(true);
                  }}
                  className="bg-blue-50 text-blue-600 p-4 rounded-lg font-semibold hover:bg-blue-100 transition"
                >
                  ₹{quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

            {wallet?.transactions && wallet.transactions.length > 0 ? (
              <div className="space-y-4">
                {wallet.transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center">
                      {transaction.type === 'CREDIT' ? (
                        <FiArrowDown className="text-green-600 text-2xl mr-4" />
                      ) : (
                        <FiArrowUp className="text-red-600 text-2xl mr-4" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.reason}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          transaction.type === 'CREDIT'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'CREDIT' ? '+' : '-'}₹
                        {transaction.amount}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">
                No transactions yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {addMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add Money to Wallet</h2>

            <form onSubmit={handleAddMoney}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  You will be charged ₹{amount || 0} using Razorpay
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setAddMoneyModal(false);
                    setAmount('');
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Add Money'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
