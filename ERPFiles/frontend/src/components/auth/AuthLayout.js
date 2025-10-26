// frontend/src/components/auth/AuthLayout.js
import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.svg'; // Make sure you've saved the logo SVG

const brandMessages = [
  {
    title: "Comprehensive ERP Solution",
    description: "Manage products, orders, and finances in one integrated platform.",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    title: "Data-Driven Insights",
    description: "Leverage real-time analytics to make smarter business decisions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    title: "Streamlined Operations",
    description: "Automate your workflow from inventory to invoicing.",
    image: "https://images.unsplash.com/photo-1665686310934-865eb9941a1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  }
];

const AuthLayout = ({ children }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessageIndex(prevIndex => (prevIndex + 1) % brandMessages.length);
    }, 5000); // Change message every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const currentMessage = brandMessages[currentMessageIndex];

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
           <div className="flex justify-center mb-8">
             <img src={logo} alt="Nexus ERP Logo" className="h-12 w-auto" />
           </div>
          {children}
        </div>
      </div>
      
      {/* Storytelling Section */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-primary-blue p-12 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${currentMessage.image})` }}
          key={currentMessage.image}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold mb-4">{currentMessage.title}</h1>
            <p className="text-xl text-gray-200">{currentMessage.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;