import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomSticker = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('Red/White');
  const [finish, setFinish] = useState('Glossy');
  const [background, setBackground] = useState('Transparent');
  const [size, setSize] = useState('3x3 in');
  const [quantity, setQuantity] = useState(50);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const basePrice = 10; // ₹10 per sticker
  const total = (basePrice * Number(quantity)) || 0;

  const [imageFile, setImageFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      console.log('Creating custom order with:', {
        name,
        quantity: Number(quantity),
        token: token ? 'Present' : 'Missing'
      });
      
      const form = new FormData();
      form.append('name', name);
      form.append('description', description);
      form.append('color', color);
      form.append('finish', finish);
      form.append('background', background);
      form.append('size', size);
      form.append('unitPrice', String(basePrice));
      form.append('quantity', String(quantity));
      form.append('notes', notes);
      if (imageFile) form.append('image', imageFile);
      
      const response = await axios.post(`${API}/api/orders/custom`, form, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Custom order created successfully:', response.data);
      setMessage('Your custom sticker has been created and order placed! Sales department will review it shortly.');
      setTimeout(() => navigate('/home'), 1500);
    } catch (e) {
      console.error('Custom order creation failed:', e);
      setMessage(e.response?.data?.msg || 'Failed to submit order');
    }
  };

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
              <span className="text-xl font-bold text-gray-900">Create Custom Sticker</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 px-4">
        {message && <div className="mb-4 p-3 rounded bg-blue-50 text-blue-700">{message}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
           <input className="w-full p-2 border rounded" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter the name of the sticker..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="w-full p-2 border rounded" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe your custom sticker requirements..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Color</label>
            <input className="w-full p-2 border rounded" value={color} onChange={(e)=>setColor(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Finish</label>
            <select className="w-full p-2 border rounded" value={finish} onChange={(e)=>setFinish(e.target.value)}>
              <option>Glossy</option>
              <option>Matte</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Background</label>
            <select className="w-full p-2 border rounded" value={background} onChange={(e)=>setBackground(e.target.value)}>
              <option>Transparent</option>
              <option>White</option>
              <option>Clear</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <input className="w-full p-2 border rounded" value={size} onChange={(e)=>setSize(e.target.value)} placeholder="e.g., 3x3 in" />
          </div>
           <div>
             <label className="block text-sm font-medium text-gray-700">Quantity</label>
             <input type="number" min="1" className="w-full p-2 border rounded" value={quantity} onChange={(e)=>setQuantity(e.target.value)} />
           </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea className="w-full p-2 border rounded" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Any special instructions..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image (optional)</label>
          <input type="file" accept="image/*" className="w-full p-2 border rounded" onChange={(e)=> setImageFile(e.target.files?.[0] || null)} />
          {imageFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {imageFile.name}
            </p>
          )}
        </div>
        <div className="text-right text-lg font-semibold">Total: ₹{total.toFixed(2)} (₹{basePrice} per sticker)</div>
        <button type="submit" className="bg-primary-blue text-white px-5 py-3 rounded">Place Order</button>
      </form>
      </main>
    </div>
  );
};

export default CustomSticker;
