import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Layout } from "./utility/context/Layout"
import * as serviceWorker from "./serviceWorker"
import configureStore from "./redux/storeConfig/configureStore"
import Spinner from "./components/@vuexy/spinner/Fallback-spinner"
import "./index.scss"
import "./@fake-db"
import { ToastContainer, } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { PersistGate } from 'redux-persist/es/integration/react';
const { persistor, store } = configureStore();

const LazyApp = lazy(() => import("./App"))


// configureDatabase()
ReactDOM.render(
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
    >
      <Suspense fallback={<Spinner />}>
        <Layout>
          <LazyApp />
          <ToastContainer />

        </Layout>
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
