import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import logo from '../../assets/logo.svg';

// Mock Data for the chart
const salesData = [
  { name: 'Jan', sales: 4000 }, { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 }, { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 }, { name: 'Jun', sales: 5500 },
];

// Reusable component for the top KPI cards
const KpiCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
  </div>
);

// Reusable component for the action cards with links
const ActionCard = ({ title, count, icon, to }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm flex items-center space-x-4">
    {icon}
    <div>
      <p className="text-lg font-semibold text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{count}</p>
    </div>
    <Link to={to} className="ml-auto text-primary-blue font-semibold hover:underline">&rarr;</Link>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white shadow-md hidden lg:block">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-200">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="text-xl font-bold text-gray-800">Nexus ERP</span>
        </div>
        <ul className="mt-6">
          <li>
            <Link to="/dashboard" className="block px-6 py-3 text-gray-700 font-semibold bg-blue-50 border-l-4 border-primary-blue">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/products" className="block px-6 py-3 text-gray-600 hover:bg-gray-100">
              Products
            </Link>
          </li>
          <li>
            <Link to="/orders" className="block px-6 py-3 text-gray-600 hover:bg-gray-100">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/customers" className="block px-6 py-3 text-gray-600 hover:bg-gray-100">
              Customers
            </Link>
          </li>
          <li>
            <Link to="/reports" className="block px-6 py-3 text-gray-600 hover:bg-gray-100">
              Reports
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-800 font-semibold">User01</span>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600" title="Logout">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Total Revenue" value="₹5,42,300" change="+12.5% this month" />
          <KpiCard title="Open Orders" value="62" change="-2.1% this week" />
          <KpiCard title="New Customers" value="18" change="+5 this month" />
          <KpiCard title="Low Stock Items" value="9" change="Needs attention" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart (takes 2/3 width on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Monthly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Action Cards (takes 1/3 width) */}
          <div className="space-y-6">
            <ActionCard title="Products" count="1,482 items" to="/products" icon={<div className="w-12 h-12 bg-blue-500 rounded-xl" />} />
            <ActionCard title="Customers" count="256 active" to="/customers" icon={<div className="w-12 h-12 bg-green-500 rounded-xl" />} />
            <ActionCard title="Invoices" count="32 pending" to="/invoices" icon={<div className="w-12 h-12 bg-yellow-500 rounded-xl" />} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;