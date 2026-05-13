import { Link } from 'react-router-dom';
import { BiCycling, BiBriefcase, BiPackage } from 'react-icons/bi';
import { FaTruck, FaClock, FaShield } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              QuickLift - Last Mile Delivery Platform
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Fast, Reliable, and Affordable Delivery Service in Lucknow
            </p>
            <div className="flex gap-4">
              <Link
                to="/book-order"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Book Delivery
              </Link>
              <Link
                to="/register/partner"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Become a Partner
              </Link>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <BiCycling className="text-6xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                Bike Delivery Network
              </h3>
              <p className="text-gray-600 mt-2">
                Serving Lucknow with 2-wheeler delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose QuickLift?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <FaClock className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Average delivery time of 45 minutes within Lucknow
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <FaShield className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Secure & Verified</h3>
              <p className="text-gray-600">
                All delivery partners verified with PAN & Aadhar
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <FaTruck className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">
                Live GPS tracking of your delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Choose Your Role</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Partner */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <BiCycling className="text-5xl text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Delivery Partner</h3>
              <p className="text-gray-600 mb-6">
                Earn money by delivering packages using your 2-wheeler
              </p>
              <Link
                to="/register/partner"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition inline-block"
              >
                Register as Partner
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <BiBriefcase className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-gray-600 mb-6">
                Centralized logistics management for your business
              </p>
              <Link
                to="/register/enterprise"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
              >
                Register as Enterprise
              </Link>
            </div>

            {/* Customer */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition">
              <BiPackage className="text-5xl text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Customer</h3>
              <p className="text-gray-600 mb-6">
                Fast and affordable delivery of your packages
              </p>
              <Link
                to="/register"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition inline-block"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of satisfied customers and delivery partners
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
