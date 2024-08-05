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
import { rowmaterialReducer } from '../../redux/reducers/updatescreens/role'


function CreateVendor() {
    const refund = useSelector(state => state.updatescreens.refund)
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [refundById, setRefundById] = useState(useSelector(state => state.updatescreens.refund))

    useEffect(() => {
        getRefundById()
    }, [refund])


    const getRefundById = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "getRefundById",
            data: {
                refundId: refund.refund_id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
        .then(res => { message(res)
                if(res.data.length){
                    setRefundById(res.data[0])
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Refund </CardTitle>
                     <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/Refunds")}
                >
                   Back
                  </Button.Ripple>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        customer: refundById.customer,
                        documentNo: refundById.documentNo,
                        refundDate: refundById.refundDate,
                        totalBeforeRefund: refundById.totalBeforeRefund,
                        totalAfterRefund: refundById.totalAfterRefund,
                        refundAmount: refundById.refundAmount,
                        totatRefundsOfOrder: refundById.totatRefundsOfOrder                        
                    }}
                    onSubmit={(values, actions) => {
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values, ...propsss }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="documentNo"
                                            name="documentNo"
                                            id="documentNo"
                                            value={refundById.documentNo}
                                            className={`form-control ${errors.name &&
                                                touched.documentNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.documentNo && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.documentNo}</div>
                                        ) : null}
                                        <Label for="documentNo">No.</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="orderDate"
                                            name="orderDate"
                                            id="orderDate"
                                            value={moment(refundById.orderDate).format('LLL')}
                                            className={`form-control ${errors.name &&
                                                touched.orderDate &&
                                                "is-invalid"}`}
                                        />
                                        {errors.orderDate && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.orderDate}</div>
                                        ) : null}
                                        <Label for="orderDate">Order Date</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="refundDate"
                                            name="refundDate"
                                            id="refundDate"
                                            value={moment(refundById.refundDate).format('LLL')}
                                            className={`form-control ${errors.name &&
                                                touched.refundDate &&
                                                "is-invalid"}`}
                                        />
                                        {errors.refundDate && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.refundDate}</div>
                                        ) : null}
                                        <Label for="refundDate">Refund Date</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="refundAmount"
                                            name="refundAmount"
                                            id="refundAmount"
                                            value={refundById.refundAmount}
                                            className={`form-control ${errors.name &&
                                                touched.refundAmount &&
                                                "is-invalid"}`}
                                        />
                                        {errors.refundAmount && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.refundAmount}</div>
                                        ) : null}
                                        <Label for="refundAmount">Refund Amount</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="totalAfterRefund"
                                            name="totalAfterRefund"
                                            id="totalAfterRefund"
                                            value={refundById.totalAfterRefund}
                                            className={`form-control ${errors.name &&
                                                touched.totalAfterRefund &&
                                                "is-invalid"}`}
                                        />
                                        {errors.totalAfterRefund && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.totalAfterRefund}</div>
                                        ) : null}
                                        <Label for="totalAfterRefund">Total After Refund </Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="totalBeforeRefund"
                                            name="totalBeforeRefund"
                                            id="totalBeforeRefund"
                                            value={refundById.totalBeforeRefund}
                                            className={`form-control ${errors.name &&
                                                touched.totalBeforeRefund &&
                                                "is-invalid"}`}
                                        />
                                        {errors.totalBeforeRefund && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.totalBeforeRefund}</div>
                                        ) : null}
                                        <Label for="totalBeforeRefund">Total Before Refund </Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="totatRefundsOfOrder"
                                            name="totatRefundsOfOrder"
                                            id="totatRefundsOfOrder"
                                            value={refundById.totatRefundsOfOrder}
                                            className={`form-control ${errors.name &&
                                                touched.totatRefundsOfOrder &&
                                                "is-invalid"}`}
                                        />
                                        {errors.totatRefundsOfOrder && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.totatRefundsOfOrder}</div>
                                        ) : null}
                                        <Label for="totatRefundsOfOrder">Total Refund </Label>
                                    </FormGroup>
                                </Col>
                                {/* <Col sm="12">
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
                                </Col> */}
                            </Row>
                        </Form>
                    )}
                </Formik>
            </CardBody>
        </Card>
    )
}


export default CreateVendor