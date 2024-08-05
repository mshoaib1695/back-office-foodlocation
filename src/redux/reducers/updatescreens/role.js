import {
  ROLE,
  USER,
  CASHUPVIEW,
  PARAMETER,
  COUPON,
  VENDOR,
  CUSTOMER,
  PRODCATEGRY,
  SHIFT,
  ROW_MATERIAL,
  PRODUCT_PRICE,
  PRODUCT_INGREDIENT,
  PRODUCT_OFFER,
  OFFER,
  PRODUCT_ADDTIONAL,
  PRODUCT_WAREHOUSE_LIMIT,
  PRODUCT_GROUPITEM,
  PURCHASED_INVOISE,
  PURCHASED_INVOISE_LINE,
  TERMINAL,
  PAYMENT_REASON,
  UOM,
  PAYMENT_METHOD,
  PRINTER,
  TAX,
  F_ACCOUNT,
  P_EXPENSE,
  ADDITIONAL,
  PRODUCTION,
  PACKAGE,
  MESSAGE_TEMPLATE,
  DELIVER_PERSON,
  TRANSFER,
  BRANCH,
  FLOOR,
  BRANCH_PAY_MTHD,
  TABLE,
  MOVEMENT,
  MOVEMENT_LINE,
  STOCKMAINTAINANCE,
  STOCKMAINTAINANCE_LINE,
  INVENTORY_COUNT,
  WAREHOUSE,
  COMBO,
  COMBO_OPTION,
  COMBO_PRODUCT,
  SCREENS_UPDATE,
  ORDER_DETAILS,
  REFUND
} from '../../actions/updatescreens/role'

export const roleReducer = (state = {}, action) => {
  switch (action.type) {
    case ROLE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const cashupReducer = (state = {}, action) => {
  switch (action.type) {
    case CASHUPVIEW: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case USER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const parameterReducer = (state = {}, action) => {
  switch (action.type) {
    case PARAMETER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const couponReducer = (state = {}, action) => {
  switch (action.type) {
    case COUPON: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const vendorReducer = (state = {}, action) => {
  switch (action.type) {
    case VENDOR: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const transferReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSFER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const refundReducer = (state = {}, action) => {
  switch (action.type) {
    case REFUND: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const customerReducer = (state = {}, action) => {
  switch (action.type) {
    case CUSTOMER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const prodCategryReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODCATEGRY: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const shiftReducer = (state = {}, action) => {
  switch (action.type) {
    case SHIFT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const rowmaterialReducer = (state = {}, action) => {
  switch (action.type) {
    case ROW_MATERIAL: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productPriceReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_PRICE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productIngredientReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_INGREDIENT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productOfferReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_OFFER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const offerReducer = (state = {}, action) => {
  switch (action.type) {
    case OFFER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productAddtionalReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_ADDTIONAL: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productWarehouseLimitReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_WAREHOUSE_LIMIT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productGroupItemReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_GROUPITEM: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const puchasedInvoiceReducer = (state = {}, action) => {
  switch (action.type) {
    case PURCHASED_INVOISE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const puchasedInvoiceLineReducer = (state = {}, action) => {
  switch (action.type) {
    case PURCHASED_INVOISE_LINE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const terminalReducer = (state = {}, action) => {
  switch (action.type) {
    case TERMINAL: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const paymentReasonReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_REASON: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const uomReducer = (state = {}, action) => {
  switch (action.type) {
    case UOM: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const printerReducer = (state = {}, action) => {
  switch (action.type) {
    case PRINTER: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const paymentMethodReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_METHOD: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const taxReducer = (state = {}, action) => {
  switch (action.type) {
    case TAX: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const fAccountReducer = (state = {}, action) => {
  switch (action.type) {
    case F_ACCOUNT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const payExpeseReducer = (state = {}, action) => {
  switch (action.type) {
    case P_EXPENSE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const additionalReducer = (state = {}, action) => {
  switch (action.type) {
    case ADDITIONAL: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const packageReducer = (state = {}, action) => {
  switch (action.type) {
    case PACKAGE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const messageTemplateReducer = (state = {}, action) => {
  switch (action.type) {
    case MESSAGE_TEMPLATE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const deliveryPersonReducer = (state = {}, action) => {
  switch (action.type) {
    case DELIVER_PERSON: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const screenUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case SCREENS_UPDATE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const productionReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCTION: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const branchReducer = (state = {}, action) => {
  switch (action.type) {
    case BRANCH: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const floorReducer = (state = {}, action) => {
  switch (action.type) {
    case FLOOR: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const branchPayMethdReducer = (state = {}, action) => {
  switch (action.type) {
    case BRANCH_PAY_MTHD: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const tableReducer = (state = {}, action) => {
  switch (action.type) {
    case TABLE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const movementReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVEMENT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const orderDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DETAILS: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}

export const movementLineReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVEMENT_LINE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const stockMaintananceeReducer = (state = {}, action) => {
  switch (action.type) {
    case STOCKMAINTAINANCE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const stockMaintananceLineReducer = (state = {}, action) => {
  switch (action.type) {
    case STOCKMAINTAINANCE_LINE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const inventoryCountReducer = (state = {}, action) => {
  switch (action.type) {
    case INVENTORY_COUNT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const warehouseReducer = (state = {}, action) => {
  switch (action.type) {
    case WAREHOUSE: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const comboReducer = (state = {}, action) => {
  switch (action.type) {
    case COMBO: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const comboOptionReducer = (state = {}, action) => {
  switch (action.type) {
    case COMBO_OPTION: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}
export const comboProductReducer = (state = {}, action) => {
  switch (action.type) {
    case COMBO_PRODUCT: {
      return { ...state, ...action.payload }
    }
    default: {
      return state
    }
  }
}