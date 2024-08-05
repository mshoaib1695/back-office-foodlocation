import {
  POS_PRODUCTS,
} from '../../actions/pos/pos'

export const posProductsReducer = (state = [], action) => {
  switch (action.type) {
    case POS_PRODUCTS: {
      return [...action.payload]
    }
    default: {
      return state
    }
  }
}