import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductContext from '../../context/product/productContext';

const AddProduct = () => {
    const navigate = useNavigate();
    const productContext = useContext(ProductContext);
    const { addProduct } = productContext;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [procedureSteps, setProcedureSteps] = useState(['']); // State for procedure steps
    const [error, setError] = useState('');

    const onImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- Procedure Step Handlers ---
    const handleProcedureChange = (index, value) => {
        const newSteps = [...procedureSteps];
        newSteps[index] = value;
        setProcedureSteps(newSteps);
    };

    const addProcedureStep = () => {
        setProcedureSteps([...procedureSteps, '']);
    };

    const removeProcedureStep = (index) => {
        const newSteps = procedureSteps.filter((_, i) => i !== index);
        setProcedureSteps(newSteps);
    };
    // ---------------------------------

    const onSubmit = async e => {
        e.preventDefault();
        if (!image) {
            setError('Please upload a product image.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('cost', cost);
        formData.append('image', image);
        // Stringify the array of non-empty steps before sending
        formData.append('procedure', JSON.stringify(procedureSteps.filter(step => step.trim() !== '')));

        addProduct(formData);
        navigate('/products');
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl">
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create a New Product</h1>
                </header>
                
                <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-6 text-sm">{error}</p>}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Form Fields & Image */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4"
                                    className="w-full p-3 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Cost</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                                    <input type="number" value={cost} onChange={e => setCost(e.target.value)} required
                                        className="w-full p-3 pl-7 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-blue" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Product Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md object-cover"/>
                                        ) : (
                                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        )}
                                        <div className="flex text-sm text-gray-600 justify-center">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-blue hover:text-indigo-500 focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="image" type="file" className="sr-only" onChange={onImageChange} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Procedure Steps */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Manufacturing Procedure</label>
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {procedureSteps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center space-x-2"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <span className="font-semibold text-gray-500">{index + 1}.</span>
                                            <input
                                                type="text"
                                                value={step}
                                                onChange={(e) => handleProcedureChange(index, e.target.value)}
                                                placeholder={`Step ${index + 1}`}
                                                className="w-full p-2 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-blue"
                                            />
                                            {procedureSteps.length > 1 && (
                                                <button type="button" onClick={() => removeProcedureStep(index)} className="text-red-500 hover:text-red-700 p-1">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </button>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <button type="button" onClick={addProcedureStep} className="flex items-center space-x-2 text-primary-blue font-semibold hover:opacity-80 pt-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Add Step</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <motion.button type="submit"
                            className="bg-primary-blue text-white font-bold py-3 px-8 rounded-lg"
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Save Product
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AddProduct;