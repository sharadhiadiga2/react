import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.svg';

const UserOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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
      
      // Load orders
      const res = await axios.get(`${API}/api/orders/my`, {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (e) {
      setMessage('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const confirm = async (id) => {
    try {
      setActionId(id);
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      await axios.put(`${API}/api/orders/${id}/user-confirm`, {}, {
        headers: { 'x-auth-token': token }
      });
      setMessage('Order confirmed. Sales will send it to production.');
      load();
    } catch (e) {
      setMessage(e.response?.data?.msg || 'Failed to confirm');
    } finally {
      setActionId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed_by_sales': return 'bg-blue-100 text-blue-800';
      case 'user_confirmed': return 'bg-green-100 text-green-800';
      case 'sent_to_production': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'placed': return 'Order Placed';
      case 'reviewed_by_sales': return 'Reviewed by Sales - Confirm Now';
      case 'user_confirmed': return 'Confirmed - Sent to Production';
      case 'sent_to_production': return 'In Production';
      default: return status;
    }
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
              <span className="ml-3 text-xl font-bold text-gray-900">My Orders</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/home')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                ← Back to Home
              </button>
              <span className="text-sm text-gray-600">Welcome, {currentUser?.name}</span>
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
          {message && (
            <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700">{message}</div>
          )}
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <div className="text-sm text-gray-600">
              Total Orders: {orders.length}
            </div>
          </div>

          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No orders found</div>
                <div className="text-gray-400 text-sm mt-2">Your orders will appear here</div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                        {order.notes && <p><strong>Your Notes:</strong> {order.notes}</p>}
                        {order.reviewComment && (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <p><strong>Sales Review:</strong> {order.reviewComment}</p>
                            {order.reviewedBy && <p><strong>Reviewed by:</strong> {order.reviewedBy}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Order ID: {order._id}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Items:</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                          {item.custom ? (
                            // Custom Order Item
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                {item.custom.imageUrl && (
                                  <img 
                                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${item.custom.imageUrl}`} 
                                    alt={item.custom.name} 
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.custom.name}</h5>
                                  <p className="text-sm text-gray-600">{item.custom.description}</p>
                                  <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                                    <span>Color: {item.custom.color}</span>
                                    <span>Finish: {item.custom.finish}</span>
                                    <span>Size: {item.custom.size}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{item.custom.unitPrice} × {item.quantity}</p>
                                  <p className="text-sm text-gray-600">= ₹{(item.custom.unitPrice * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Regular Product Item
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                {item.product?.imageUrl && (
                                  <img 
                                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${item.product.imageUrl}`} 
                                    alt={item.product.name} 
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                                  <p className="text-sm text-gray-600">{item.product?.description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">₹{item.product?.cost} × {item.quantity}</p>
                                  <p className="text-sm text-gray-600">= ₹{((item.product?.cost || 0) * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {order.status === 'reviewed_by_sales' && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => confirm(order._id)}
                          disabled={actionId === order._id}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionId === order._id ? 'Processing...' : 'Confirm Order'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserOrders;


