import { func, number } from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Row,
    Col,
    FormGroup,
    Label
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Flatpickr from "react-flatpickr";
import moment from 'moment'
import { gridDataByClient, getList, parametersListByParaType } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    phoneNo: Yup.number().required("Required"),
    country: Yup.string().required("Required"),
    city: Yup.string().required("Required"),

})

function CreateVendor() {
    const vendor = useSelector(state => state.updatescreens.vendor)
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [countries, seCountries] = useState([])
    const [cities, setCities] = useState([])
    const discountTypes = [{ value: "A", label: "Amount" }, { value: "P", label: "Percentage" }]
    useEffect(() => {
        getCountries()
    }, [])
    const getCountries = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "COUNTRY",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                seCountries(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getCities = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParent",
            data: {
                parent: id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setCities(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                city: values.city,
                country: values.country,
                email: values.email,
                flatNo: values.flatNo,
                name: values.name,
                phoneNo: values.phoneNo,
                street: values.street,
                building: values.building,
                taxNo: values.taxNo,
                id: vendor.id
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateVendor"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/vendorsetup")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Vendor</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: vendor.name,
                        phoneNo: vendor.phoneNo,
                        email: vendor.email,
                        country: vendor.country,
                        city: vendor.city,
                        flatNo: vendor.flatNo,
                        street: vendor.street,
                        building: vendor.building,
                        taxNo: vendor.taxNo,
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values, ...propsss }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="name"
                                            name="name"
                                            id="name"
                                            className={`form-control ${errors.name &&
                                                touched.name &&
                                                "is-invalid"}`}
                                        />
                                        {errors.name && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.name}</div>
                                        ) : null}
                                        <Label for="name">Vendor Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="phoneNo"
                                            name="phoneNo"
                                            id="phoneNo"
                                            className={`form-control ${errors.phoneNo &&
                                                touched.phoneNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.phoneNo && touched.phoneNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.phoneNo}</div>
                                        ) : null}
                                        <Label for="phoneNo">Phone number</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={`form-control ${errors.email &&
                                                touched.email &&
                                                "is-invalid"}`}
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="invalid-tooltip mt-25">{errors.email}</div>
                                        ) : null}
                                        <Label for="name">Email</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="country"
                                            id="country"
                                            className={`form-control ${errors.country &&
                                                touched.country && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={countries}
                                                    value={countries ? countries.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        getCities(option.value)
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.country && touched.country ? (
                                            <div className="invalid-tooltip mt-25">{errors.country}</div>
                                        ) : null}
                                        <Label for="country"> Select Country</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="city"
                                            id="city"
                                            className={`form-control ${errors.city &&
                                                touched.city && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={cities}
                                                    value={cities ? cities.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.city && touched.city ? (
                                            <div className="invalid-tooltip mt-25">{errors.city}</div>
                                        ) : null}
                                        <Label for="city"> Select City</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="flatNo"
                                            name="flatNo"
                                            id="flatNo"
                                            className={`form-control ${errors.flatNo &&
                                                touched.flatNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.flatNo && touched.flatNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.flatNo}</div>
                                        ) : null}
                                        <Label for="flatNo">Flat No.</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="street"
                                            name="street"
                                            id="street"
                                            className={`form-control ${errors.street &&
                                                touched.street &&
                                                "is-invalid"}`}
                                        />
                                        {errors.street && touched.street ? (
                                            <div className="invalid-tooltip mt-25">{errors.street}</div>
                                        ) : null}
                                        <Label for="street">Street</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="building"
                                            name="building"
                                            id="building"
                                            className={`form-control ${errors.building &&
                                                touched.building &&
                                                "is-invalid"}`}
                                        />
                                        {errors.building && touched.building ? (
                                            <div className="invalid-tooltip mt-25">{errors.building}</div>
                                        ) : null}
                                        <Label for="building">Building</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="taxNo"
                                            name="taxNo"
                                            id="taxNo"
                                            className={`form-control ${errors.taxNo &&
                                                touched.taxNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.taxNo && touched.taxNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.taxNo}</div>
                                        ) : null}
                                        <Label for="taxNo">Tax No.</Label>
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
                                            onClick={() => history.push("/dashboard/vendorsetup/")}
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


export default CreateVendor