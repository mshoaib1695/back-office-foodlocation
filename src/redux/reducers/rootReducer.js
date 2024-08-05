import { combineReducers } from "redux"
import customizer from "./customizer/"
import auth from "./auth/"
import roleUpdateDateReducers from "./updatescreens"
import navbar from "./navbar/Index"
import pos from "./pos/index"

const rootReducer = combineReducers({
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  updatescreens:roleUpdateDateReducers,
  pos:pos
})

export default rootReducer
