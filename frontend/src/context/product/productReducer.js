import { GET_PRODUCTS, ADD_PRODUCT, PRODUCTS_ERROR } from '../types';

const productReducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case ADD_PRODUCT:
        return {
            ...state,
            products: [action.payload, ...state.products],
            loading: false
        };
    case PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default productReducer;