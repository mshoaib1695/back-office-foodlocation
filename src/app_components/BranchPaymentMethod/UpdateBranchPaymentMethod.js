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
    Label,
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { create, getList } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    payMethod: Yup.string().required("Required"),
    currentfinAccount: Yup.string().required("Required"),
    closefinAccount: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [paymentMethodsList, setPaymentMethodsList] = useState([])
    const [finAccountsList, setFinAccountsList] = useState([])
    const branchPayMethd = useSelector(state => state.updatescreens.branchPayMethd)

    useEffect(() => {
        getPaymentMethodsList()
        getFinAccountsList()
    }, [])
    const getPaymentMethodsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "paymentMethodsList",
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
                client: client.clientId,
                branch: props.branchId,
                name: values.name,
                nameAr: values.nameAr,
                payMethod: values.payMethod,
                currentfinAccount: values.currentfinAccount,
                closefinAccount: values.closefinAccount,
                id:branchPayMethd.id
            },
            apiname: "updateBranchPayMethod",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        create(payload)
            .then(res => { message(res)

                message(res)
                if (res.data.success) {
                    props.goToSetup()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Branch Payment Method</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: branchPayMethd.name,
                        nameAr: branchPayMethd.nameAr,
                        payMethod: branchPayMethd.payMethod,
                        currentfinAccount: branchPayMethd.currentfinAccount,
                        closefinAccount: branchPayMethd.closefinAccount,
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
                                        <Label for="name">Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="nameAr"
                                            name="nameAr"
                                            id="nameAr"
                                            className={`form-control ${errors.nameAr &&
                                                touched.nameAr &&
                                                "is-invalid"}`}
                                        />
                                        {errors.nameAr && touched.nameAr ? (
                                            <div className="invalid-tooltip mt-25">{errors.nameAr}</div>
                                        ) : null}
                                        <Label for="nameAr">Arabic Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="payMethod"
                                            id="payMethod"
                                            className={`form-control ${errors.payMethod &&
                                                touched.payMethod && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={paymentMethodsList}
                                                    value={paymentMethodsList ? paymentMethodsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.payMethod && touched.payMethod ? (
                                            <div className="invalid-tooltip mt-25">{errors.payMethod}</div>
                                        ) : null}
                                        <Label for="payMethod" className="select-label">Payment Method</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="currentfinAccount"
                                            id="currentfinAccount"
                                            className={`form-control ${errors.currentfinAccount &&
                                                touched.currentfinAccount && "is-invalid"}`}
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
                                        {errors.currentfinAccount && touched.currentfinAccount ? (
                                            <div className="invalid-tooltip mt-25">{errors.currentfinAccount}</div>
                                        ) : null}
                                        <Label for="currentfinAccount" className="select-label">Current Financial Account</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="closefinAccount"
                                            id="closefinAccount"
                                            className={`form-control ${errors.closefinAccount &&
                                                touched.closefinAccount && "is-invalid"}`}
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
                                        {errors.closefinAccount && touched.closefinAccount ? (
                                            <div className="invalid-tooltip mt-25">{errors.closefinAccount}</div>
                                        ) : null}
                                        <Label for="closefinAccount" className="select-label">Close Financial Account</Label>
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
    )
}


export default CreateProductOffer