import React, { useState, useEffect } from "react";
import { functions } from "lodash";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { postWithPrams } from "../../API_Helpers/api";

const formSchema = Yup.object().shape({
  password: Yup.string().required("Password is required"),
  matchPass: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ),
});

function Profile() {
  const user = useSelector((state) => state.auth.login.user);
  const [msg, setMsg] = useState("");
  const [isTrue, setIsTrue] = useState(false);

  const submitHandler = (values) => {
    let payload = {
      data: {
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        userId: user.userId,
        newPassword: values.password,
        confirmedPassword: values.matchPass,
      },
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "updatePassword",
    };
    postWithPrams(payload).then((res) => {
      setMsg(res.data.message);
      setIsTrue(res.data.success);
    });
  };
  return (
    <>
      <Row>
        <Col md="6" sm="12">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
            </CardHeader>
            <CardBody>
              <Formik
                initialValues={{
                  password: "",
                  matchPass: "",
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
                      <Col md="12" sm="12">
                        <FormGroup className="form-label-group">
                          <Field
                            type="password"
                            name="password"
                            id="namepasswordAr"
                            className={`form-control ${
                              errors.password &&
                              touched.password &&
                              "is-invalid"
                            }`}
                          />
                          {errors.password && touched.password ? (
                            <div className="invalid-tooltip mt-25">
                              {errors.password}
                            </div>
                          ) : null}
                          <Label for="password">Password</Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12">
                        <FormGroup className="form-label-group">
                          <Field
                            type="password"
                            name="matchPass"
                            id="matchPass"
                            className={`form-control ${
                              errors.matchPass &&
                              touched.matchPass &&
                              "is-invalid"
                            }`}

                          />
                          {errors.matchPass && touched.matchPass ? (
                            <div className="invalid-tooltip mt-25">
                              {errors.matchPass}
                            </div>
                          ) : null}
                          <Label for="matchPass">Re-type Password</Label>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12">
                        {msg ? (
                          <Row>
                            <Col md="12" sm="12">
                              {setIsTrue ? <p style={{
                                    color: '#056505',
                                    fontWeight: "bold"
                              }}>{msg}</p> : <p style={{
                                    color: '#b90b0b',
                                    fontWeight: "bold"
                              }}> {msg}</p>}
                            </Col>
                          </Row>
                        ) : (
                          <></>
                        )}
                        <FormGroup className="form-label-group">
                          <Button.Ripple
                            color="primary"
                            type="submit"
                            block
                            className="block"
                          >
                            Save
                          </Button.Ripple>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
