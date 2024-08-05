import React, { useEffect, useState } from "react";
import {
  gridDataByClient,
  deleteapi,
  getList,
  report,
} from "../../API_Helpers/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Row,
  Col,
  Label,
} from "reactstrap";
import { useSelector } from "react-redux";
import message from "../../API_Helpers/toast";
import axios from "axios";
import moment from "moment";
import Radio from "../../components/@vuexy/radio/RadioVuexy";
import SalesInvoiceReport from "./SalesInvoiceReport";
import TaxReport from "./TaxReport";
import SalesInvoiceReportWithoutFilters from "./SalesInvoiceReportWithoutFilters";
import RefundReport from "./RefundReport";
import ProductSalesReport from "./ProductSalesReport";
import PurchaseInvoiceReport from "./PurchaseInvoiceReport";
import Flatpickr from "react-flatpickr";
import { Download } from "react-feather";
import { api_url1 } from "../../assets/constants/api_url";

function Reports(props) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [productPurchase, setProductPurchase] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromDatePurchase, setFromDatePurchase] = useState("");
  const [toDate, setToDate] = useState("");
  const [toDatePurchase, setToDatePurchase] = useState("");
  const [reportType, setReportType] = useState("");
  const user = useSelector((state) => state.auth.login.user);
  const client = useSelector((state) => state.auth.login.client);
  const [loading, setLoading] = React.useState(false);
  const [loadingPurchase, setLoadingPurchase] = React.useState(false);
  useEffect(() => {
    if (toDatePurchase && fromDatePurchase) {
      setLoadingPurchase(true);
    } else {
      setLoadingPurchase(false);
    }
  }, [toDatePurchase, fromDatePurchase]);
  const download = () => {
    setLoading(true);
    let data = {
      product,
      fromDate,
      toDate,
      clientId: client.clientId,
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
    };
    let authOptions = {
      data: data,
      apiname: reportType,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    report(authOptions)
      .then((res) => {
        setLoading(false);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        let a = new Date();
        let date =
          a.getDate() +
          "-" +
          (a.getMonth() + 1) +
          "-" +
          a.getFullYear() +
          "-" +
          a.getHours() +
          ":" +
          a.getMinutes() +
          ":" +
          a.getSeconds();
        link.setAttribute("download", `${reportType}-${date}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "productsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setProducts(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const onChange = (value) => {
    setProduct(value);
  };
  return (
    <Row>
      <Col md="6" sm="12">
        <Card>
          <CardHeader>
            <CardTitle style={{ textAlign: "center", width: "100%" }}>
              Tickets totals by cashup
            </CardTitle>
          </CardHeader>
          <CardBody>
            <>
              <h5 className="mt-1">Select Product</h5>

              <Row>
                <Col md="12" sm="12">
                  <select
                    style={{ width: "100%" }}
                    onChange={(event) => setProductPurchase(event.target.value)}
                    value={productPurchase}
                  >
                    <option value="">Show All</option>
                    {products.length > 0 &&
                      products.map((i) => (
                        <option value={i.value}>{i.label}</option>
                      ))}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col md="12" sm="12">
                  <h5 className="mt-1">From Date</h5>

                  <Row>
                    <Col md="12" sm="12">
                      <Flatpickr
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        className="form-control"
                        value={fromDatePurchase ? fromDatePurchase : null}
                        onChange={(date) =>
                          setFromDatePurchase(
                            moment(date[0]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md="12" sm="12">
                  <h5 className="mt-1">To Date</h5>

                  <Row>
                    <Col md="12" sm="12">
                      <Flatpickr
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        className="form-control"
                        value={toDatePurchase ? toDatePurchase : null}
                        onChange={(date) =>
                          setToDatePurchase(
                            moment(date[0]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loadingPurchase ? (
                <a
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=purchase_product.rptdesign&__title=purchase_on_product&__showtitle=false&product_id=${productPurchase}&fromDate=${fromDatePurchase}&toDate=${toDatePurchase}`}
                  style={{
                    borderColor: "rgb(255, 54, 74)",
                    backgroundColor: "rgb(255, 54, 74)",
                    color: "#fff !important",
                    float: "left",
                    marginTop: "20px",
                  }}
                  target="_blank"
                >
                  {" "}
                  Open Report
                </a>
              ) : (
                <Button
                  color="primary"
                  style={{ marginTop: "20px", cursor: "not-allowed" }}
                  disabled
                >
                  Open Report
                </Button>
              )}
            </>
          </CardBody>
        </Card>
      </Col>
      <Col md="6" sm="12">
        <Card>
          <CardHeader>
            <CardTitle style={{ textAlign: "center", width: "100%" }}>
              All tickets by cashup
            </CardTitle>
          </CardHeader>
          <CardBody>
            <>
              <h5 className="mt-1">Select Product</h5>

              <Row>
                <Col md="12" sm="12">
                  <select
                    style={{ width: "100%" }}
                    onChange={(event) => setProductPurchase(event.target.value)}
                    value={productPurchase}
                  >
                    <option value="">Show All</option>
                    {products.length > 0 &&
                      products.map((i) => (
                        <option value={i.value}>{i.label}</option>
                      ))}
                  </select>
                </Col>
              </Row>
              <Row>
                <Col md="12" sm="12">
                  <h5 className="mt-1">From Date</h5>

                  <Row>
                    <Col md="12" sm="12">
                      <Flatpickr
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        className="form-control"
                        value={fromDatePurchase ? fromDatePurchase : null}
                        onChange={(date) =>
                          setFromDatePurchase(
                            moment(date[0]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col md="12" sm="12">
                  <h5 className="mt-1">To Date</h5>

                  <Row>
                    <Col md="12" sm="12">
                      <Flatpickr
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        className="form-control"
                        value={toDatePurchase ? toDatePurchase : null}
                        onChange={(date) =>
                          setToDatePurchase(
                            moment(date[0]).format("YYYY-MM-DD")
                          )
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {loadingPurchase ? (
                <a
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=purchase_product.rptdesign&__title=purchase_on_product&__showtitle=false&product_id=${productPurchase}&fromDate=${fromDatePurchase}&toDate=${toDatePurchase}`}
                  style={{
                    borderColor: "rgb(255, 54, 74)",
                    backgroundColor: "rgb(255, 54, 74)",
                    color: "#fff !important",
                    float: "left",
                    marginTop: "20px",
                  }}
                  target="_blank"
                >
                  {" "}
                  Open Report
                </a>
              ) : (
                <Button
                  color="primary"
                  style={{ marginTop: "20px", cursor: "not-allowed" }}
                  disabled
                >
                  Open Report
                </Button>
              )}
            </>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}

export default Reports;
