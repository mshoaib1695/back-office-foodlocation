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
  Input,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { history } from "../../history";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import {
  create,
  getList,
  parametersListByParaType,
} from "../../API_Helpers/api";
import ReactSelect from "react-select";
import Tabs from "./Tabs";
import message from "../../API_Helpers/toast";
import { api_url1 } from "../../assets/constants/api_url";

const formSchema = Yup.object().shape({
  reason: Yup.string().required("Required"),
  maintDate: Yup.string().required("Required"),
  warehouse: Yup.string().required("Required"),
  notes: Yup.string().required("Required"),
});
// ROW_MATERIAL
function CreateRole() {
  const client = useSelector((state) => state.auth.login.client);
  const user = useSelector((state) => state.auth.login.user);
  const [chargeTypeList, setChargeTypeList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [type, setType] = useState(null);
  const [stockMaintanance, setStockMaintanance] = useState(
    useSelector((state) => state.updatescreens.stockMaintanance)
  );
  const [basicModal, setBasicModal] = useState(false);

  useEffect(() => {
    getChargeTypeList();
    getWarehousesList();
    movementID();
  }, []);

  const movementID = () => {
    let payload = {
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: stockMaintanance.id,
      },
      apiname: "stockMaintByID",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    getList(payload).then((res) => {
      if (res.data.success) {
        setStockMaintanance(res.data.object);
      }
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
  const getChargeTypeList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        paraType: "STOCK_MAINT_REASON",
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    parametersListByParaType(payload).then((res) => {
      setChargeTypeList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };

  const submitHandler = (values) => {
    let data = {
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      client: client.clientId,
      warehouse: values.warehouse,
      reason: values.reason,
      notes: values.notes,
      maintDate: values.maintDate,
      id: stockMaintanance.id,
    };

    let payload = {
      data: data,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "updateStockMaint",
    };
    create(payload).then((res) => {
      message(res);
      if (res.data.success) {
        history.push("/dashboard/stockmaintainance/");
      }
    });
  };
  const completeHandler = (v) => {
    let payload = {
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: stockMaintanance.id,
        status: v,
      },
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "completeStockMaint",
    };
    if (v == "CO") {
      payload.data.type = type;
    }
    create(payload).then((res) => {
      message(res);
      setBasicModal(false);
      setType(null);
      if (res.data.success) {
        movementID();
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Stock Maintanance</CardTitle>
        <a
          className="mr-1 mb-1 btn btn-primary"
          href={`${api_url1}reports/frameset?__report=stock_maint_report.rptdesign&__title=Stock-maint-report&__showtitle=false&stock_maint_id=${stockMaintanance.id}`}
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
          Stock Maintanance Report
        </a>
        {stockMaintanance.status == "DR" && (
          <Button.Ripple
            color="primary"
            type="submit"
            className="mr-1 mb-1"
            onClick={(e) => setBasicModal("CO")}
          >
            Complete
          </Button.Ripple>
        )}
        {stockMaintanance.status == "CO" && (
          <Button.Ripple
            color="primary"
            type="submit"
            className="mr-1 mb-1"
            onClick={(e) => completeHandler("RE")}
          >
            Reactive
          </Button.Ripple>
        )}
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            warehouse: stockMaintanance.warehouse,
            reason: stockMaintanance.reason,
            notes: stockMaintanance.notes,
            maintDate: moment(stockMaintanance).format("YYYY-MM.DD"),
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
                    <Field
                      name="maintDate"
                      id="maintDate"
                      className={`form-control ${
                        errors.maintDate && touched.maintDate && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <Flatpickr
                          options={{
                            dateFormat: "Y-m-d",
                          }}
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
                    {errors.maintDate && touched.maintDate ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.maintDate}
                      </div>
                    ) : null}
                    <Label for="maintDate"> Date</Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      type="notes"
                      name="notes"
                      id="notes"
                      className={`form-control ${
                        errors.notes && touched.notes && "is-invalid"
                      }`}
                    />
                    {errors.notes && touched.notes ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.notes}
                      </div>
                    ) : null}
                    <Label for="notes">Notes</Label>
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
                      {" "}
                      Source Warehouse
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="reason"
                      id="reason"
                      className={`form-control ${
                        errors.reason && touched.reason && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <ReactSelect
                          isMulti={false}
                          options={chargeTypeList}
                          value={
                            chargeTypeList
                              ? chargeTypeList.find(
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
                    {errors.reason && touched.reason ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.reason}
                      </div>
                    ) : null}
                    <Label for="reason" className="select-label">
                      {" "}
                      Source Warehouse
                    </Label>
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
                        history.push("/dashboard/stockmaintainance/")
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
      <Tabs stockmaintainanceId={stockMaintanance.id} />
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)}>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>
          Complete
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="12" sm="12">
              <FormGroup className="form-label-group">
                <ReactSelect
                  isMulti={false}
                  options={[
                    { label: "Add", value: "A" },
                    { label: "Subtract", value: "S" },
                  ]}
                  value={[
                    { label: "Add", value: "A" },
                    { label: "Subtract", value: "S" },
                  ].find((option) => option.value === type)}
                  onChange={(option) => {
                    setType(option.value);
                  }}
                />
                <Label for="type" className="select-label">
                  {" "}
                  Select Type
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={type == null}
            onClick={() => type && completeHandler("CO")}
          >
            Submit
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
}

export default CreateRole;
