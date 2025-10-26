import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import Home from './components/products/Home';
import Sales from './components/products/Sales';
import UserOrders from './components/products/UserOrders';
import ProductDetail from './components/products/ProductDetail';
import CustomSticker from './components/products/CustomSticker';
import PrivateRoute from './components/routing/PrivateRoute';
import RoleBasedRedirect from './components/routing/RoleBasedRedirect';
import AddProduct from './components/products/AddProduct';
import Products from './components/products/Products'; // Import Products component
import ProductState from './context/product/ProductState'; // Import ProductState
import setAuthToken from './utils/setAuthToken';
import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <ProductState> {/* Wrap everything in ProductState */}
      <Router>
        <Routes>
          <Route path="/" element={<RoleBasedRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
          <Route path="/sales" element={<PrivateRoute><Sales /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
          <Route path="/product/:id" element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
          <Route path="/custom-sticker" element={<PrivateRoute><CustomSticker /></PrivateRoute>} />
        </Routes>
      </Router>
    </ProductState>
  );
}

export default App;