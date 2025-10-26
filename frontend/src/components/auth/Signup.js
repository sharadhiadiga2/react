import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.svg';
import setAuthToken from '../../utils/setAuthToken';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const { name, email, password, role } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      const { token, role: userRole } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      setAuthToken(token);
      
      // Redirect based on user role
      if (userRole === 'sales' || userRole === 'admin') {
        navigate('/sales');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
        {/* Image Section */}
        <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80')" }}>
        </div>
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center mb-8">
                <img src={logo} alt="Logo" className="h-10" />
                <span className="text-2xl font-bold ml-3 text-gray-800">Nexus ERP</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Your Account</h2>
                <p className="text-gray-500 mb-8">Join Nexus ERP and streamline your business.</p>

                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4 text-sm">{error}</p>}
                
                <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input type="text" name="name" value={name} onChange={onChange} required
                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input type="email" name="email" value={email} onChange={onChange} required
                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                    <input type="password" name="password" value={password} onChange={onChange} required
                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                    <select name="role" value={role} onChange={onChange} required
                      className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue">
                        <option value="user">User</option>
                        <option value="sales">Sales</option>
                        <option value="production">Production</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <motion.button type="submit"
                    className="w-full bg-primary-blue text-white font-bold py-3 rounded-lg"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Create Account
                </motion.button>
                </form>
                <p className="text-center text-gray-500 mt-8 text-sm">
                Already have an account? <Link to="/login" className="text-primary-blue font-semibold hover:underline">Log In</Link>
                </p>
            </motion.div>
            </div>
        </div>
    </div>
  );
};

export default Signup;