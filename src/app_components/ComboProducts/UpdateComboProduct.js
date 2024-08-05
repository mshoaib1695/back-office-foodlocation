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
    salesPriceTax: Yup.number().required("Required"),
    collectPoints: Yup.number().required("Required"),
    product: Yup.string().required("Required"),
    salesPrice: Yup.number().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [productsList, setProductsList] = useState([])
    const comboProduct = useSelector(state => state.updatescreens.comboProduct)

    useEffect(() => {
        getProductsList()
    }, [])
    const getProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                comboOpt: props.comboOptionId,
                collectPoints: values.collectPoints,
                salesPriceTax: values.salesPriceTax,
                salesPrice: values.salesPrice,
                product: values.product,
                id: comboProduct.id
            },
            apiname: "updateComboProdLevel",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    props.goToSetup()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Combo option</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        product: comboProduct.product,
                        collectPoints: comboProduct.collectPoints,
                        salesPriceTax: comboProduct.salesPriceTax,
                        salesPrice: comboProduct.salesPrice,
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}
                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="product"
                                            id="product"
                                            className={`form-control ${errors.product &&
                                                touched.product && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={productsList}
                                                    value={productsList ? productsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.product && touched.product ? (
                                            <div className="invalid-tooltip mt-25">{errors.product}</div>
                                        ) : null}
                                        <Label for="product" className="select-label">Product</Label>
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
                                <Col md="6" sm="12">
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
                                                    setFieldValue("salesPriceTax",res.data)
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
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="salesPriceTax"
                                            name="salesPriceTax"
                                            id="salesPriceTax"
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
                                            className={`form-control ${errors.salesPriceTax &&
                                                touched.salesPriceTax &&
                                                "is-invalid"}`}
                                        />
                                        {errors.salesPriceTax && touched.salesPriceTax ? (
                                            <div className="invalid-tooltip mt-25">{errors.salesPriceTax}</div>
                                        ) : null}
                                        <Label for="salesPriceTax">Sale Price Tax</Label>
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