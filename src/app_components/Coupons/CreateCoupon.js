import { func } from 'prop-types'
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
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    couponNo: Yup.string().required("Required"),
    discountType: Yup.string().required("Required"),
    fromDate: Yup.string().required("Required"),
    toDate: Yup.string().required("Required"),
    noOfTimeUse: Yup.number().required("Required"),
})

function CreateCoupon() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const discountTypes = [{ value: "A", label: "Amount" }, { value: "P", label: "Percentage" }]
    const submitHandler = (values) => {
        let payload = {
           data:{
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            couponNo: values.couponNo,
            discountType: values.discountType,
            noOfTimeUse: values.noOfTimeUse,
            fromDate: values.fromDate,
            toDate: values.toDate,
           },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createCoupon"
        }
        if(values.discountAmt){
            payload.data.discountAmt= values.discountAmt
       }
       if(values.discountPtg){
            payload.data.discountPtg= values.discountPtg
       }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/couponsetup/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Coupon</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        couponNo: "",
                        discountType: "",
                        fromDate: "",
                        toDate: "",
                        discountAmt: "",
                        discountPtg: "",
                        noOfTimeUse: "",
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        if(values.discountType == "P"){
                            if(values.discountPtg == ""){
                                actions.setFieldError("discountPtg", "Required")
                            }
                        }
                        if(values.discountType == "A"){
                            if(values.discountAmt == ""){
                                actions.setFieldError("discountAmt", "Required")
                            }
                        }
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched ,values, ...propsss}) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    {}
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="couponNo"
                                            name="couponNo"
                                            id="couponNo"
                                            className={`form-control ${errors.couponNo &&
                                                touched.couponNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.couponNo && touched.couponNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.couponNo}</div>
                                        ) : null}
                                        <Label for="couponNo">Coupon No</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="discountType"
                                            id="discountType"
                                            className={`form-control ${errors.discountType &&
                                                touched.discountType && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={discountTypes}
                                                    value={discountTypes ? discountTypes.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                     
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.discountType && touched.discountType ? (
                                            <div className="invalid-tooltip mt-25">{errors.discountType}</div>
                                        ) : null}
                                        <Label for="discountType">Discount Type</Label>
                                    </FormGroup>
                                </Col>

                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="fromDate"
                                            id="fromDate"
                                            className={`form-control ${errors.fromDate &&
                                                touched.fromDate && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("YYYY-MM-DD"))
                                                    }}
                                                />}
                                        />
                                        {errors.fromDate && touched.fromDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.fromDate}</div>
                                        ) : null}
                                        <Label for="fromDate">From  Date</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="toDate"
                                            id="toDate"
                                            className={`form-control ${errors.toDate &&
                                                touched.toDate && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        dateFormat: "Y-m-d",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("YYYY-MM-DD"))
                                                    }}
                                                />}
                                        />
                                        {errors.toDate && touched.toDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.toDate}</div>
                                        ) : null}
                                        <Label for="toDate">To  Date</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={values.discountType == "A" ? true : false}
                                            type="discountPtg"
                                            name="discountPtg"
                                            id="discountPtg"
                                            className={`form-control ${errors.discountPtg &&
                                                touched.discountPtg &&
                                                "is-invalid"}`}
                                        />
                                        {errors.discountPtg && touched.discountPtg ? (
                                            <div className="invalid-tooltip mt-25">{errors.discountPtg}</div>
                                        ) : null}
                                        <Label for="discountPtg">Discount Percentage</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={values.discountType == "P" ? true : false}
                                            type="discountAmt"
                                            name="discountAmt"
                                            id="discountAmt"
                                            className={`form-control ${errors.discountAmt &&
                                                touched.discountAmt &&
                                                "is-invalid"}`}
                                        />
                                        {errors.discountAmt && touched.discountAmt ? (
                                            <div className="invalid-tooltip mt-25">{errors.discountAmt}</div>
                                        ) : null}
                                        <Label for="discountAmt">Discount Amount</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="noOfTimeUse"
                                            name="noOfTimeUse"
                                            id="noOfTimeUse"
                                            className={`form-control ${errors.noOfTimeUse &&
                                                touched.noOfTimeUse &&
                                                "is-invalid"}`}
                                        />
                                        {errors.noOfTimeUse && touched.noOfTimeUse ? (
                                            <div className="invalid-tooltip mt-25">{errors.noOfTimeUse}</div>
                                        ) : null}
                                        <Label for="noOfTimeUse">No. Of Times Use</Label></FormGroup>
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
                                            onClick={() => history.push("/dashboard/couponsetup/")}
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


export default CreateCoupon