import React, { Suspense, lazy } from "react"
import { Router, Switch, Route } from "react-router-dom"
import { history } from "./history"
import { connect, useSelector, useDispatch } from "react-redux"
import { Redirect } from "react-router-dom"
import Spinner from "./components/@vuexy/spinner/Loading-spinner"
import { ContextLayout } from "./utility/context/Layout"
import { validateToken } from './API_Helpers/auth'
import { logoutAction } from './redux/actions/auth/loginActions'
import { ToastContainer, toast } from "react-toastify"

// Route-based code splitting
const UpdateTransfer = lazy(() =>
import("./app_components/Transfer/UpdateTransfer")
)
const TransferSetup = lazy(() =>
import("./app_components/Transfer/TransferSetup")
)
const CreateTransfer = lazy(() =>
  import("./app_components/Transfer/CreateTransfer")
)
const Profile = lazy(() =>
  import("./app_components/Profile/index")
)
const Refunds = lazy(() =>
  import("./app_components/Refunds/Refunds")
)
const UpdateRefund = lazy(() =>
  import("./app_components/Refunds/UpdateRefund")
)
const Settings = lazy(() =>
  import("./app_components/Settings/index")
)
const CashUp = lazy(() =>
  import("./app_components/CashUp/index")
)
const Coupons = lazy(() =>
  import("./app_components/Coupons/Coupons")
)
const OrderReciept = lazy(() =>
  import("./OrderReciept")
)
const CreateClient = lazy(() =>
  import("./app_components/Client/CreateClient")
)
const Clientsetup = lazy(() =>
  import("./app_components/Client/Clients")
)
const SentSMS = lazy(() =>
  import("./app_components/SentSMS/SentSMS")
)
const ClientUpdates = lazy(() =>
  import("./app_components/Client/ClientUpdate")
)
const CreateCoupon = lazy(() =>
  import("./app_components/Coupons/CreateCoupon")
)
const Offers = lazy(() =>
  import("./app_components/Offers/OfferSetup")
)
const CreateOffer = lazy(() =>
  import("./app_components/Offers/CreateOffer")
)
const UpdateOffer = lazy(() =>
  import("./app_components/Offers/UpdateOffer")
)
const UpdateCoupon = lazy(() =>
  import("./app_components/Coupons/UpdateCoupon")
)
const Roles = lazy(() =>
  import("./app_components/Roles/Roles")
)
const Productsaledetails = lazy(() =>
  import("./app_components/Productsaledetails/index")
)
const DeliveryOrders = lazy(() =>
  import("./app_components/DeliveryOrders/index")
)
const OrdersByDeliverPerson = lazy(() =>
  import("./app_components/OrdersByDeliverPerson/index")
)
const DeliverOrderDetails = lazy(() =>
  import("./app_components/DeliveryOrders/DeliverOrderDetails")
)
const Users = lazy(() =>
  import("./app_components/Users/Users")
)
const CreateRole = lazy(() =>
  import("./app_components/Roles/CreateRole")
)
const CreateUser = lazy(() =>
  import("./app_components/Users/CreateUser")
)
const UpdateRole = lazy(() =>
  import("./app_components/Roles/UpdateRole")
)
const UpdateUser = lazy(() =>
  import("./app_components/Users/UpdateUser")
)
const Dashboard = lazy(() =>
  import("./app_components/Analytics/Dashboard")
)
const CostPrice = lazy(() =>
  import("./app_components//CostPrice/CostPrice")
)
const ProductCostPrice = lazy(() =>
  import("./app_components/ProductCostPrice/CostPrice")
)
const UpdateProductCostPrice = lazy(() =>
  import("./app_components/ProductCostPrice/CreateCostPrice")
)
const CreateCostPrice = lazy(() =>
  import("./app_components//CostPrice/CreateCostPrice")
)
const UpdateCostPrice = lazy(() =>
  import("./app_components//CostPrice/UpdateCostPrice")
)
const Login = lazy(() =>
  import("./views/pages/authentication/login/Login")
)
const SelectClient = lazy(() =>
  import("./app_components/SelectClient/SelectClient")
)
const CreateParameter = lazy(() =>
  import("./app_components/Parameters/CreateParameter")
)
const UpdateParameter = lazy(() =>
  import("./app_components/Parameters/UpdateParameter")
)
const Parameters = lazy(() =>
  import("./app_components/Parameters/Parameters")
)
const Vendors = lazy(() =>
  import("./app_components/Vendors/Vendors")
)
const UpdateVendor = lazy(() =>
  import("./app_components/Vendors/UpdateVendor")
)
const CreateVendor = lazy(() =>
  import("./app_components/Vendors/CreateVendor")
)
const Customers = lazy(() =>
import("./app_components/Customers/Customers")
)
const Kitchen = lazy(() =>
import("./app_components/Kitchen/index")
)
const LiveOrders = lazy(() =>
import("./app_components/LiveOrders/index")
)
const CreateCustomer = lazy(() =>
import("./app_components/Customers/CreateCustomer")
)
const UpdateCustomer = lazy(() =>
import("./app_components/Customers/UpdateCustomer")
)
const ProductCategories = lazy(() =>
  import("./app_components/ProductCategorySetup/ProductCategories")
)
const CreateProductCategory = lazy(() =>
  import("./app_components/ProductCategorySetup/CreateProductCategory")
)
const UpdateProductCategory = lazy(() =>
  import("./app_components/ProductCategorySetup/UpdateProductCategory")
)
const UpdateShift = lazy(() =>
  import("./app_components/Shifts/UpdateShift")
)
const Shifts = lazy(() =>
  import("./app_components/Shifts/Shifts")
)
const CreateShift = lazy(() =>
  import("./app_components/Shifts/CreateShift")
)
const UpdateRowMaterial = lazy(() =>
  import("./app_components/RowMaterial/UpdateRowMaterial")
)
const RowMaterials = lazy(() =>
  import("./app_components/RowMaterial/RowMaterials")
)
const CreateRowMaterial = lazy(() =>
  import("./app_components/RowMaterial/CreateRowMaterial")
)
const MenuItems = lazy(() =>
  import("./app_components/MenuItems/MenuItems")
)
const UpdateRowMenuItems = lazy(() =>
  import("./app_components/MenuItems/UpdateRowMenuItems")
)
const CreateRowMenuItems = lazy(() =>
  import("./app_components/MenuItems/CreateRowMenuItems")
)
const AdditionalProductGroups = lazy(() =>
  import("./app_components/AdditionalProductGroup/AdditionalProductGroup")
)
const UpdateAdditionalProductGroup = lazy(() =>
  import("./app_components/AdditionalProductGroup/UpdateAdditionalProductGroup")
)
const CreateAdditionalProductGroup = lazy(() =>
  import("./app_components/AdditionalProductGroup/CreateAdditionalProductGroup")
)
const Recipe = lazy(() =>
  import("./app_components/Recipe/Recipes")
)
const UpdateRecipe = lazy(() =>
  import("./app_components/Recipe/UpdateRecipe")
)
const CreateRecipe = lazy(() =>
  import("./app_components/Recipe/CreateRecipe")
)
const PurchasedInvoices = lazy(() =>
  import("./app_components/PurchasedInvoice/PurchasedInvoices")
)
const UpdatePurchasedInvoice = lazy(() =>
  import("./app_components/PurchasedInvoice/UpdatePurchasedInvoice")
)
const CreatePurchasedInvoice = lazy(() =>
  import("./app_components/PurchasedInvoice/CreatePurchasedInvoice")
)
const Terminals = lazy(() =>
  import("./app_components/Terminal/Terminals")
)
const UpdateTerminal = lazy(() =>
  import("./app_components/Terminal/UpdateTerminal")
)
const CreateTerminal = lazy(() =>
  import("./app_components/Terminal/CreateTerminal")
)
const CreatePaymentReason = lazy(() =>
  import("./app_components/PaymentReason/CreatePaymentReason")
)
const PaymentReason = lazy(() =>
  import("./app_components/PaymentReason/PaymentReason")
)
const UpdatePaymentReason = lazy(() =>
  import("./app_components/PaymentReason/UpdatePaymentReason")
)
const UnitOfMeasures = lazy(() =>
  import("./app_components/UnitOfMeasure/UnitOfMeasure")
)
const UpdateUnitOfMeasure = lazy(() =>
  import("./app_components/UnitOfMeasure/UpdatePaymentReason")
)
const CreateUnitOfMeasure = lazy(() =>
  import("./app_components/UnitOfMeasure/CreateUnitOfMeasure")
)
const Printers = lazy(() =>
  import("./app_components/Printer/Printers")
)
const CreatePrinter = lazy(() =>
  import("./app_components/Printer/CreatePrinter")
)
const UpdatePrinter = lazy(() =>
  import("./app_components/Printer/UpdatePrinter")
)
const PaymentMethods = lazy(() =>
  import("./app_components/PaymentMethod/PaymentMethods")
)
const CreatePaymentMethod = lazy(() =>
  import("./app_components/PaymentMethod/CreatePaymentMethod")
)
const UpdatePaymentMethod = lazy(() =>
  import("./app_components/PaymentMethod/UpdatePaymentMethod")
)
const CreateTax = lazy(() =>
  import("./app_components/TaxSetup/CreateTax")
)
const TaxSetup = lazy(() =>
  import("./app_components/TaxSetup/TaxSetup")
)
const UpdateTax = lazy(() =>
  import("./app_components/TaxSetup/UpdateTax")
)
const CreateFinancialAccount = lazy(() =>
  import("./app_components/FinancialAccount/CreateFinancialAccount")
)
const FinancialAccounts = lazy(() =>
  import("./app_components/FinancialAccount/FinancialAccounts")
)
const UpdateFinancialAccount = lazy(() =>
  import("./app_components/FinancialAccount/UpdateFinancialAccount")
)
const PayExpenses = lazy(() =>
  import("./app_components/PayExpenses/PayExpenses")
)
const CreatePayExpense = lazy(() =>
  import("./app_components/PayExpenses/CreatePayExpense")
)
const UpdatePayExpense = lazy(() =>
  import("./app_components/PayExpenses/UpdatePayExpense")
)
const Additionals = lazy(() =>
  import("./app_components/Additionals/Additionals")
)
const CreateAdditional = lazy(() =>
  import("./app_components/Additionals/CreateAdditional")
)
const UpdateAdditional = lazy(() =>
  import("./app_components/Additionals/UpdateAdditional")
)
const CreatePayProduction = lazy(() =>
  import("./app_components/Production/CreatePayProduction")
)
const ProductionSetup = lazy(() =>
  import("./app_components/Production/ProductionSetup")
)
const UpdatePayProduction = lazy(() =>
  import("./app_components/Production/UpdatePayProduction")
)
const Branchs = lazy(() =>
  import("./app_components/Branchs/Branchs")
)
const CreateBranch = lazy(() =>
  import("./app_components/Branchs/CreateBranch")
)
const UpdateBranch = lazy(() =>
  import("./app_components/Branchs/UpdateBranch")
)
const ClientUpdate = lazy(() =>
  import("./app_components/ClientUpdate/ClientUpdate")
)
const MovementSetup = lazy(() =>
  import("./app_components/MovementSetup/MovementSetup")
)
const CreateMovement = lazy(() =>
  import("./app_components/MovementSetup/CreateMovement")
)
const UpdateMovement = lazy(() =>
  import("./app_components/MovementSetup/UpdateMovement")
)
const StockMaintainance = lazy(() =>
  import("./app_components/StockMaintainance/StockMaintainanceSetup")
)
const CreateStockMaintainance = lazy(() =>
  import("./app_components/StockMaintainance/CreateStockMaintainance")
)
const UpdateStockMaintainance = lazy(() =>
  import("./app_components/StockMaintainance/UpdateStockMaintainance")
)
const InventoryCountSetup = lazy(() =>
  import("./app_components/InventoryCount/InventoryCountSetup")
)
const CreateInventoryCount = lazy(() =>
  import("./app_components/InventoryCount/CreateInventoryCount")
)
const UpdateInventoryCount = lazy(() =>
  import("./app_components/InventoryCount/UpdateInventoryCount")
)
const UpdateWarehouses = lazy(() =>
  import("./app_components/Warehouses/UpdateWarehouses")
)
const CreateWarehouse = lazy(() =>
  import("./app_components/Warehouses/CreateWarehouse")
)
const Warehouses = lazy(() =>
  import("./app_components/Warehouses/Warehouses")
)
const UpdateComboDeal = lazy(() =>
  import("./app_components/ComboDeals/UpdateComboDeal")
)
const CreateComboDeal = lazy(() =>
  import("./app_components/ComboDeals/CreateComboDeal")
)
const ComboDeals = lazy(() =>
  import("./app_components/ComboDeals/ComboDeals")
)
const Orderslist = lazy(() =>
  import("./app_components/Orderslist/index")
)
const OrdersDetails = lazy(() =>
  import("./app_components/Orderslist/UpdateOrder")
)
const OnlineOrdersList = lazy(() =>
  import("./app_components/OnlineOrdersList/index")
)
const Pos = lazy(() =>
  import("./app_components/Pos/index")
)
const Reports = lazy(() =>
  import("./app_components/Reports/index")
)
const ParkingReport = lazy(() =>
  import("./app_components/Reports/ParkingReport")
)
const CashupVeiw = lazy(() =>
  import("./app_components/CashupVeiw/index")
)
const CashupVeiwDetails = lazy(() =>
  import("./app_components/CashupVeiw/cashupdetails")
)
const CreatePackage = lazy(() =>
  import("./app_components/Package/CreatePackage")
)
const PackageSetup = lazy(() =>
  import("./app_components/Package/PackageSetup")
)
const UpdatePackage = lazy(() =>
  import("./app_components/Package/UpdatePackage")
)
const CreateMessageTemplate = lazy(() =>
  import("./app_components/MessageTemplates/CreateMessageTemplate")
)
const MessageTemplateSetup = lazy(() =>
  import("./app_components/MessageTemplates/MessageTemplateSetup")
)
const UpdateMessageTemplate = lazy(() =>
  import("./app_components/MessageTemplates/UpdateMessageTemplate")
)
const CreateDeliveryPerson = lazy(() =>
  import("./app_components/DeliveryPerson/CreateDeliveryPerson")
)
const DeliveryPersonSetup = lazy(() =>
  import("./app_components/DeliveryPerson/DeliveryPersonSetup")
)
const UpdateDeliveryPerson = lazy(() =>
  import("./app_components/DeliveryPerson/UpdateDeliveryPerson")
)
const CreateScreenSetup = lazy(() =>
  import("./app_components/ScreenSetup/CreateScreenSetup")
)
const ScreenSetupSetup = lazy(() =>
  import("./app_components/ScreenSetup/ScreenSetupSetup")
)
const UpdateScreenSetup = lazy(() =>
  import("./app_components/ScreenSetup/UpdateScreenSetup")
)
const RefundPurchaseInvoicesSetup = lazy(() =>
  import("./app_components/RefundPurchaseInvoices/RefundPurchaseInvoicesSetup")
)

