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
    Input,
    Label
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { getList, create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import message from '../../API_Helpers/toast'


const formSchema = Yup.object().shape({
    barCode: Yup.string().required("Required"),
    collectPoints: Yup.string().required("Required"),
    uom: Yup.string().required("Required"),
    salesPrice: Yup.string().required("Required"),
    calculatedrpice: Yup.string().required("Required"),
})

function ProductPrice(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [uomsList, setUomsList] = useState([])

    useEffect(() => {
        getUomsList()
    }, [])

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                barCode: values.barCode,
                collectPoints: values.collectPoints,
                uom: values.uom,
                salesPrice: values.salesPrice,
                calculatedrpice: values.calculatedrpice,              
                client: client.clientId,
                product: props.menuId
            },
            apiname:"createProdPrice",
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
    const getUomsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Product Price</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        barCode: "",
                        collectPoints: "",
                        uom: "",
                     
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, setFieldValue}) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="barCode"
                                            name="barCode"
                                            id="barCode"
                                            className={`form-control ${errors.barCode &&
                                                touched.barCode &&
                                                "is-invalid"}`}
                                        />
                                        {errors.barCode && touched.barCode ? (
                                            <div className="invalid-tooltip mt-25">{errors.barCode}</div>
                                        ) : null}
                                        <Label for="name">BarCode</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="collectPoints"
                                            name="collectPoints"
                                            id="collectPoints"
                                            className={`form-control ${errors.collectPoints &&
                                                touched.collectPoints &&
                                                "is-invalid"}`}
                                        />
                                        {errors.collectPoints && touched.collectPoints ? (
                                            <div className="invalid-tooltip mt-25">{errors.collectPoints}</div>
                                        ) : null}
                                        <Label for="collectPoints">Collection Points</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
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
                                        ) : null}
                                        <Label for="uom">Base UOM</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="salesPrice"
                                            name="salesPrice"
                                            id="salesPrice"
                                            onBlur = {(v) => {
                                                getList({
                                                    apiname: "salesPricewithTax",
                                                    tokenType: user.tokenType,
                                                    accessToken: user.accessToken,
                                                    data:{
                                                        salesPrice: v.target.value,
                                                        tax: client.tax,
                                                    }
                                                })
                                                .then( res => {
                                                    setFieldValue("calculatedrpice",res.data)
                                                })
                                            }}
                                            className={`form-control ${errors.salesPrice &&
                                                touched.salesPrice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.salesPrice && touched.salesPrice ? (
                                            <div className="invalid-tooltip mt-25">{errors.salesPrice}</div>
                                        ) : null}
                                        <Label for="salesPrice">Sale Price</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="calculatedrpice"
                                            name="calculatedrpice"
                                            id="calculatedrpice"
                                            onBlur = {(v) => {
                                                getList({
                                                    apiname: "salesPricewithoutTax",
                                                    tokenType: user.tokenType,
                                                    accessToken: user.accessToken,
                                                    data:{
                                                        salesPriceTax: v.target.value,
                                                        tax: client.tax,
                                                    }
                                                })
                                                .then( res => {
                                                    setFieldValue("salesPrice",res.data)
                                                })
                                            }}
                                            className={`form-control ${errors.calculatedrpice &&
                                                touched.calculatedrpice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.calculatedrpice && touched.calculatedrpice ? (
                                            <div className="invalid-tooltip mt-25">{errors.calculatedrpice}</div>
                                        ) : null}
                                        <Label for="calculatedrpice">Calculated Price</Label>
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
                                            onClick={() => history.push("/dashboard/parametersetup/")}
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


export default ProductPrice