import React, { useReducer } from 'react';
import axios from 'axios';
import ProductContext from './productContext';
import productReducer from './productReducer';
import { GET_PRODUCTS, PRODUCTS_ERROR, ADD_PRODUCT } from '../types';

const ProductState = (props) => {
  const initialState = {
    products: [],
    current: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  // Get Products
  const getProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: PRODUCTS_ERROR,
        payload: err.response.msg,
      });
    }
  };

  // Add Product
  const addProduct = async (formData) => {
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    try {
        const res = await axios.post('http://localhost:5000/api/products', formData, config);
        dispatch({
            type: ADD_PRODUCT,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PRODUCTS_ERROR,
            payload: err.response.msg
        });
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        loading: state.loading,
        error: state.error,
        getProducts,
        addProduct
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
};

export default ProductState;