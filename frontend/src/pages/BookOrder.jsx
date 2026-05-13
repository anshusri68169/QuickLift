import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiMapPin, FiPackage } from 'react-icons/fi';

export default function BookOrder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    deliveryAddress: '',
    weight: 'bike',
    dimensions: '',
    description: '',
    vehicleType: 'bike',
    paymentMethod: 'wallet',
  });
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateCost = () => {
    const baseFare = { bike: 50, scooter: 75, auto: 100 }[formData.vehicleType];
    const distanceFare = 20;
    const weightSurcharge = parseInt(formData.weight) * 5;
    const tax = 0;
    const totalFare = baseFare + distanceFare + weightSurcharge + tax;

    return {
      baseFare,
      distanceFare,
      weightSurcharge,
      tax,
      totalFare,
    };
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        {
          pickupLocation: {
            address: formData.pickupAddress,
            latitude: 26.8467,
            longitude: 80.9462,
            contactName: 'Pickup Contact',
            contactPhone: '9876543210',
          },
          deliveryLocation: {
            address: formData.deliveryAddress,
            latitude: 26.8500,
            longitude: 80.9500,
            contactName: 'Delivery Contact',
            contactPhone: '9876543210',
          },
          parcel: {
            weight: parseInt(formData.weight),
            dimensions: formData.dimensions,
            value: 1000,
            description: formData.description,
            requiresSignature: false,
          },
          vehicleType: formData.vehicleType,
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrderDetails(response.data.data);
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Order failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Location & Parcel Details */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6">Book A Delivery</h2>

              <form>
                {/* Pickup Location */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Pickup Location *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                    <FiMapPin className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      placeholder="Enter pickup address"
                      required
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>

                {/* Delivery Location */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Delivery Location *
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
                    <FiMapPin className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      placeholder="Enter delivery address"
                      required
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>

                {/* Parcel Weight */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Parcel Weight *
                  </label>
                  <select
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="1">0-1 kg</option>
                    <option value="2">1-2 kg</option>
                    <option value="5">2-5 kg</option>
                    <option value="10">5-10 kg</option>
                  </select>
                </div>

                {/* Parcel Description */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Parcel Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your parcel..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Next: Select Vehicle
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Vehicle & Payment Selection */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6">Select Vehicle & Payment</h2>

              <form onSubmit={handleSubmitOrder}>
                {/* Vehicle Selection */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-4">
                    Choose Vehicle Type *
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['bike', 'scooter', 'auto'].map((vehicle) => (
                      <label
                        key={vehicle}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.vehicleType === vehicle
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="vehicleType"
                          value={vehicle}
                          checked={formData.vehicleType === vehicle}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className="font-semibold capitalize text-center">
                          {vehicle}
                        </div>
                        <div className="text-sm text-gray-600 text-center">
                          ₹{
                            {
                              bike: 199,
                              scooter: 249,
                              auto: 299,
                            }[vehicle]
                          }
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-bold mb-4">Cost Breakdown</h3>
                  {(() => {
                    const cost = calculateCost();
                    return (
                      <>
                        <div className="flex justify-between mb-2">
                          <span>Base Fare:</span>
                          <span>₹{cost.baseFare}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Distance Fare (5km):</span>
                          <span>₹{cost.distanceFare}</span>
                        </div>
                        <div className="flex justify-between mb-4 pb-4 border-b">
                          <span>Weight Surcharge:</span>
                          <span>₹{cost.weightSurcharge}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>₹{cost.totalFare}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-4">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="wallet">Wallet</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 3 && orderDetails && (
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="text-6xl mb-6">✓</div>
              <h2 className="text-3xl font-bold mb-4 text-green-600">
                Order Confirmed!
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-lg font-semibold mb-2">Order ID</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orderDetails.orderId}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold">₹{orderDetails.estimatedCost}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">ETA</p>
                  <p className="text-2xl font-bold">
                    {orderDetails.estimatedDeliveryTime} mins
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/order/${orderDetails.orderId}/track`)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
              >
                Track Order
              </button>

              <button
                onClick={() => navigate('/customer/dashboard')}
                className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
