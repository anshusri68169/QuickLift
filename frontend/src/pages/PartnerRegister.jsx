import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';

export default function PartnerRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    city: 'Lucknow',
    aadharNumber: '',
    panNumber: '',
  });
  const [files, setFiles] = useState({
    aadharImage: null,
    panImage: null,
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList[0],
      }));
    }
  };

  const handleVehicleToggle = (vehicle) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicle)
        ? prev.filter((v) => v !== vehicle)
        : [...prev, vehicle]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('mobileNumber', formData.mobileNumber);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('aadharNumber', formData.aadharNumber);
      formDataToSend.append('panNumber', formData.panNumber);

      if (files.aadharImage) {
        formDataToSend.append('aadharImage', files.aadharImage);
      }
      if (files.panImage) {
        formDataToSend.append('panImage', files.panImage);
      }
      if (files.profilePhoto) {
        formDataToSend.append('profilePhoto', files.profilePhoto);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/partners/register`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message);
      navigate('/partner/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Become a Delivery Partner
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Step 1/3: Personal Information
              </h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  pattern="[0-9]{10}"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
                >
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Document Upload */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Step 2/3: Document Verification
              </h3>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  PAN Number *
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  PAN Card Image *
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-500 transition">
                  <FiUpload className="mr-2" />
                  <span>
                    {files.panImage ? files.panImage.name : 'Upload PAN Image'}
                  </span>
                  <input
                    type="file"
                    name="panImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Aadhar Number *
                </label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="123456789012"
                  pattern="[0-9]{12}"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Aadhar Card Image *
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-500 transition">
                  <FiUpload className="mr-2" />
                  <span>
                    {files.aadharImage
                      ? files.aadharImage.name
                      : 'Upload Aadhar Image'}
                  </span>
                  <input
                    type="file"
                    name="aadharImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Profile Photo *
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-500 transition">
                  <FiUpload className="mr-2" />
                  <span>
                    {files.profilePhoto
                      ? files.profilePhoto.name
                      : 'Upload Profile Photo'}
                  </span>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                  />
                </label>
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
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Vehicle Selection */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-6 text-gray-800">
                Step 3/3: Select Vehicles
              </h3>

              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-4">
                  Which vehicles do you want to attach?
                </p>

                <div className="space-y-3">
                  {['bike', 'scooter', 'auto'].map((vehicle) => (
                    <label
                      key={vehicle}
                      className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedVehicles.includes(vehicle)}
                        onChange={() => handleVehicleToggle(vehicle)}
                        className="w-5 h-5 text-green-600 rounded"
                      />
                      <span className="ml-3 font-semibold capitalize">
                        {vehicle} (Capacity: {vehicle === 'bike' ? '5kg' : vehicle === 'scooter' ? '10kg' : '50kg'})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-700">
                  ℹ️ Your details are under review. We will contact you soon.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
