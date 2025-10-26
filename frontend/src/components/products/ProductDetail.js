import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Custom order fields
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [finish, setFinish] = useState('Glossy');
  const [background, setBackground] = useState('Transparent');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API}/api/products/public/${id}`, { headers: {} });
        setProduct(res.data);
      } catch (e) {
        setMessage('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const placeOrder = async () => {
    try {
      // Validate required fields
      if (!color) {
        setMessage('Please select a color for your order');
        return;
      }
      
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      console.log('Retrieved token from localStorage:', token);
      console.log('Token length:', token ? token.length : 'null');
      
      // Set the token for axios globally
      setAuthToken(token);
      
      console.log('Placing order with:', {
        productId: id,
        quantity: Number(quantity),
        color: color,
        token: token ? 'Present' : 'Missing'
      });
      
      if (product.isCustom) {
        // For custom orders, redirect to custom sticker creation page
        navigate('/custom-sticker');
        return;
      }
      
      const composedNotes = `Color: ${color}; Finish: ${finish}; Background: ${background}; ${notes}`;
      const orderData = {
        items: [{ product: id, quantity: Number(quantity) }],
        notes: composedNotes,
      };
      
      console.log('Sending order data:', orderData);
      console.log('Axios default headers:', axios.defaults.headers.common);
      
      const response = await axios.post(`${API}/api/orders`, orderData);
      
      console.log('Order created successfully:', response.data);
      setMessage('Order placed. Sales will review shortly.');
      setTimeout(() => navigate('/my-orders'), 800);
    } catch (e) {
      console.error('Order creation failed:', e);
      const errorMsg = e.response?.data?.msg || 'Failed to place order';
      setMessage(errorMsg);
      
      // Log the full error for debugging
      console.log('Full error response:', e.response);
      console.log('Error status:', e.response?.status);
      console.log('Error data:', e.response?.data);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const imgBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => navigate('/home')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                ← Back to Home
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Product Details</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-6 px-4">
        {message && (
          <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700">{message}</div>
        )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src={`${imgBase}/${product.imageUrl}`} alt={product.name} className="w-full h-80 object-cover rounded" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl font-semibold mt-3">₹10.00 per unit</p>

          {product.isCustom ? (
            // Custom Order View
            <div className="mt-6 space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Custom Order Details</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Created by:</strong> {product.orderDetails?.customer}</p>
                  <p><strong>Color:</strong> {product.orderDetails?.color}</p>
                  <p><strong>Finish:</strong> {product.orderDetails?.finish}</p>
                  <p><strong>Background:</strong> {product.orderDetails?.background}</p>
                  <p><strong>Size:</strong> {product.orderDetails?.size}</p>
                  <p><strong>Quantity:</strong> {product.orderDetails?.quantity}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  This is a custom sticker created by another customer. 
                  If you like this design, you can create your own custom sticker with similar specifications.
                </p>
              </div>
              <button 
                onClick={placeOrder} 
                className="bg-green-600 text-white px-5 py-3 rounded hover:bg-green-700 w-full"
              >
                Create Similar Custom Sticker
              </button>
            </div>
          ) : (
            // Regular Product Order Form
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full p-2 border rounded">
                  <option value="">Select a color...</option>
                  <option value="Red/White">Red/White</option>
                  <option value="Blue/White">Blue/White</option>
                  <option value="Green/White">Green/White</option>
                  <option value="Black/White">Black/White</option>
                  <option value="Custom">Custom (specify in notes)</option>
                </select>
                {color === 'Custom' && (
                  <p className="text-xs text-gray-500 mt-1">Please specify your custom color in the notes section below</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Finish</label>
                <select value={finish} onChange={(e) => setFinish(e.target.value)} className="w-full p-2 border rounded">
                  <option>Glossy</option>
                  <option>Matte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Background</label>
                <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full p-2 border rounded">
                  <option>Transparent</option>
                  <option>White</option>
                  <option>Clear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Any special instructions..." />
              </div>
              <button 
                onClick={placeOrder} 
                disabled={!color}
                className={`px-5 py-3 rounded font-medium transition-colors ${
                  color 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {color ? 'Place Order' : 'Select Color First'}
              </button>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
};

export default ProductDetail;


