export const CASHUPVIEW = 'CASHUPVIEW';
export const OFFER = 'OFFER';
export const ROLE = 'ROLE';
export const USER = 'USER';
export const PARAMETER = 'PARAMETER';
export const COUPON = 'COUPON';
export const VENDOR = 'VENDOR';
export const REFUND = 'REFUND';
export const CUSTOMER = 'CUSTOMER';
export const PRODCATEGRY = 'PRODCATEGRY';
export const SHIFT = 'SHIFT';
export const ROW_MATERIAL = 'ROW_MATERIAL';
export const PRODUCT_PRICE = 'PRODUCT_PRICE';
export const PRODUCT_INGREDIENT = 'PRODUCT_INGREDIENT';
export const PRODUCT_OFFER = 'PRODUCT_OFFER';
export const PRODUCT_ADDTIONAL = 'PRODUCT_ADDTIONAL';
export const PRODUCT_WAREHOUSE_LIMIT = 'PRODUCT_WAREHOUSE_LIMIT';
export const PRODUCT_GROUPITEM = 'PRODUCT_GROUPITEM';
export const PURCHASED_INVOISE = 'PURCHASED_INVOISE';
export const PURCHASED_INVOISE_LINE = 'PURCHASED_INVOISE_LINE';
export const TERMINAL = 'TERMINAL';
export const PAYMENT_REASON = 'PAYMENT_REASON';
export const UOM = 'UOM';
export const PRINTER = 'PRINTER';
export const PAYMENT_METHOD = 'PAYMENT_METHOD';
export const TAX = 'TAX';
export const F_ACCOUNT = 'F_ACCOUNT';
export const P_EXPENSE = 'P_EXPENSE';
export const ADDITIONAL = 'ADDITIONAL';
export const BRANCH = 'BRANCH';
export const PRODUCTION = 'PRODUCTION';
export const PACKAGE = 'PACKAGE';
export const MESSAGE_TEMPLATE = 'MESSAGE_TEMPLATE';
export const FLOOR = 'FLOOR';
export const TABLE = 'TABLE';
export const MOVEMENT = 'MOVEMENT';
export const ORDER_DETAILS = 'ORDER_DETAILS';
export const BRANCH_PAY_MTHD = 'BRANCH_PAY_MTHD';
export const MOVEMENT_LINE = 'MOVEMENT_LINE';
export const STOCKMAINTAINANCE = 'STOCKMAINTAINANCE';
export const WAREHOUSE = 'WAREHOUSE';
export const STOCKMAINTAINANCE_LINE = 'STOCKMAINTAINANCE_LINE';
export const INVENTORY_COUNT = 'INVENTORY_COUNT';
export const COMBO = 'COMBO';
export const COMBO_PRODUCT = 'COMBO_PRODUCT';
export const COMBO_OPTION = 'COMBO_OPTION';
export const SCREENS_UPDATE = 'SCREENS_UPDATE';
export const DELIVER_PERSON = 'DELIVER_PERSON';
export const TRANSFER = 'TRANSFER';

