import React from "react";
import axios from "axios";
import { api_url_reports as API_URL_REPORT } from "../../assets/constants/api_url";
import { api_url as API_URL } from "../../assets/constants/api_url";
import moment from "moment";
import { connect } from "react-redux";
import SessionByDevice from "../../views/ui-elements/cards/analytics/SessionByDevice";
import Customers from "../../views/ui-elements/cards/analytics/Customers";
import GoalOverview from "../../views/ui-elements/cards/analytics/GoalOverview";
import RevenueChart from "../../views/ui-elements/cards/analytics/Revenue";
import ClientRetention from "../../views/ui-elements/cards/analytics/ClientRetention";
import CrossProducts from "../../views/ui-elements/cards/analytics/CrossProducts";
import StatisticsCard from "../../components/@vuexy/statisticsCard/StatisticsCard";
import { Package } from "react-feather";
import TotalSalesByCashier from "./TotalSalesByCashier";
import TotalOrdersByBranch from "./TotalOrdersByBranch";
import TotalSalesByBranch from "./TotalSalesByBranch";
import DateComponent from "./DateComponent";
import CategorySales from '../../views/ui-elements/cards/analytics/CategorySales'
import "react-toastify/dist/ReactToastify.css";
import TaxDetails from "./TaxDetails";
import { Card, Row, Col, CardHeader, CardTitle, CardBody } from "reactstrap";
import "./style.css";
import Cashupfordashboard from '../CashUp/cashupfordashboard'

