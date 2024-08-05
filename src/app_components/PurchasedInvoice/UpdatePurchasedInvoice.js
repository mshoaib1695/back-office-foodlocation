import { func } from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CustomInput,
  Input,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { history } from "../../history";
import { create, getList } from "../../API_Helpers/api";
import message from "../../API_Helpers/toast";
import ReactSelect from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import moment from "moment";
import Tabs from "./Tabs";
import { purchasedInvoiceLineUpdate } from "../../redux/actions/updatescreens/role";
import { api_url1 } from "../../assets/constants/api_url";

const formSchema = Yup.object().shape({
  payMethod: Yup.string().required("Required"),
  warehouse: Yup.string().required("Required"),
  invoiceDate: Yup.string().required("Required"),
  vendor: Yup.string().required("Required"),
});
// ROW_MATERIAL
function CreateRole() {
  const client = useSelector((state) => state.auth.login.client);
  const user = useSelector((state) => state.auth.login.user);
  const [vendorList, setVendorList] = useState([]);
  const [paymentMethodsList, setPaymentMethodsList] = useState([]);
  const [puchasedInvoice, setPuchasedInvoice] = useState(
    useSelector((state) => state.updatescreens.puchasedInvoice)
  );
  const [warehousesList, setWarehousesList] = useState([]);
  const [invoiceLines, setInvoiceLines] = useState([]);
  const [fAccountList, setFAccountList] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [date, setDate] = useState("");
  const [fAccount, setFAccount] = useState("");
  const [paymenout, setPaymenout] = useState("");
  const [pAmount, setPAmount] = useState("");

  useEffect(() => {
    getVendorList();
    getPaymentMethodsList();
    getWarehousesList();
    getFAccountList();
    purchaseInvoiceLineByInvoiceId(puchasedInvoice.id);
  }, []);
  useEffect(() => {
    getPayoutId(puchasedInvoice.id);
  }, [JSON.stringify(puchasedInvoice)]);

  const purchaseInvoiceLineByInvoiceId = (id) => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "purchaseInvoiceLineByInvoiceId",
      data: {
        id,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setInvoiceLines(res.data.object);
    });
  };
  const getVendorList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "vendorList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setVendorList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getPayoutId = (id) => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "paymentOutByInvoice",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        invoice: id,
      },
    };
    getList(payload).then((res) => {
      setPaymenout(res.data.object);
    });
  };
  const getFAccountList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "finAccountsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setFAccountList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getInvoice = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "purchaseInvoiceByID",
      data: {
        id: puchasedInvoice.id,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setPuchasedInvoice(res.data.object);
    });
  };
  const getPaymentMethodsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "paymentMethodsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setPaymentMethodsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const completePurchaseInvoice = (s) => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "completePurchaseInvoice",
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: puchasedInvoice.id,
        actionBtn: s == "DR" ? "CO" : "RE",
      },
    };
    create(payload).then((res) => {
      getInvoice();
    });
  };
  const getWarehousesList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "warehousesList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      setWarehousesList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };

  const purchaseInvoicesById = () => {
    let payload = {
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: puchasedInvoice.id,
      },
      apiname: "purchaseInvoiceByID",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    getList(payload).then((res) => {
      if (res.data.success) {
        setPuchasedInvoice(res.data.object);
      }
    });
  };
  const completeHandler = (v) => {
    let payload = {
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: puchasedInvoice.id,
        actionBtn: v,
      },
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "completePurchaseInvoice",
    };
    create(payload).then((res) => {
      message(res);
      if (res.data.success) {
        purchaseInvoicesById();
      }
    });
  };
  const refundInvoice = (lines) => {
    let data = {
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      invoiceId: puchasedInvoice.id,
      refundLines: lines,
    };
    let payload = {
      data: data,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "refundPurchaseInvoice",
    };
    create(payload).then((res) => {
      message(res);
      getInvoice();

    });
  };
  const submitHandler = (values) => {
    let data = {
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      client: client.clientId,
      invoiceDate: values.invoiceDate,
      payMethod: values.payMethod,
      warehouse: values.warehouse,
      vendor: values.vendor,
      id: puchasedInvoice.id,
    };
    let payload = {
      data: data,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "updatePurchaseInvoice",
    };
    create(payload).then((res) => {
      message(res);

      if (res.data.success) {
        history.push("/dashboard/purchaseinvoicesetup/");
      }
    });
  };
  const makePaymentPopUp = () => {
    // createPaymentOutLine
    let data = {
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      client: client.clientId,
      paymentAmt: pAmount,
      paymentDate: date,
      finAccount: fAccount,
      paymentOut: paymenout.id,
    };
    let payload = {
      data: data,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "createPaymentOutLine",
    };
    create(payload).then((res) => {
      if (res.data.success) {
        setBasicModal(false);
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Purchased Invoice</CardTitle>
        <div>
          <a
            className="mr-1 mb-1 btn btn-primary"
            href={`${api_url1}reports/frameset?__report=purchase_invoice_report.rptdesign&__title=Purchase-invoice&__showtitle=false&invoice_id=${puchasedInvoice.id}`}
            style={{
              borderColor: "rgb(255, 54, 74)",
              backgroundColor: "rgb(255, 54, 74)",
              color: "#fff !important",
              float: "left",
              margin: "20px",
            }}
            target="_blank"
          >
            {" "}
            Invoice Report
          </a>
        </div>
        <div>
          {puchasedInvoice.status == "CO" && (
            <Button.Ripple
              color="primary"
              type="submit"
              className="mr-1 mb-1"
              onClick={() => setBasicModal(true)}
            >
              <p>{"Make Payments"}</p>
            </Button.Ripple>
          )}
          {puchasedInvoice.status == "DR" ? (
            <Button.Ripple
              color="primary"
              type="submit"
              className="mr-1 mb-1"
              onClick={() => completePurchaseInvoice(puchasedInvoice.status)}
            >
              <p>
                {puchasedInvoice.status == "DR"
                  ? "Complete"
                  : puchasedInvoice.status == "CO"
                  ? "Reactive"
                  : ""}
              </p>
            </Button.Ripple>
          ) : (
            <></>
          )}
          {puchasedInvoice.status == "CO" ? (
            <Button.Ripple
              color="primary"
              type="submit"
              className="mr-1 mb-1"
              onClick={() =>
                refundInvoice(
                  invoiceLines.map((i) => {
                    return { refundQty: i.qty, lineId: i.id };
                  })
                )
              }
            >
              <p>{"Refund Invoice"}</p>
            </Button.Ripple>
          ) : (
            <></>
          )}
        </div>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>
            Make Payment
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col md="12" sm="12">
                <FormGroup className="form-label-group">
                  <Flatpickr
                    className="form-control"
                    value={date}
                    onChange={(date) => {
                      setDate(moment(date[0]).format("YYYY-MM-DD"));
                    }}
                  />
                  <Label for="invoiceDate">Select Date</Label>
                </FormGroup>
              </Col>
              <Col md="12" sm="12">
                <FormGroup className="form-label-group">
                  <ReactSelect
                    isMulti={false}
                    options={fAccountList}
                    value={
                      fAccountList
                        ? fAccountList.find(
                            (option) => option.value === fAccount
                          )
                        : ""
                    }
                    onChange={(option) => {
                      setFAccount(option.value);
                    }}
                  />
                  <Label for="fAccount">Select Financial Account</Label>
                </FormGroup>
              </Col>
              <Col md="12" sm="12">
                <FormGroup className="form-label-group">
                  <CustomInput
                    type="number"
                    name="pAmount"
                    value={pAmount}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setPAmount(e.target.value);
                    }}
                  />
                  <Label for="pAmount">Enter Amount</Label>
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => makePaymentPopUp()}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            invoiceDate: puchasedInvoice.invoiceDate,
            payMethod: puchasedInvoice.payMethod,
            warehouse: puchasedInvoice.warehouse,
            vendor: puchasedInvoice.vendor,
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            submitHandler(values);
            actions.setSubmitting(false);
          }}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <h6>Invoice no:</h6>
                    <p>{puchasedInvoice.documentNo}</p>
                  </FormGroup>
                </Col>

                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <h6>Status</h6>
                    <p>
                      {puchasedInvoice.status == "DR"
                        ? "Drafts"
                        : puchasedInvoice.status == "CO"
                        ? "Complete"
                        : ""}
                    </p>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="invoiceDate"
                      id="invoiceDate"
                      className={`form-control ${
                        errors.invoiceDate &&
                        touched.invoiceDate &&
                        "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <Flatpickr
                          className="form-control"
                          value={field.value}
                          onChange={(date) => {
                            form.setFieldValue(
                              field.name,
                              moment(date[0]).format("YYYY-MM-DD")
                            );
                          }}
                        />
                      )}
                    />
                    {errors.invoiceDate && touched.invoiceDate ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.invoiceDate}
                      </div>
                    ) : null}
                    <Label for="invoiceDate">Invoice Date</Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="payMethod"
                      id="payMethod"
                      className={`form-control ${
                        errors.payMethod && touched.payMethod && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <ReactSelect
                          isMulti={false}
                          options={paymentMethodsList}
                          value={
                            paymentMethodsList
                              ? paymentMethodsList.find(
                                  (option) => option.value === field.value
                                )
                              : ""
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.value);
                          }}
                          error={errors.state}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.payMethod && touched.payMethod ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.payMethod}
                      </div>
                    ) : null}
                    <Label for="payMethod" className="select-label">
                      Payment Methpd
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="warehouse"
                      id="warehouse"
                      className={`form-control ${
                        errors.warehouse && touched.warehouse && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <ReactSelect
                          isMulti={false}
                          options={warehousesList}
                          value={
                            warehousesList
                              ? warehousesList.find(
                                  (option) => option.value === field.value
                                )
                              : ""
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.value);
                          }}
                          error={errors.state}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.warehouse && touched.warehouse ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.warehouse}
                      </div>
                    ) : null}
                    <Label for="warehouse" className="select-label">
                      Warehouse
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="vendor"
                      id="vendor"
                      className={`form-control ${
                        errors.vendor && touched.vendor && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <ReactSelect
                          isMulti={false}
                          options={vendorList}
                          value={
                            vendorList
                              ? vendorList.find(
                                  (option) => option.value === field.value
                                )
                              : ""
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.value);
                          }}
                          error={errors.state}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.vendor && touched.vendor ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.vendor}
                      </div>
                    ) : null}
                    <Label for="vendor" className="select-label">
                      Vendor
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <h6>Total Net Amount:</h6>
                    <p>{puchasedInvoice.totalNet}</p>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <h6>Total Gross Amount:</h6>
                    <p>{puchasedInvoice.totalGross}</p>
                  </FormGroup>
                </Col>
                <Col sm="12">
                  <FormGroup className="form-label-group">
                    <Button.Ripple
                      color="primary"
                      type="submit"
                      className="mr-1 mb-1"
                    >
                      Submit
                    </Button.Ripple>
                    <Button.Ripple
                      outline
                      color="warning"
                      type="reset"
                      className="mb-1"
                      onClick={() =>
                        history.push("/dashboard/purchaseinvoicesetup/")
                      }
                    >
                      Cancel
                    </Button.Ripple>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </CardBody>
      <Tabs
        invoice={puchasedInvoice.id}
        warehouse={puchasedInvoice.warehouse}
        getInvoice={() => getInvoice()}
      />
    </Card>
  );
}

export default CreateRole;
