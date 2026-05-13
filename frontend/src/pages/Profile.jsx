import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser } from '../store/authSlice';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || 'Lucknow',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setUser({ ...user, ...formData }));
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            {!isEditing ? (
              <>
                <div className="space-y-6 mb-8">
                  <div className="flex items-center">
                    <FiUser className="text-blue-600 text-2xl mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Name</p>
                      <p className="text-xl font-semibold">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiMail className="text-blue-600 text-2xl mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="text-xl font-semibold">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiPhone className="text-blue-600 text-2xl mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">Phone</p>
                      <p className="text-xl font-semibold">{user?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FiMapPin className="text-blue-600 text-2xl mr-4" />
                    <div>
                      <p className="text-gray-600 text-sm">City</p>
                      <p className="text-xl font-semibold">{user?.city}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  >
                    <option value="Lucknow">Lucknow</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