const $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $primary_light = "#9c8cfc",
  $warning_light = "#FFC085",
  $danger_light = "#f29292",
  $stroke_color = "#b9c3cd",
  $label_color = "#e7eef7";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonthDaywiseSales: [],
      topSalesProductofMonth: [],
      totalSales: [],
      totalOrdersAndSalesByBranch: [],
      topSalesCrossProduct: [],
      totalTaxDetails: {},
      totalOrdersAndSalesByCashier: [],
      totalCancelOrders: 0,
      totalCancelOrdersLines: 0,
      totalDiscountAmount: 0,
      totalWasteCost: 0,
      toDate: null,
      fromDate: null,
      orderType: null,
      totalTobaccoFee: 0,
      order_types: [],
      branches: [],
      salesByCategory: [],
      menuItems: [],
      normalCostItems: [],
      perfectCostItems: [],
      dangerCostItems: [],
    };
  }
  componentDidMount() {
    this.getMenuItems();
    this.normalCostItemsFn();
    this.dangerCostItems();
    this.perfectCostItems();
    this.getOrderTypes();
    this.getBranchsLists();
    this.setState(
      {
        fromDate: moment(new Date()).format("YYYY-MM-DD") + " 00:00:00",
        toDate: moment(new Date()).format("YYYY-MM-DD") + " 23:59:59",
      },
      () => {
        this.apiCalls();
      }
    );
  }
  getMenuItems = () => {
    let that = this;
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    axios({
      url: API_URL + "menuItems",
      method: "GET",
      params: {
        clientId: that.props.client.clientId,
        // lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.data) {
          that.setState({ menuItems: res.data });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  normalCostItemsFn = () => {
    let that = this;
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    axios({
      url: API_URL + "normalCostItems",
      method: "GET",
      params: {
        clientId: that.props.client.clientId,
        // lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.data.success) {
          that.setState({ normalCostItems: res.data.content });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  perfectCostItems = () => {
    let that = this;
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    axios({
      url: API_URL + "perfectCostItems",
      method: "GET",
      params: {
        clientId: that.props.client.clientId,
        // lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.data.success) {
          that.setState({ perfectCostItems: res.data.content });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  dangerCostItems = () => {
    let that = this;
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    axios({
      url: API_URL + "dangerCostItems",
      method: "GET",
      params: {
        clientId: that.props.client.clientId,
        // lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.data.success) {
          that.setState({ dangerCostItems: res.data.content });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  apiCalls = () => {
    let that = this;
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    axios({
      url: API_URL_REPORT + "currentMonthDaywiseSales",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      that.setState({ currentMonthDaywiseSales: res.data });
    });
    axios({
      url: API_URL_REPORT + "topSalesProductofMonth",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      that.setState({ topSalesProductofMonth: res.data });
    });
    axios({
      url: API_URL_REPORT + "totalSales",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      that.setState({ totalSales: res.data });
    });
    axios({
      url: API_URL_REPORT + "totalOrdersAndSalesByBranch",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      that.setState({ totalOrdersAndSalesByBranch: res.data });
    });
    axios({
      url: API_URL_REPORT + "totalOrdersAndSalesByCashier",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      that.setState({ totalOrdersAndSalesByCashier: res.data });
    });

    axios({
      url: API_URL_REPORT + "totalCancelOrders",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ totalCancelOrders: res.data.totalOrders, totalCancelOrdersLines: res.data.totalOrderLines });
      }
    });
    axios({
      url: API_URL_REPORT + "totalDiscountAmount",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ totalDiscountAmount: res.data });
      }
    });
    axios({
      url: API_URL_REPORT + "topSalesCrossProduct",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ topSalesCrossProduct: res.data });
      }
    });
    axios({
      url: API_URL_REPORT + "totalTaxDetails",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ totalTaxDetails: res.data });
      }
    });
    axios({
      url: API_URL_REPORT + "totalWasteCost",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ totalWasteCost: res.data });
      }
    });
    axios({
      url: API_URL_REPORT + "totalTobaccoFee",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ totalTobaccoFee: res.data });
      }
    });
    axios({
      url: API_URL_REPORT + "salesByCategory",
      method: "POST",
      data: {
        clientId: this.props.client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        orderType: this.state.orderType,
        fromDate: this.state.fromDate,
        toDate: this.state.toDate,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.data) {
        that.setState({ salesByCategory: res.data });
      }
    });
  };
  getOrderTypes = () => {
    let lang = "EN";
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    let self = this;
    axios({
      method: "GET",
      url: API_URL + "parametersListByParaType",
      params: {
        paraType: "ORDER_TYPE",
        lang: lang,
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    }).then(function (response) {
      if (response.data) {
        self.setState({
          order_types: response.data,
        });
      }
    });
  };
  getBranchsLists = () => {
    let accessToken = this.props.user.accessToken;
    let tokenType = this.props.user.tokenType;
    let self = this;
    var authOptionsBranch = {
      method: "GET",
      url: API_URL + "branchsList",
      params: {
        clientId: localStorage.getItem("clientId"),
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
      headers: {
        Authorization: tokenType + " " + accessToken,
        "Content-Type": "application/json",
      },
    };
    self = this;
    axios(authOptionsBranch).then(function (response) {
      // message.success(response.data.message);
      self.setState({
        branches: response.data,
      });
    });
  };
  render() {
    return (
      <>
        <Row>
          <Col lg="6" md="6" sm="12"></Col>
          <Col lg="6" md="6" sm="12">
            <DateComponent
              defaultType={"Today"}
              toDate={
                this.state.toDate
                  ? this.state.toDate
                  : moment(new Date()).format("YYYY-MM-DD") + "23:59:59"
              }
              fromDate={
                this.state.fromDate
                  ? this.state.fromDate
                  : moment(new Date()).format("YYYY-MM-DD") + " 00:00:00"
              }
              onChange={(fromDate, toDate) => {
                fromDate && toDate
                  ? this.setState(
                    { toDate: toDate, fromDate: fromDate },
                    () => {
                      this.apiCalls();
                    }
                  )
                  : this.setState({ toDate: "", fromDate: "" }, () => {
                    this.apiCalls();
                  });
              }}
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="8" md="6" sm="12">
            <RevenueChart
              primary={$primary}
              dangerLight={$danger_light}
              strokeColor={$stroke_color}
              labelColor={$label_color}
              currentMonthDaywiseSale={
                this.state.currentMonthDaywiseSales
                  ? this.state.currentMonthDaywiseSales
                  : []
              }
            />
          </Col>
          <Col lg="4" md="6" sm="12">
            <GoalOverview
              totalCancelOrders={
                this.state.totalCancelOrders ? this.state.totalCancelOrders : 0
              }
              totalOrders={
                this.state.totalSales.totalOrders
                  ? this.state.totalSales.totalOrders
                  : 0
              }
              strokeColor={$stroke_color}
              success={$success}
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="4" md="6" sm="12">
            <SessionByDevice
              totalTaxDetails={this.state.totalTaxDetails}
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
            />
          </Col>
          <Col lg="8" md="6" sm="12">
            <ClientRetention
              topSalesProductofMonth={this.state.topSalesProductofMonth}
              strokeColor={$stroke_color}
              primary={$primary}
              danger={$danger}
              labelColor={$label_color}
            />
          </Col>
        </Row>
        <Row className="match-height">

          <Col lg="8" md="6" sm="12">
            <CrossProducts
              topSalesProductofMonth={this.state.topSalesCrossProduct}
              strokeColor={$stroke_color}
              primary={$primary}
              danger={$danger}
              labelColor={$label_color}
            />
          </Col>
          <Col lg="4" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalSales.totalOrders}
              statTitle="Total Orders"
              hideChart={true}
              type="area"
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="4" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalCancelOrdersLines}
              statTitle="Total Cancel Items"
              hideChart={true}
              type="area"
            />
          </Col>
          <Col lg="8" md="6" sm="12">
            <CategorySales
              topSalesProductofMonth={this.state.salesByCategory}
              strokeColor={$stroke_color}
              primary={$primary}
              danger={$danger}
              labelColor={$label_color}
            />
          </Col>

        </Row>
        <Row className="match-height">
          <Col lg="6" sm="12">
            <TotalOrdersByBranch
              colors={[
                "#9c8cfc",
                "#FFC085",
                "#f29292",
                "#b9c3cd",
                "#e7eef7",
                "#7367F0",
                "#28C76F",
                "#EA5455",
                "#FF9F43",
              ]}
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
              data={
                this.state.totalOrdersAndSalesByCashier.length > 0
                  ? [...this.state.totalOrdersAndSalesByCashier]
                  : []
              }
            />
          </Col>
          <Col lg="6" sm="12">
            <TotalSalesByBranch
              colors={[
                "#9c8cfc",
                "#FFC085",
                "#f29292",
                "#b9c3cd",
                "#e7eef7",
                "#7367F0",
                "#28C76F",
                "#EA5455",
                "#FF9F43",
              ]}
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
              data={
                this.state.totalOrdersAndSalesByCashier.length > 0
                  ? [...this.state.totalOrdersAndSalesByCashier]
                  : []
              }
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="6" sm="12">
            <Customers
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
              colors={[
                $primary,
                $warning
              ]}
              data={this.state.totalOrdersAndSalesByCashier}
            />
          </Col>
          <Col lg="6" sm="12">
            <TotalSalesByCashier
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
              colors={[
                $primary,
                $warning
              ]}
              data={this.state.totalOrdersAndSalesByCashier}
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="6" sm="12">
            <TaxDetails
              primary={$primary}
              warning={$warning}
              danger={$danger}
              primaryLight={$primary_light}
              warningLight={$warning_light}
              dangerLight={$danger_light}
              data={this.state.totalTaxDetails}
            />
          </Col>
          <Col lg="6" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalSales.totalSales}
              statTitle="Total Sales"
              hideChart={true}
              type="area"
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="4" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalTobaccoFee}
              statTitle="Total Tobacco Fee"
              hideChart={true}
              type="area"
            />
          </Col>
          <Col lg="4" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalWasteCost}
              statTitle="Total Waste Cost"
              hideChart={true}
              type="area"
            />
          </Col>
          <Col lg="4" sm="12">
            <StatisticsCard
              icon={<Package className="warning" size={22} />}
              iconBg="warning"
              stat={"SAR  " + this.state.totalDiscountAmount}
              statTitle="Total Discount Amount"
              hideChart={true}
              type="area"
            />
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                  id="scroll"
                >
                  <table id='cashupsid'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Current Cost</th>
                        <th>Cost Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.menuItems?.map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>SAR{item.price}</td>
                          <td>SAR{item.currentCost}</td>
                          <td>{item.costPresentage}</td>
                        </tr>
                        // <div
                        //   style={{
                        //     display: "flex",
                        //     justifyContent: "space-between",
                        //     padding: "10px 20px",
                        //     borderBottom: "2px solid #c2c6dc52",
                        //   }}
                        // >
                        // </div>
                      ))}
                      {!this.state?.menuItems?.length && (
                        <div style={{ "position": "absolute", "textAlign": "center", "width": "100%" }}>Not Found</div>
                      )}{" "}
                    </tbody>
                  </table>

                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Normal cost items</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                  id="scroll"
                >
                  <table id='cashupsid'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Current Cost</th>
                        <th>Cost Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.normalCostItems?.map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>SAR{item.price}</td>
                          <td>SAR{item.currentCost}</td>
                          <td>{item.costPresentage}</td>
                        </tr>
                        // <div
                        //   style={{
                        //     display: "flex",
                        //     justifyContent: "space-between",
                        //     padding: "10px 20px",
                        //     borderBottom: "2px solid #c2c6dc52",
                        //   }}
                        // >
                        // </div>
                      ))}
                      {!this.state?.normalCostItems?.length && (
                        <div style={{ "position": "absolute", "textAlign": "center", "width": "100%" }}>Not Found</div>
                      )}{" "}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="match-height">
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Perfect cost items</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                  id="scroll"
                >
                  <table id='cashupsid'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Current Cost</th>
                        <th>Cost Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.perfectCostItems?.map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>SAR{item.price}</td>
                          <td>SAR{item.currentCost}</td>
                          <td>{item.costPresentage}</td>
                        </tr>
                        // <div
                        //   style={{
                        //     display: "flex",
                        //     justifyContent: "space-between",
                        //     padding: "10px 20px",
                        //     borderBottom: "2px solid #c2c6dc52",
                        //   }}
                        // >
                        // </div>
                      ))}
                      {!this.state?.perfectCostItems?.length && (
                        <div style={{ "position": "absolute", "textAlign": "center", "width": "100%" }}>Not Found</div>
                      )}{" "}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="6" sm="12">
            <Card>
              <CardHeader>
                <CardTitle>Danger cost items</CardTitle>
              </CardHeader>
              <CardBody>
                <div
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                  id="scroll"
                >
                  <table id='cashupsid'>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Current Cost</th>
                        <th>Cost Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.dangerCostItems?.map((item) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>SAR{item.price}</td>
                          <td>SAR{item.currentCost}</td>
                          <td>{item.costPresentage}</td>
                        </tr>
                        // <div
                        //   style={{
                        //     display: "flex",
                        //     justifyContent: "space-between",
                        //     padding: "10px 20px",
                        //     borderBottom: "2px solid #c2c6dc52",
                        //   }}
                        // >
                        // </div>
                      ))}
                      {!this.state?.dangerCostItems?.length && (
                        <div style={{ "position": "absolute", "textAlign": "center", "width": "100%" }}>Not Found</div>
                      )}{" "}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Cashupfordashboard />
      </>
    );
  }
}
function mapStateToProps(state) {
  return { client: state.auth.login.client, user: state.auth.login.user };
}
export default connect(mapStateToProps)(Dashboard);
