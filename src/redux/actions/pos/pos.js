import { getList } from '../../../API_Helpers/api'

export const POS_PRODUCTS = 'POS_PRODUCTS';

export const posProducts = payload => {
  return dispatch => dispatch({ type: POS_PRODUCTS, payload: [...payload ] })
}

export const getPosProductsByCategory = payload => {
  return dispatch => {
    let payloadObj= {
      tokenType: payload.tokenType,
      accessToken: payload.accessToken,
      apiname: "posProductsListByCategory",
      data: {
        categoryId: payload.id,
        branchId: payload.branch,
        lang: payload.lang
      },
    }
    getList(payloadObj)
      .then(res => {

        dispatch(posProducts([...res.data]))
      })
  }
}

