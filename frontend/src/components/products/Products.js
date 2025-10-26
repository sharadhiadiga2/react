import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductContext from '../../context/product/productContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCard = ({ product }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
    >
        <div className="relative">
            <img 
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                src={`http://localhost:5000/${product.imageUrl}`} 
                alt={product.name} 
            />
            <div className="absolute top-2 right-2 bg-primary-blue/80 text-white text-xs font-bold px-2 py-1 rounded-full">{product.productId}</div>
        </div>
        <div className="p-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800 mt-1">{product.name}</h3>
                <p className="text-xl font-bold text-gray-800">₹{product.cost.toFixed(2)}</p>
            </div>
            <p className="text-gray-500 mt-2 text-sm h-10 overflow-hidden">{product.description || 'No description provided.'}</p>
            <div className="mt-4 flex space-x-2">
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
                <span className="text-gray-300">|</span>
                <button className="text-sm font-semibold text-red-600 hover:text-red-800">Delete</button>
            </div>
        </div>
    </motion.div>
);

const Products = () => {
  const productContext = useContext(ProductContext);
  const { products, getProducts, loading } = productContext;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!loading) {
        setFilteredProducts(
            products.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productId.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }
  }, [searchTerm, products, loading]);

  if (loading && products.length === 0) {
    return <div className="p-8 text-center"><h2>Loading Products...</h2></div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">My Products</h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
                <input type="text" placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 p-2 pl-10 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <Link to="/add-product"
              className="bg-primary-blue text-white font-semibold py-2 px-5 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              <span>Add Product</span>
            </Link>
          </div>
        </header>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center py-16 text-gray-500">
                        {products.length > 0 ? 'No products match your search.' : 'No products found. Add one to get started!'}
                    </p>
                )}
            </AnimatePresence>
        </motion.div>
    </div>
  );
};

export default Products;