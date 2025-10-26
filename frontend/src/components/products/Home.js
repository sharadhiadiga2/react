import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.svg';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingId, setPlacingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const token = localStorage.getItem('token');
        
        // Load current user info
        if (token) {
          try {
            const userRes = await axios.get(`${API}/api/auth/me`, {
              headers: { 'x-auth-token': token }
            });
            setCurrentUser(userRes.data);
          } catch (e) {
            console.error('Failed to load user info:', e);
          }
        }
        
        // Load regular products
        const productsRes = await axios.get(`${API}/api/products/public`, { headers: {} });
        setProducts(productsRes.data);
        
        // Load custom orders
        const customRes = await axios.get(`${API}/api/products/custom-orders`, { headers: {} });
        setCustomOrders(customRes.data);
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: color
    }));
  };

  const getProductImage = (product, index) => {
    // Use different images for different products
    const images = [
      'uploads/image-1760161216976.png',
      'uploads/image-1760167002497.png', 
      'uploads/order-1761129660090.png'
    ];
    return images[index % images.length];
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-8" />
              <span className="ml-3 text-xl font-bold text-gray-900">Nexus ERP</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/my-orders" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                My Orders
              </Link>
              <Link to="/custom-sticker" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Create Custom Sticker
              </Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2" title="Logout">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Regular Products */}
        {products.map((p, index) => (
          <div key={p._id} className="bg-white shadow rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <img 
              src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000')}/${getProductImage(p, index)}`} 
              alt={p.name} 
              className="h-48 w-full object-cover rounded-lg mb-4" 
            />
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                <p className="text-xl font-bold text-blue-600 mt-2">₹{Number(10).toFixed(2)} per unit</p>
              </div>
              
              {/* Color Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Choose Color</label>
                <div className="flex flex-wrap gap-2">
                  {['Red/White', 'Blue/White', 'Green/White', 'Black/White', 'Custom'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(p._id, color)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedColors[p._id] === color
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                {selectedColors[p._id] && (
                  <p className="text-xs text-gray-500">Selected: {selectedColors[p._id]}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Link
                  to={`/product/${p._id}`}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Custom Orders */}
        {customOrders.map((order, index) => (
          <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <img 
              src={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000')}/${getProductImage(order, index)}`} 
              alt={order.name} 
              className="h-48 w-full object-cover rounded-lg mb-4" 
            />
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                <p className="text-xl font-bold text-green-600 mt-2">₹{Number(10).toFixed(2)} per unit</p>
                <p className="text-xs text-green-600 mt-1">✨ Custom Order by {order.orderDetails.customer}</p>
              </div>
              
              {/* Custom Order Details */}
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-2">Order Specifications</h4>
                <div className="text-xs text-green-700 space-y-1">
                  <p><span className="font-medium">Color:</span> {order.orderDetails.color}</p>
                  <p><span className="font-medium">Finish:</span> {order.orderDetails.finish}</p>
                  <p><span className="font-medium">Size:</span> {order.orderDetails.size}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {currentUser && order.orderDetails.customer === currentUser.name ? (
                  <div className="flex-1 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
                    Your Creation
                  </div>
                ) : (
                  <>
                    <Link
                      to={`/product/${order._id}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => navigate(`/product/${order._id}`)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Order Similar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
      </main>
    </div>
  );
};

export default Home;