// Set Layout and Component Using App Route
const RouteConfig = ({ component: Component, fullLayout, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return (
        <ContextLayout.Consumer>
          {context => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            )
          }}
        </ContextLayout.Consumer>
      )
    }}
  />
)
const mapStateToProps = state => {
  return {
    user: state.auth.login.userRole
  }
}
const PrivateRoute = (props) => {
  const dispatch = useDispatch()
  const isAuthUser = useSelector(state => state.auth.login.userLogedIn)
  const user = useSelector(state => state.auth.login.user)
  
  if (isAuthUser) {
    validateToken({ tokenType: user.tokenType, accessToken: user.accessToken })
      .then(res => {

        if (!res.data) {
          dispatch(logoutAction(""))
          history.push("/")
          return false
        }
      })
    return <AppRoute
      {...props}
    />
  } else {
    return <Redirect to="/" />
  }
}
const PublicRoute = (props) => {
  const isAuthUser = useSelector(state => state.auth.login.userLogedIn)
  const isSuperClient = useSelector(state => state.auth.login && state.auth.login.client && state.auth.login.client.client)
  if(!props.restrict){
    return <AppRoute {...props} />
  }
  if (!isAuthUser) {
    return <AppRoute {...props} />
  } else {
    if (isSuperClient == "0") {
      return <Redirect to="/selectclient" />
    } else {
      return <Redirect to="/dashboard" />
    }
  }
}
const AppRoute = connect(mapStateToProps)(RouteConfig)

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder
      <Router history={history}>
        <Switch>
          <PublicRoute
            fullLayout
            exact
            path="/"
            restrict={true}
            component={Login} />
          <PrivateRoute
            exact
            restrict={false}
            path="/dashboard/productcostprices"
            component={ProductCostPrice} />
          <PrivateRoute
            exact
            restrict={false}
            path="/dashboard/updateproductcostprices"
            component={UpdateProductCostPrice} />
          <PrivateRoute
            exact
            restrict={false}
            path="/dashboard/costprices"
            component={CostPrice} />
          <PrivateRoute
            exact
            restrict={false}
            path="/dashboard/configure-costprices"
            component={CreateCostPrice} />
          <PrivateRoute
            exact
            restrict={false}
            path="/dashboard/update-costprices"
            component={UpdateCostPrice} />
          <PublicRoute
            fullLayout
            exact
            restrict={false}
            path="/receipt"
            component={OrderReciept} />
          <PrivateRoute
            exact
            path="/dashboard/"
            component={Dashboard}
          />
          <PrivateRoute
            exact
            path="/dashboard/refunds"
            component={Refunds}
          />
          <PrivateRoute
            exact
            path="/dashboard/profile"
            component={Profile}
          />
          <PrivateRoute
            exact
            path="/dashboard/setup-transfer-account"
            component={CreateTransfer}
          />
          <PrivateRoute
            exact
            path="/dashboard/transfer-accounts"
            component={TransferSetup}
          />
          <PrivateRoute
            exact
            path="/dashboard/update-transfer-account"
            component={UpdateTransfer}
          />
          <PrivateRoute
            exact
            path="/dashboard/settings"
            component={Settings}
          />
          <PrivateRoute
            path="/dashboard/updatepackage"
            component={UpdatePackage}
          />
          <PrivateRoute
            path="/dashboard/createpackage"
            component={CreatePackage}
          />
          <PrivateRoute
            path="/dashboard/package"
            component={PackageSetup}
          />
          <PrivateRoute
            path="/dashboard/messagetemplate"
            component={MessageTemplateSetup}
          />
          <PrivateRoute
            path="/dashboard/createmessagetemplate"
            component={CreateMessageTemplate}
          />
          <PrivateRoute
            path="/dashboard/updatemessagetemplate"
            component={UpdateMessageTemplate}
          />
          <PrivateRoute
            path="/dashboard/deliveryperson"
            component={DeliveryPersonSetup}
          />
          <PrivateRoute
            path="/dashboard/createdeliveryperson"
            component={CreateDeliveryPerson}
          />
          <PrivateRoute
            path="/dashboard/updatedeliveryperson"
            component={UpdateDeliveryPerson}
          />
          <PrivateRoute
            path="/dashboard/createscreen"
            component={CreateScreenSetup}
          />
          <PrivateRoute
            path="/dashboard/screensetup"
            component={ScreenSetupSetup}
          />
          <PrivateRoute
            path="/dashboard/screenupdate"
            component={UpdateScreenSetup}
          />
          <PrivateRoute
            path="/dashboard/rolesetup"
            component={Roles}
          />
          <PrivateRoute
            path="/dashboard/productsaledetails"
            component={Productsaledetails}
          />
          <PrivateRoute
            path="/dashboard/delivery-orders"
            component={DeliveryOrders}
          />
          <PrivateRoute
            path="/dashboard/orders-by-deliver-person"
            component={OrdersByDeliverPerson}
          />
          <PrivateRoute
            path="/dashboard/delivery-order-details"
            component={DeliverOrderDetails}
          />
          <PrivateRoute
            fullLayout
            path="/selectclient"
            component={SelectClient}
          />
          <PrivateRoute
            path="/dashboard/createuser"
            component={CreateUser}
          />
          <PrivateRoute
            path="/dashboard/createrole"
            component={CreateRole}
          />
          <PrivateRoute
            path="/dashboard/updaterole"
            component={UpdateRole}
          />
          <PrivateRoute
            path="/dashboard/userupdate"
            component={UpdateUser}
          />
          <PrivateRoute
            path="/dashboard/usersetup"
            component={Users}
          />
          <PrivateRoute
            path="/dashboard/parametersetup"
            component={Parameters}
          />
          <PrivateRoute
            path="/dashboard/cretaparameter"
            component={CreateParameter}
          />
          <PrivateRoute
            path="/dashboard/updateparameter"
            component={UpdateParameter}
          />
          <PrivateRoute
            path="/dashboard/couponsetup"
            component={Coupons}
          />
          <PrivateRoute
            path="/dashboard/createcoupon"
            component={CreateCoupon}
          />
          <PrivateRoute
            path="/dashboard/updatecoupon"
            component={UpdateCoupon}
          />
          <PrivateRoute
            path="/dashboard/vendorsetup"
            component={Vendors}
          />
          <PrivateRoute
            path="/dashboard/createvendor"
            component={CreateVendor}
          />
          <PrivateRoute
            path="/dashboard/updatevendor"
            component={UpdateVendor}
          />
          <PrivateRoute
            path="/dashboard/reports"
            component={Reports}
          />
          <PrivateRoute
            path="/dashboard/parking-report"
            component={ParkingReport}
          />
          <PrivateRoute
            path="/dashboard/cashupview"
            component={CashupVeiw}
          />
          <PrivateRoute
            path="/dashboard/cashupviewdetails"
            component={CashupVeiwDetails}
          />
          <PrivateRoute
            path="/dashboard/customersetup"
            component={Customers}
          />
          <PrivateRoute
            path="/dashboard/refundsbyid"
            component={UpdateRefund}
          />
          <PrivateRoute
            path="/dashboard/createcustomer"
            component={CreateCustomer}
          />
          <PrivateRoute
            path="/dashboard/updatecustomer"
            component={UpdateCustomer}
          />
          <PrivateRoute
            path="/dashboard/productcategorysetup"
            component={ProductCategories}
          />
          <PrivateRoute
            path="/dashboard/createproductcategory"
            component={CreateProductCategory}
          />
          <PrivateRoute
            path="/dashboard/updateproductcategory"
            component={UpdateProductCategory}
          />
          <PrivateRoute
            path="/dashboard/shifts"
            component={Shifts}
          />
          <PrivateRoute
            path="/dashboard/createshift"
            component={CreateShift}
          />
          <PrivateRoute
            path="/dashboard/updateshift"
            component={UpdateShift}
          />
          <PrivateRoute
            path="/dashboard/kitchen"
            component={Kitchen}
          />
          <PrivateRoute
            path="/dashboard/liveorders"
            component={LiveOrders}
          />
        
          <PrivateRoute
            path="/dashboard/rowmaterial"
            component={RowMaterials}
          />
          <PrivateRoute
            path="/dashboard/createrowmaterial"
            component={CreateRowMaterial}
          />
          <PrivateRoute
            path="/dashboard/updaterowmaterial"
            component={UpdateRowMaterial}
          />
          <PrivateRoute
            path="/dashboard/menuitems"
            component={MenuItems}
          />
          <PrivateRoute
            path="/dashboard/updatemenuitem"
            component={UpdateRowMenuItems}
          />
          <PrivateRoute
            path="/dashboard/createmenuitem"
            component={CreateRowMenuItems}
          />
          <PrivateRoute
            path="/dashboard/additionalgroup"
            component={AdditionalProductGroups}
          />
          <PrivateRoute
            path="/dashboard/updateadditionalgroup"
            component={UpdateAdditionalProductGroup}
          />
          <PrivateRoute
            path="/dashboard/createadditionalgroup"
            component={CreateAdditionalProductGroup}
          />
          <PrivateRoute
            path="/dashboard/recipe"
            component={Recipe}
          />
          <PrivateRoute
            path="/dashboard/updaterecipe"
            component={UpdateRecipe}
          />
          <PrivateRoute
            path="/dashboard/createrecipe"
            component={CreateRecipe}
          />
          <PrivateRoute
            path="/dashboard/purchaseinvoicesetup"
            component={PurchasedInvoices}
          />
          <PrivateRoute
            path="/dashboard/updatepurchaseinvoice"
            component={UpdatePurchasedInvoice}
          />
          <PrivateRoute
            path="/dashboard/createpurchaseinvoice"
            component={CreatePurchasedInvoice}
          />
          <PrivateRoute
            path="/dashboard/terminalsetup"
            component={Terminals}
          />
          <PrivateRoute
            path="/dashboard/updateterminal"
            component={UpdateTerminal}
          />
          <PrivateRoute
            path="/dashboard/createterminal"
            component={CreateTerminal}
          />
          <PrivateRoute
            path="/dashboard/paymentreasons"
            component={PaymentReason}
          />
          <PrivateRoute
            path="/dashboard/updatepaymentreason"
            component={UpdatePaymentReason}
          />
          <PrivateRoute
            path="/dashboard/createpaymentreason"
            component={CreatePaymentReason}
          />
          <PrivateRoute
            path="/dashboard/unitofmeasuresetup"
            component={UnitOfMeasures}
          />
          <PrivateRoute
            path="/dashboard/createclient"
            component={CreateClient}
          />
          <PrivateRoute
            path="/dashboard/clientsetup"
            component={Clientsetup}
          />
          <PrivateRoute
            path="/dashboard/sendsms"
            component={SentSMS}
          />
          <PrivateRoute
            path="/dashboard/updateClient"
            component={ClientUpdates}
          />
          <PrivateRoute
            path="/dashboard/updateunitofmeasure"
            component={UpdateUnitOfMeasure}
          />
          <PrivateRoute
            path="/dashboard/createoffer"
            component={CreateOffer}
          />
          <PrivateRoute
            path="/dashboard/offers"
            component={Offers}
          />
          <PrivateRoute
            path="/dashboard/updateoffer"
            component={UpdateOffer}
          />
          <PrivateRoute
            path="/dashboard/createunitofmeasure"
            component={CreateUnitOfMeasure}
          />
          <PrivateRoute
            path="/dashboard/printers"
            component={Printers}
          />
          <PrivateRoute
            path="/dashboard/updateprinter"
            component={UpdatePrinter}
          />
          <PrivateRoute
            path="/dashboard/createprinter"
            component={CreatePrinter}
          />
          <PrivateRoute
            path="/dashboard/paymentsetup"
            component={PaymentMethods}
          />
          <PrivateRoute
            path="/dashboard/updatepaymentmethod"
            component={UpdatePaymentMethod}
          />
          <PrivateRoute
            path="/dashboard/createpaymentmethod"
            component={CreatePaymentMethod}
          />
          <PrivateRoute
            path="/dashboard/taxsetup"
            component={TaxSetup}
          />
          <PrivateRoute
            path="/dashboard/updatetax"
            component={UpdateTax}
          />
          <PrivateRoute
            path="/dashboard/createtax"
            component={CreateTax}
          />
          <PrivateRoute
            path="/dashboard/faccountsetup"
            component={FinancialAccounts}
          />
          <PrivateRoute
            path="/dashboard/updatefaccount"
            component={UpdateFinancialAccount}
          />
          <PrivateRoute
            path="/dashboard/createfaccount"
            component={CreateFinancialAccount}
          />
          <PrivateRoute
            path="/dashboard/payexpenses"
            component={PayExpenses}
          />
          <PrivateRoute
            path="/dashboard/updatepayexpense"
            component={UpdatePayExpense}
          />
          <PrivateRoute
            path="/dashboard/createpayexpense"
            component={CreatePayExpense}
          />
          <PrivateRoute
            path="/dashboard/additionalsetup"
            component={Additionals}
          />
          <PrivateRoute
            path="/dashboard/updateadditional"
            component={UpdateAdditional}
          />
          <PrivateRoute
            path="/dashboard/createadditional"
            component={CreateAdditional}
          />
          <PrivateRoute
            path="/dashboard/productionsetup"
            component={ProductionSetup}
          />
          <PrivateRoute
            path="/dashboard/updateproduction"
            component={UpdatePayProduction}
          />
          <PrivateRoute
            path="/dashboard/createproduction"
            component={CreatePayProduction}
          />
          <PrivateRoute
            path="/dashboard/branchsetup"
            component={Branchs}
          />
          <PrivateRoute
            path="/dashboard/updatebranch"
            component={UpdateBranch}
          />
          <PrivateRoute
            path="/dashboard/createbranch"
            component={CreateBranch}
          />
          <PrivateRoute
            path="/dashboard/clientupdate"
            component={ClientUpdate}
          />
          <PrivateRoute
            path="/dashboard/movementsetup"
            component={MovementSetup}
          />
          <PrivateRoute
            path="/dashboard/createmovement"
            component={CreateMovement}
          />
          <PrivateRoute
            path="/dashboard/updatemovement"
            component={UpdateMovement}
          />
          <PrivateRoute
            path="/dashboard/stockmaintainance"
            component={StockMaintainance}
          />
          <PrivateRoute
            path="/dashboard/createstockmaintainance"
            component={CreateStockMaintainance}
          />
          <PrivateRoute
            path="/dashboard/updatestockmaintainance"
            component={UpdateStockMaintainance}
          />
          <PrivateRoute
            path="/dashboard/inventory"
            component={InventoryCountSetup}
          />
          <PrivateRoute
            path="/dashboard/createinventory"
            component={CreateInventoryCount}
          />
          <PrivateRoute
            path="/dashboard/updateinventory"
            component={UpdateInventoryCount}
          />
          <PrivateRoute
            path="/dashboard/warehousesetup"
            component={Warehouses}
          />
          <PrivateRoute
            path="/dashboard/createwarehouse"
            component={CreateWarehouse}
          />
          <PrivateRoute
            path="/dashboard/updatewarehouse"
            component={UpdateWarehouses}
          />
          <PrivateRoute
            path="/dashboard/combodeal"
            component={ComboDeals}
          />
          <PrivateRoute
            path="/dashboard/createcombodeal"
            component={CreateComboDeal}
          />
          <PrivateRoute
            path="/dashboard/updatecombodeal"
            component={UpdateComboDeal}
          />
          <PrivateRoute
            path="/dashboard/cashup"
            component={CashUp}
          />
          <PrivateRoute
            path="/dashboard/orderslist"
            component={Orderslist}
          />
          <PrivateRoute
            path="/dashboard/ordersdetails"
            component={OrdersDetails}
          />
          <PrivateRoute
            path="/dashboard/onlineorders"
            component={OnlineOrdersList}
          />
          <PrivateRoute
            path="/dashboard/pos"
            component={Pos}
            fullLayout
          />
            <PrivateRoute
            path="/liveorders"
            component={LiveOrders}
            fullLayout
          />
            <PrivateRoute
            path="/dashboard/refund-invoices"
            component={RefundPurchaseInvoicesSetup}            
          />
        </Switch>
      </Router>
    )
  }
}

export default AppRouter
