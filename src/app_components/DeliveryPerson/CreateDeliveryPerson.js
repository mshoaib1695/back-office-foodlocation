import React, { useEffect } from 'react'
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
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'


const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    phoneNo: Yup.number().required("Required"),
    userName: Yup.string().required("Required"),
    password: Yup.string().required("Required"),

})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 })
    }, [])

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                email: values.email,
                phoneNo: values.phoneNo,
                password: values.password,
                userName: values.userName,
                name: values.name,
                client: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createDeliveryPerson"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    history.push('/dashboard/deliveryperson')
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create DeliveryPerson</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        phoneNo: null,
                        userName: '',
                        password: ''
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="name"
                                            id="name"
                                            className={`form-control ${errors.name &&
                                                touched.name &&
                                                "is-invalid"}`}
                                        />
                                        {errors.name && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.name}</div>
                                        ) : null}
                                        <Label for="name">Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="email"
                                            id="email"
                                            className={`form-control ${errors.email &&
                                                touched.email &&
                                                "is-invalid"}`}
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="invalid-tooltip mt-25">{errors.email}</div>
                                        ) : null}
                                        <Label for="email">Message</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="phoneNo"
                                            id="phoneNo"
                                            className={`form-control ${errors.phoneNo &&
                                                touched.phoneNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.phoneNo && touched.phoneNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.phoneNo}</div>
                                        ) : null}
                                        <Label for="phoneNo">Phone No.</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="userName"
                                            id="userName"
                                            className={`form-control ${errors.userName &&
                                                touched.userName &&
                                                "is-invalid"}`}
                                        />
                                        {errors.userName && touched.userName ? (
                                            <div className="invalid-tooltip mt-25">{errors.userName}</div>
                                        ) : null}
                                        <Label for="userName">User Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="password"
                                            id="password"
                                            className={`form-control ${errors.password &&
                                                touched.password &&
                                                "is-invalid"}`}
                                        />
                                        {errors.password && touched.password ? (
                                            <div className="invalid-tooltip mt-25">{errors.password}</div>
                                        ) : null}
                                        <Label for="password">password</Label>
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
                                            onClick={() => history.push("/dashboard/deliveryperson/")}
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
    )
}


export default CreateProduct