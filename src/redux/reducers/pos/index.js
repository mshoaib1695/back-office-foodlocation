import { combineReducers } from "redux"
import {
  posProductsReducer,
} from "./pos"

const roleUpdateDateReducers = combineReducers({
  posProducts: posProductsReducer,
})

export default roleUpdateDateReducers
