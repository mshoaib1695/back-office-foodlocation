
import { createStore , applyMiddleware,compose } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import thunk from 'redux-thunk';
import rootReducer from "../reducers/rootReducer"


const persistConfig = {
  key: 'root',
  storage,
  whitelist:['auth', 'updatescreens']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  let store = createStore(
    persistedReducer,
    composeEnhancers(
      applyMiddleware(thunk),
      ),
)
  let persistor = persistStore(store)
  return { store, persistor }
}