export const roleUpdateDate = payload => {
  return dispatch => dispatch({ type: ROLE, payload: { ...payload } })
}
export const cashupView = payload => {
  return dispatch => dispatch({ type: CASHUPVIEW, payload: { ...payload } })
}
export const userUpdate = payload => {
  return dispatch => dispatch({ type: USER, payload: { ...payload } })
}
export const parameterUpdate = payload => {
  return dispatch => dispatch({ type: PARAMETER, payload: { ...payload } })
}
export const couponrUpdate = payload => {
  return dispatch => dispatch({ type: COUPON, payload: { ...payload } })
}
export const vendorUpdate = payload => {
  return dispatch => dispatch({ type: VENDOR, payload: { ...payload } })
}
export const transferShow = payload => {
  return dispatch => dispatch({ type: TRANSFER, payload: { ...payload } })
}
export const refundUpdate = payload => {
  return dispatch => dispatch({ type: REFUND, payload: { ...payload } })
}
export const customerUpdate = payload => {
  return dispatch => dispatch({ type: CUSTOMER, payload: { ...payload } })
}
export const prodCatgryUpdate = payload => {
  return dispatch => dispatch({ type: PRODCATEGRY, payload: { ...payload } })
}
export const shiftUpdate = payload => {
  return dispatch => dispatch({ type: SHIFT, payload: { ...payload } })
}
export const rowmaterialUpdate = payload => {
  return dispatch => dispatch({ type: ROW_MATERIAL, payload: { ...payload } })
}
export const productPriceUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_PRICE, payload: { ...payload } })
}
export const productIngredientUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_INGREDIENT, payload: { ...payload } })
}
export const productOfferUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_OFFER, payload: { ...payload } })
}
export const offerUpdate = payload => {
  return dispatch => dispatch({ type: OFFER, payload: { ...payload } })
}
export const productAdditonalUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_ADDTIONAL, payload: { ...payload } })
}
export const productWarehouseLowLimitUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_WAREHOUSE_LIMIT, payload: { ...payload } })
}
export const productGroupItemUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCT_GROUPITEM, payload: { ...payload } })
}
export const purchasedInvoiceUpdate = payload => {
  return dispatch => dispatch({ type: PURCHASED_INVOISE, payload: { ...payload } })
}
export const purchasedInvoiceLineUpdate = payload => {
  return dispatch => dispatch({ type: PURCHASED_INVOISE_LINE, payload: { ...payload } })
}
export const terminalUpdate = payload => {
  return dispatch => dispatch({ type: TERMINAL, payload: { ...payload } })
}
export const paymentReasonUpdate = payload => {
  return dispatch => dispatch({ type: PAYMENT_REASON, payload: { ...payload } })
}
export const uomUpdate = payload => {
  return dispatch => dispatch({ type: UOM, payload: { ...payload } })
}
export const printerUpdate = payload => {
  return dispatch => dispatch({ type: PRINTER, payload: { ...payload } })
}
export const paymentMethodUpdate = payload => {
  return dispatch => dispatch({ type: PAYMENT_METHOD, payload: { ...payload } })
}
export const taxUpdate = payload => {
  return dispatch => dispatch({ type: TAX, payload: { ...payload } })
}
export const faccountUpdate = payload => {
  return dispatch => dispatch({ type: F_ACCOUNT, payload: { ...payload } })
}
export const payExpeseUpdate = payload => {
  return dispatch => dispatch({ type: P_EXPENSE, payload: { ...payload } })
}
export const additionalUpdate = payload => {
  return dispatch => dispatch({ type: ADDITIONAL, payload: { ...payload } })
}
export const productionUpdate = payload => {
  return dispatch => dispatch({ type: PRODUCTION, payload: { ...payload } })
}
export const packageUpdate = payload => {
  return dispatch => dispatch({ type: PACKAGE, payload: { ...payload } })
}
export const messageTemplateUpdate = payload => {
  return dispatch => dispatch({ type: MESSAGE_TEMPLATE, payload: { ...payload } })
}
export const deliveryPersonUpdate = payload => {
  return dispatch => dispatch({ type: DELIVER_PERSON, payload: { ...payload } })
}
export const screensUpdate = payload => {
  return dispatch => dispatch({ type: SCREENS_UPDATE, payload: { ...payload } })
}
export const branchUpdate = payload => {
  return dispatch => dispatch({ type: BRANCH, payload: { ...payload } })
}
export const floorUpdate = payload => {
  return dispatch => dispatch({ type: FLOOR, payload: { ...payload } })
}
export const tableUpdate = payload => {
  return dispatch => dispatch({ type: TABLE, payload: { ...payload } })
}
export const branchPayMethdUpdate = payload => {
  return dispatch => dispatch({ type: BRANCH_PAY_MTHD, payload: { ...payload } })
}
export const movementUpdate = payload => {
  return dispatch => dispatch({ type: MOVEMENT, payload: { ...payload } })
}
export const orderdetails = payload => {
  return dispatch => dispatch({ type: ORDER_DETAILS, payload: { ...payload } })
}
export const movementLineUpdate = payload => {
  return dispatch => dispatch({ type: MOVEMENT_LINE, payload: { ...payload } })
}
export const stockMaintananceeUpdate = payload => {
  return dispatch => dispatch({ type: STOCKMAINTAINANCE, payload: { ...payload } })
}
export const stockMaintananceLineUpdate = payload => {
  return dispatch => dispatch({ type: STOCKMAINTAINANCE_LINE, payload: { ...payload } })
}
export const inventoryCountUpdate = payload => {
  return dispatch => dispatch({ type: INVENTORY_COUNT, payload: { ...payload } })
}
export const warehouseUpdate = payload => {
  return dispatch => dispatch({ type: WAREHOUSE, payload: { ...payload } })
}
export const comboUpdate = payload => {
  return dispatch => dispatch({ type: COMBO, payload: { ...payload } })
}
export const comboOptionUpdate = payload => {
  return dispatch => dispatch({ type: COMBO_OPTION, payload: { ...payload } })
}
export const comboProductUpdate = payload => {
  return dispatch => dispatch({ type: COMBO_PRODUCT, payload: { ...payload } })
}