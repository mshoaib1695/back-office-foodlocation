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
    Label,
    CustomInput,
    Input
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
    totalNetLine: Yup.string().required("Required"),
    uom: Yup.string().required("Required"),
    unitPrice: Yup.string().required("Required"),
    qty: Yup.string().required("Required"),
    product: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const puchasedInvoiceLine = useSelector(state => state.updatescreens.puchasedInvoiceLine)  
    const puchasedInvoice = useSelector(state => state.updatescreens.puchasedInvoice)  
    const [purchasedProductsList, setPurchasedProductsList] = useState([])
    const [productWarehouseDetails, setProductWarehouseDetails] = useState({})
    const [uomsRList, setUomsRList] = useState([])

    const [uomsList, setUomsList] = useState([])
    const [dataa, setData] = useState({
        baseUom: "",
        currentCost: "",
        qtyInHandOther: "",
        qtyInHandWarehouse: ""})
    useEffect(() => {
        if(uomsList && uomsList.length && dataa.baseUom){
            getUomsRList(dataa.baseUom)
        }
    }, [JSON.stringify(uomsList), dataa.baseUom])
    useEffect(() => {
        getPurchasedProductsList()
        getUomsList()
    }, [])
    useEffect(() => {
        getProductWarehouseDetails(puchasedInvoiceLine.product)
        getProductDetails(puchasedInvoiceLine.product)
    }, [puchasedInvoiceLine])
    const getPurchasedProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "purchasedProductsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setPurchasedProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getProductWarehouseDetails = (prodId) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productWarehouseDetails",
            data: {
                product: prodId,
                warehouse: puchasedInvoice.warehouse,
                uom: puchasedInvoiceLine.warehouse
            },
        }
        getList(payload)
            .then(res => { message(res)

                setProductWarehouseDetails(res.data)
            })
    }
    const getUomsRList = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomByID",
            data: {
                id: id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)
                let dataa = []
                if(res.data.object.uomRelList.length){
                    for(let i =0; i < res.data.object.uomRelList.length; i++){
                        if(uomsList.find(iii => iii.value == res.data.object.uomRelList[i].uomId)){
                            dataa.push(uomsList.find(iii => iii.value == res.data.object.uomRelList[i].uomId))
                        }
                    }
                    setUomsRList(dataa)                    
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
                
                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            id: puchasedInvoiceLine.id,
            invoice: props.invoice,
            ...values
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updatePurchaseInvoiceLine"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    props.goToSetup()
                }
            })
    }
    const getProductDetails = (v) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productWarehouseDetails",
            data: {
                product: v,
                warehouse: props.warehouse,
            },
        }
        getList(payload)
            .then(res => {
                setData(res.data)

            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Purchased Invoice Line</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    validationSchema={formSchema}
                    initialValues={{
                        uom: puchasedInvoiceLine.uom,
                        product:puchasedInvoiceLine.product,
                        qty:puchasedInvoiceLine.qty,
                        netQty:puchasedInvoiceLine.netQty,
                        unitPrice:puchasedInvoiceLine.unitPrice,
                        totalNetLine:puchasedInvoiceLine.totalNetLine,
                    }}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Line No:</p>
                                        <p>{puchasedInvoiceLine.lineno }</p>
                                    </FormGroup>
                                </Col>
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
                                                    options={purchasedProductsList}
                                                    value={purchasedProductsList ? purchasedProductsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        getProductWarehouseDetails(option.value)
                                                        form.setFieldValue(field.name, option.value)
                                                        getProductDetails(option.value)
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
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Current Cost:</p>
                                        <p>{productWarehouseDetails && productWarehouseDetails.currentCost }</p>
                                        

                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Base Uom:</p>
                                        <p>{uomsList ? uomsList.find(option => option.value === dataa.baseUom) ?
                                         uomsList.find(option => option.value === dataa.baseUom).label : '' : ''}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Quantity In Hand Warehouse:</p>
                                        <p>{productWarehouseDetails && productWarehouseDetails.qtyInHandWarehouse}</p>

                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>QTY In Other Warehouse:</p>
                                        <p>{productWarehouseDetails && productWarehouseDetails.qtyInHandOther}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="qty"
                                            name="qty"
                                            id="qty"
                                            className={`form-control ${errors.qty &&
                                                touched.qty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.qty && touched.qty ? (
                                            <div className="invalid-tooltip mt-25">{errors.qty}</div>
                                        ) : null}
                                        <Label for="qty">Quantity</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="unitPrice"
                                            name="unitPrice"
                                            id="unitPrice"
                                            className={`form-control ${errors.unitPrice &&
                                                touched.unitPrice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.unitPrice && touched.unitPrice ? (
                                            <div className="invalid-tooltip mt-25">{errors.unitPrice}</div>
                                        ) : null}
                                        <Label for="unitPrice">Unit Price</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="netQty"
                                            name="netQty"
                                            id="netQty"
                                            className={`form-control ${errors.netQty &&
                                                touched.netQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.netQty && touched.netQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.netQty}</div>
                                        ) : null}
                                        <Label for="netQty">Net Price</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="uom"
                                            id="uom"
                                            className={`form-control ${errors.uom &&
                                                touched.uom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={uomsRList}
                                                    // isDisabled
                                                    value={uomsRList ? uomsRList.find(option => option.value === values.uom) : ''}
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
                                        <Label for="uom" className="select-label">UOM</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Taxable Ammount:</p>
                                        <p>{puchasedInvoiceLine.taxableAmt}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="totalNetLine"
                                            name="totalNetLine"
                                            id="totalNetLine"
                                            className={`form-control ${errors.totalNetLine &&
                                                touched.totalNetLine &&
                                                "is-invalid"}`}
                                        />
                                        {errors.totalNetLine && touched.totalNetLine ? (
                                            <div className="invalid-tooltip mt-25">{errors.totalNetLine}</div>
                                        ) : null}
                                        <Label for="totalNetLine">Total Net Line</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Total Gross Line:</p>
                                        <p>{puchasedInvoiceLine.totalGrossLine}</p>

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


export default CreateRole
