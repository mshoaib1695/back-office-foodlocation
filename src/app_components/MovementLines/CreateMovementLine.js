import React, { useState, useEffect } from "react";
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
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { create, getList } from "../../API_Helpers/api";
import ReactSelect from "react-select";
import message from "../../API_Helpers/toast";

const formSchema = Yup.object().shape({
  qty: Yup.string().required("Required"),
  uom: Yup.string().required("Required"),
  srcWarehouse: Yup.string().required("Required"),
  destWarehouse: Yup.string().required("Required"),
  product: Yup.string().required("Required"),
});

function CreateProductOffer(props) {
  const client = useSelector((state) => state.auth.login.client);
  const user = useSelector((state) => state.auth.login.user);
  const [productsList, setProductsList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [uomsList, setUomsList] = useState([]);

  useEffect(() => {
    fetch({ pageSize: 10, page: 0 });
    getUomsList();
    getWarehousesList();
    getProductsList();
  }, []);
  const getProductsList = () => {
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

      setProductsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getWarehousesList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "warehousesList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setWarehousesList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getUomsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "uomsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setUomsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const submitHandler = (values) => {
    let payload = {
      data: {
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        client: client.clientId,
        qty: values.qty,
        movement: props.movementId,
        qty: values.qty,
        uom: values.uom,
        srcWarehouse: values.srcWarehouse,
        destWarehouse: values.destWarehouse,
        product: values.product,
      },

      apiname: "createMovementLine",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    create(payload).then((res) => {
      message(res);

      if (res.data.success) {
        props.goToSetup();
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Movement Line</CardTitle>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            qty: "",
            product: "",
            uom: "",
            srcWarehouse: "",
            destWarehouse: "",
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
                    <p>Movement Line no</p>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      type="qty"
                      name="qty"
                      id="qty"
                      className={`form-control ${
                        errors.qty && touched.qty && "is-invalid"
                      }`}
                    />
                    {errors.qty && touched.qty ? (
                      <div className="invalid-tooltip mt-25">{errors.qty}</div>
                    ) : null}
                    <Label for="qty">Quantity</Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="product"
                      id="product"
                      className={`form-control ${
                        errors.product && touched.product && "is-invalid"
                      }`}
                      component={({ field, form }) => (
                        <ReactSelect
                          isMulti={false}
                          options={productsList}
                          value={
                            productsList
                              ? productsList.find(
                                  (option) => option.value === field.value
                                )
                              : ""
                          }
                          onChange={(option) => {
                            form.setFieldValue(field.name, option.value);
                            let payload = {
                              tokenType: user.tokenType,
                              accessToken: user.accessToken,
                              apiname: "productByID",
                              data: {
                                id: option.value,
                                clientId: client.clientId,
                                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                              },
                            };
                            getList(payload).then((res) => {
                              form.setFieldValue(
                                "uom",
                                res.data.object.baseUom
                              );
                            });
                          }}
                          error={errors.state}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.product && touched.product ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.product}
                      </div>
                    ) : null}
                    <Label for="product" className="select-label">
                      {" "}
                      Product
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      type="uom"
                      name="uom"
                      id="uom"
                      value={
                        uomsList
                          ? uomsList.find(
                              (option) => option.value === values.uom
                            )?.label
                          : ""
                      }
                      disabled
                      className={`form-control ${
                        errors.uom && touched.uom && "is-invalid"
                      }`}
                    />
                    {/* <Field
                                            name="uom"
                                            id="uom"
                                            className={`form-control ${errors.uom &&
                                                touched.uom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={uomsList}
                                                    value={uomsList ? uomsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.uom && touched.uom ? (
                                            <div className="invalid-tooltip mt-25">{errors.uom}</div>
                                        ) : null} */}
                    <Label for="uom" className="select-label">
                      {" "}
                      UOM
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="srcWarehouse"
                      id="srcWarehouse"
                      className={`form-control ${
                        errors.srcWarehouse &&
                        touched.srcWarehouse &&
                        "is-invalid"
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
                    {errors.srcWarehouse && touched.srcWarehouse ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.srcWarehouse}
                      </div>
                    ) : null}
                    <Label for="srcWarehouse" className="select-label">
                      {" "}
                      Source Warehouse
                    </Label>
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="destWarehouse"
                      id="destWarehouse"
                      className={`form-control ${
                        errors.destWarehouse &&
                        touched.destWarehouse &&
                        "is-invalid"
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
                    {errors.destWarehouse && touched.destWarehouse ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.destWarehouse}
                      </div>
                    ) : null}
                    <Label for="destWarehouse" className="select-label">
                      {" "}
                      Destination Warehouse
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
                      onClick={() => props.goToSetup()}
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
    </Card>
  );
}

export default CreateProductOffer;
