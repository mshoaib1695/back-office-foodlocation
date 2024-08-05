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
import { history } from "../../history";
import { api_url1 } from "../../assets/constants/api_url";
import Tabs from "./Tabs";
import Flatpickr from "react-flatpickr";
import { Download } from "react-feather";

function Reports(props) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("");
  const user = useSelector((state) => state.auth.login.user);
  const client = useSelector((state) => state.auth.login.client);
  const [loading, setLoading] = React.useState(false);
  const cashupView = useSelector((state) => state.updatescreens.cashup);

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
      if (res?.data?.length) {
        setProducts(
          res?.data?.map((i) => {
            return { value: i.id, label: i.name };
          })
        );
      }
    });
  };
  const onChange = (value) => {
    setProduct(value);
  };
  const reports = () => {
    let data = {
      cashupId: cashupView.id,
      clientId: client.clientId,
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
    };
    let authOptions = {
      data: data,
      apiname: "cashupDetailsPdfReport",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    report(authOptions)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        let a = new Date();
        let date =
          a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
        link.setAttribute("download", `CashUpReport${date}.pdf`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Row>
        <Col md="12" sm="12">
          <Card>
            <CardHeader>
              <CardTitle style={{ textAlign: "center", width: "100%" }}>
                Cashup Veiw Details
              </CardTitle>
              <div>
                <Button.Ripple color="primary" onClick={() => reports()}>
                  Download Report
                </Button.Ripple>
                <a
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=cashup_report.rptdesign&__title=Cashup-report&__showtitle=false&cashup_id=${cashupView.id}`}
                  style={{
                    margin: "10px 20px",
                  }}
                  target="_blank"
                >
                  {" "}
                  Open Cashup Report
                </a>

                <a
                  style={{
                    margin: "10px 20px",
                  }}
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=owner_cashup_report.rptdesign&__title=Cashup-report&__showtitle=false&cashup_id=${cashupView.id}`}
                  target="_blank"
                >
                  {" "}
                  Open Owner Cashup Report
                </a>

                <a
                  style={{
                    margin: "10px 20px",
                  }}
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=customer_details_cashup_report.rptdesign&__title=Customer-Details-Cashup-report&__showtitle=false&cashup_id=${cashupView.id}`}
                  target="_blank"
                >
                  {" "}
                  Open Customer details Cashup Report
                </a>
                <a
                  style={{
                    margin: "10px 20px",
                  }}
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=tickets_totals.rptdesign&__format=pdf&__title=tickets-report&__showtitle=false&cashup_id=${cashupView.id}`}
                  target="_blank"
                >
                  {" "}
                  Open Tickets Totals by Cashup Report
                </a>
                <a
                  style={{
                    margin: "10px 20px",
                  }}
                  // customer, product, toDate, fromDate, min_order_value, cost_added_value
                  className="mr-1 mb-1 btn btn-primary"
                  href={`${api_url1}reports/frameset?__report=tickets_cashup.rptdesign&__format=pdf&__title=tickets-report&__showtitle=false&cashup_id=${cashupView.id}`}
                  target="_blank"
                >
                  {" "}
                  Open All Tickets by Cashup Report
                </a>
              </div>
            </CardHeader>
            <CardBody>
              <Button.Ripple
                onClick={() => {
                  history.push("/dashboard/cashupview");
                }}
              >
                Back
              </Button.Ripple>
              <>
                <Row>
                  <Col md="6" sm="6">
                    <h5 className="mt-1">Cash Up Date</h5>
                    <p>
                      {cashupView.cashupDate &&
                        cashupView.cashupDate.split(" ")[0]}
                    </p>
                  </Col>

                  <Col md="6" sm="6">
                    <h5 className="mt-1">Cash Up Close Date</h5>
                    <p>
                      {cashupView.closeDate &&
                        cashupView.closeDate.split(" ")[0]}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md="6" sm="6">
                    <h5 className="mt-1">Cash Amount</h5>
                    <p>{cashupView.cashMthdAmt && cashupView.cashMthdAmt}</p>
                  </Col>

                  <Col md="6" sm="6">
                    <h5 className="mt-1">Card Amount</h5>
                    <p>{cashupView.cardMthdAmt && cashupView.cardMthdAmt}</p>
                  </Col>
                </Row>
                <Row>
                  <Col md="6" sm="6">
                    <h5 className="mt-1">Total</h5>
                    <p>{cashupView.total && cashupView.total}</p>
                  </Col>

                  <Col md="6" sm="6">
                    <h5 className="mt-1">Status</h5>
                    <p> {cashupView.status == "O" ? "Open" : "Close"}</p>
                  </Col>
                </Row>
              </>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Tabs cashup={cashupView?.id} />
    </>
  );
}

export default Reports;
