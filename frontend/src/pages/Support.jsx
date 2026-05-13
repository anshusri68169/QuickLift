import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiMessageCircle, FiClock } from 'react-icons/fi';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    description: '',
  });

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/support/tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTickets(response.data.data.tickets);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load tickets');
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/support/tickets`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Support ticket created successfully!');
      setShowCreateModal(false);
      setFormData({
        subject: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        description: '',
      });
      fetchTickets();
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Support</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center"
            >
              <FiPlus className="mr-2" /> Create Ticket
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets && tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.ticketId}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {ticket.ticketId}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900">
                        {ticket.subject}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.status === 'OPEN'
                          ? 'bg-green-100 text-green-800'
                          : ticket.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiMessageCircle className="mr-1" />
                      {ticket.category}
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-1" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <span
                      className={`px-2 py-1 rounded ${
                        ticket.priority === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : ticket.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600">No support tickets yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create Support Ticket</h2>

            <form onSubmit={handleCreateTicket}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief subject"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                >
                  <option value="TECHNICAL">Technical Issue</option>
                  <option value="PAYMENT">Payment Problem</option>
                  <option value="DELIVERY">Delivery Issue</option>
                  <option value="GENERAL">General Query</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  rows="4"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
