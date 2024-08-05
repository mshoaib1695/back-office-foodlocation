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
import { create, getList } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'



const formSchema = Yup.object().shape({
    description: Yup.string().required("Required"),
    paymentAmt: Yup.string().required("Required"),
    payReason: Yup.string().required("Required"),
    finAccount: Yup.string().required("Required"),
    paymentDate: Yup.string().required("Required"),
})

function CreatePaymentReason() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [PaymentReasonsList, setPaymentMethodsList] = useState([])
    const [finAccountsList, setFinAccountsList] = useState([])
    const [payExpese, setPayExpese] = useState(useSelector(state => state.updatescreens.payExpese))

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getPaymentReasonsList()
        getFinAccountsList()
        payExpenseID()
    }, [])

    const payExpenseID = () => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: payExpese.id,
            },
            apiname:"payExpenseByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                if(res.data.success){
                    setPayExpese(res.data.object)
                }
        })
    }
    const getPaymentReasonsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "paymentReasonsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setPaymentMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getFinAccountsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "finAccountsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setFinAccountsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                payReason: values.payReason,
                finAccount: values.finAccount,
                paymentAmt: values.paymentAmt,
                description: values.description,
                paymentDate: values.paymentDate,
                client: client.clientId,
                id: payExpese.id
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updatePayExpense"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/payexpenses/")
                }
            })
    }
    const completeHandler = (v) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",               
                id: payExpese.id,
                actionBtn: v
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "completePayExpense"
        }
        create(payload)
            .then(res => { message(res)

                message(res)
                if (res.data.success) {
                    payExpenseID()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Pay Expence</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => completeHandler(payExpese.actionBtn) }
                >
                    {
                        payExpese.actionBtn == "CO" ? "Complete"
                        : "Reactive" 

                    }
                  </Button.Ripple>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        payReason: payExpese.payReason,
                        finAccount: payExpese.finAccount,
                        description: payExpese.description,
                        paymentAmt: payExpese.paymentAmt,
                        paymentDate: moment(payExpese.paymentDate).format("YYYY-MM-DD"),
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        if(payExpese.actionBtn == "CO" ){
                            submitHandler(values);
                            actions.setSubmitting(false);
                        }
                    }}

                >
                    {({ errors, touched }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Pay Expense Invoice no.</p>
                                        <p>{payExpese.documentNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status</p>
                                        <p>{payExpese.status  == "CO" ?
                                                "Complete" : payExpese.status == "DR"
                                                    ? "Drafts" : ""}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="paymentDate"
                                            id="paymentDate"
                                            className={`form-control ${errors.paymentDate &&
                                                touched.paymentDate && "is-invalid"}`}
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
                                        {errors.paymentDate && touched.paymentDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.paymentDate}</div>
                                        ) : null}
                                        <Label for="paymentDate">Payment Date</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="payReason"
                                            id="payReason"
                                            className={`form-control ${errors.payReason &&
                                                touched.payReason && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={PaymentReasonsList}
                                                    value={PaymentReasonsList ? PaymentReasonsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.payReason && touched.payReason ? (
                                            <div className="invalid-tooltip mt-25">{errors.payReason}</div>
                                        ) : null}
                                        <Label for="payReason" className="select-label">Payment Reason</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="finAccount"
                                            id="finAccount"
                                            className={`form-control ${errors.finAccount &&
                                                touched.finAccount && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={finAccountsList}
                                                    value={finAccountsList ? finAccountsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.finAccount && touched.finAccount ? (
                                            <div className="invalid-tooltip mt-25">{errors.finAccount}</div>
                                        ) : null}
                                        <Label for="finAccount" className="select-label">Financial Account</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="paymentAmt"
                                            id="paymentAmt"
                                            className={`form-control ${errors.paymentAmt &&
                                                touched.paymentAmt &&
                                                "is-invalid"}`}
                                        />
                                        {errors.paymentAmt && touched.paymentAmt ? (
                                            <div className="invalid-tooltip mt-25">{errors.paymentAmt}</div>
                                        ) : null}
                                        <Label for="paymentAmt">Pay Amount</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="description"
                                            id="description"
                                            className={`form-control ${errors.description &&
                                                touched.description &&
                                                "is-invalid"}`}
                                        />
                                        {errors.description && touched.description ? (
                                            <div className="invalid-tooltip mt-25">{errors.description}</div>
                                        ) : null}
                                        <Label for="description">Pay Description</Label>
                                    </FormGroup>
                                </Col>
                                <Col sm="12">
                                    <FormGroup className="form-label-group">
                                        {payExpese.actionBtn == "CO"  && <Button.Ripple
                                            color="primary"
                                            type="submit"
                                            className="mr-1 mb-1"
                                        >
                                            Submit
                                        </Button.Ripple>}
                                        <Button.Ripple
                                            outline
                                            color="warning"
                                            type="reset"
                                            className="mb-1"
                                            onClick={() => history.push("/dashboard/payexpenses/")}
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


export default CreatePaymentReason