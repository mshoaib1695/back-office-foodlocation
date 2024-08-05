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
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { history } from "../../history";
import { create, getList } from "../../API_Helpers/api";
import ReactSelect from "react-select";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import { toast } from "react-toastify";
import message from "../../API_Helpers/toast";
import { off } from "superagent";

const formSchema = Yup.object().shape({
  nameAr: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  offerCategory: Yup.string().required("Required"),
  buyQty: Yup.string().required("Required"),
  getQty: Yup.string().required("Required"),
});

function UpdateOffer() {
  const client = useSelector((state) => state.auth.login.client);
  const user = useSelector((state) => state.auth.login.user);
  const [finAccountsList, setPaymentMethodsList] = useState([]);
  const [offer, setOffer] = useState(
    useSelector((state) => state.updatescreens.transfer)
  );

  useEffect(() => {
    fetch({ pageSize: 10, page: 0 });
    getProductsList();
  }, []);
  const getProductsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "finAccountsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        paraType: "OFFER_TYPES",
      },
    };
    getList(payload).then((res) => {
      message(res);
      setPaymentMethodsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  // const submitHandler = (values) => {
  //     let payload = {
  //         data: {
  //             lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
  //             senderId: values.senderId,
  //             details: values.details,
  //             receiverId: values.receiverId,
  //             amount: values.amount,
  //             clientId: client.clientId,
  //         },
  //         tokenType: user.tokenType,
  //         accessToken: user.accessToken,
  //         apiname: "updateOfferType"
  //     }
  //     create(payload)
  //         .then(res => {
  //             message(res)
  //             if (res.data.success) {
  //                 history.push('/dashboard/transfer-accounts')
  //             }
  //         })
  // }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Transfer</CardTitle>
        <Button.Ripple
          onClick={() => {
            history.push("/dashboard/transfer-accounts");
          }}
        >
          {" "}
          Back
        </Button.Ripple>
      </CardHeader>
      <CardBody>
        <Formik
          initialValues={{
            senderId: offer.senderName,
            receiverId: offer.reciverName,
            senderNameEn: offer.senderNameEn,
            reciverNameEn: offer.reciverNameEn,
            amount: offer.amount,
            details: offer.details,
            amount: offer.transferAmount,
          }}
          validationSchema={formSchema}
          onSubmit={(values, actions) => {
            // submitHandler(values);
            actions.setSubmitting(false);
          }}
        >
          {({ errors, touched, values }) => (
            <Form>
              <Row>
                {/* <Col md="6" sm="12">
                                  <FormGroup className="form-label-group">
                                      <Field
                                          name="senderId"
                                          id="senderId"
                                          className={`form-control ${errors.senderId &&
                                              touched.senderId && "is-invalid"}`}
                                          component={({ field, form }) =>
                                          <>
                                          {
                                              finAccountsList ? finAccountsList.find(option => option.value === field.value) : ''                  
                                          }
                                          </>}
                          //   <ReactSelect
                                            //       isMulti={false}
                                            //       options={finAccountsList}
                                            //       value={finAccountsList ? finAccountsList.find(option => option.value === field.value) : ''}
                                            //       onChange={(option) => {
                                            //           if(option.value !== values.receiverId){
                                            //               form.setFieldValue(field.name, option.value)
                                            //           }
                                                      
                                            //       }}
                                            //       error={errors.state}
                                            //       onBlur={field.onBlur}
                                            //   />}
                                      />
                                      {errors.senderId && touched.senderId ? (
                                          <div className="invalid-tooltip mt-25">{errors.senderId}</div>
                                      ) : null}
                                      <Label for="senderId" className="select-label">Sender Financial Account</Label>
                                  </FormGroup>
                              </Col>
                              <Col md="6" sm="12">
                                  <FormGroup className="form-label-group">
                                      <Field
                                          name="receiverId"
                                          id="receiverId"
                                          className={`form-control ${errors.receiverId &&
                                              touched.receiverId && "is-invalid"}`}
                                              disabled
                                          component={({ field, form }) =>
                                              <ReactSelect
                                                  isMulti={false}
                                                  disabled
                                                  options={finAccountsList}
                                                  value={finAccountsList ? finAccountsList.find(option => option.value === field.value) : ''}
                                                  onChange={(option) => {
                                                      if(option.value !== values.senderId){
                                                          form.setFieldValue(field.name, option.value)
                                                      }
                                                      
                                                  }}
                                                  error={errors.state}
                                                  onBlur={field.onBlur}
                                              />}
                                      />
                                      <Label for="receiverId" className="select-label">Receiver Financial Account</Label>
                                      {errors.receiverId && touched.receiverId ? (
                                          <div className="invalid-tooltip mt-25">{errors.receiverId}</div>
                                      ) : null}
                                  </FormGroup>
                              </Col> */}

                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="senderId"
                      id="senderId"
                      className={`form-control ${
                        errors.senderId && touched.senderId && "is-invalid"
                      }`}
                    />
                    {errors.senderId && touched.senderId ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.senderId}
                      </div>
                    ) : null}
                    <Label for="senderId">Sender Name Arabic</Label>
                  </FormGroup>
                </Col>
                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="senderNameEn"
                      id="senderNameEn"
                      className={`form-control ${
                        errors.senderNameEn &&
                        touched.senderNameEn &&
                        "is-invalid"
                      }`}
                    />
                    {errors.senderNameEn && touched.senderNameEn ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.senderNameEn}
                      </div>
                    ) : null}
                    <Label for="senderNameEn">Sender</Label>
                  </FormGroup>
                </Col>
                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="receiverId"
                      id="receiverId"
                      className={`form-control ${
                        errors.receiverId && touched.receiverId && "is-invalid"
                      }`}
                    />
                    {errors.receiverId && touched.receiverId ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.receiverId}
                      </div>
                    ) : null}
                    <Label for="receiverId">Receiver Name Arabic</Label>
                  </FormGroup>
                </Col>
                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="reciverNameEn"
                      id="reciverNameEn"
                      className={`form-control ${
                        errors.reciverNameEn &&
                        touched.reciverNameEn &&
                        "is-invalid"
                      }`}
                    />
                    {errors.reciverNameEn && touched.reciverNameEn ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.reciverNameEn}
                      </div>
                    ) : null}
                    <Label for="reciverNameEn">Receiver</Label>
                  </FormGroup>
                </Col>
                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="amount"
                      id="amount"
                      className={`form-control ${
                        errors.amount && touched.amount && "is-invalid"
                      }`}
                    />
                    {errors.amount && touched.amount ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.amount}
                      </div>
                    ) : null}
                    <Label for="amount">Amount</Label>
                  </FormGroup>
                </Col>
                <Col md="4" sm="12">
                  <FormGroup className="form-label-group">
                    <Field
                      name="details"
                      id="details"
                      className={`form-control ${
                        errors.details && touched.details && "is-invalid"
                      }`}
                    />
                    {errors.details && touched.name ? (
                      <div className="invalid-tooltip mt-25">
                        {errors.details}
                      </div>
                    ) : null}
                    <Label for="details">Details</Label>
                  </FormGroup>
                </Col>

                {/* 
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
                                          onClick={() => history.push("/dashboard/offers/")}
                                      >
                                          Cancel
                                      </Button.Ripple>
                                  </FormGroup>
                              </Col> */}
              </Row>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
}

export default UpdateOffer;
