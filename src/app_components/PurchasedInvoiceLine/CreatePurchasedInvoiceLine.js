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
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import { actions } from 'react-table'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    qty: Yup.number().required("Required"),

})
// ROW_MATERIAL
function CreateRole(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [purchasedProductsList, setPurchasedProductsList] = useState([])
    const [uomsList, setUomsList] = useState([])
    const [uomsRList, setUomsRList] = useState([])
    const [state, setState] = useState({
        "baseUom": null,
        "uom": null,
        "currentCost": 0,
        "qtyInHandWarehouse": 0,
        "qtyInHandOther": 0
    })
    const puchasedInvoice = useSelector(state => state.updatescreens.puchasedInvoice)
    const [data, setData] = useState({
        baseUom: "",
        uom: "",
        currentCost: "",
        qtyInHandOther: "",
        qtyInHandWarehouse: ""
    })
    useEffect(() => {
        getPurchasedProductsList()
        getUomsList()
    }, [])
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
            .then(res => {
                message(res)

                setPurchasedProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
            .then(res => {
                message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
            .then(res => {
                message(res)
                let dataa = []
                if (res.data.object.uomRelList.length) {
                    for (let i = 0; i < res.data.object.uomRelList.length; i++) {
                        if (uomsList.find(iii => iii.value == res.data.object.uomRelList[i].uomId)) {
                            dataa.push(uomsList.find(iii => iii.value == res.data.object.uomRelList[i].uomId))
                        }
                    }
                    console.log(dataa)
                    setUomsRList(dataa)
                }

            })
    }
    const productWarehouseDetails = opt => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productWarehouseDetails",
            data: {
                product: opt.value,
                warehouse: puchasedInvoice.warehouse,
            },
        }
        getList(payload)
            .then(resp => {
                if (resp.data) {
                    setState({
                        "baseUom": resp.data.baseUom,
                        "currentCost": resp.data.currentCost,
                        "qtyInHandWarehouse": resp.data.qtyInHandWarehouse,
                        "qtyInHandOther": resp.data.qtyInHandOther
                    })

                } else {
                    setState({
                        "baseUom": null,
                        "currentCost": 0,
                        "qtyInHandWarehouse": 0,
                        "qtyInHandOther": 0
                    })
                }
            })
    }

    const submitHandler = (values) => {
        let dataa = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            invoice: props.invoice,
            ...values,
            baseUom: data.baseUom,
        }
        let payload = {
            data: dataa,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createPurchaseInvoiceLine"
        }
        create(payload)
            .then(res => {
                message(res)

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
                getUomsRList(res.data.baseUom)
                setData(res.data)

            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Purchased Invoice Line</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    validationSchema={formSchema}
                    initialValues={{
                        baseUom: data.baseUom
                    }}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values, setFieldValue }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Line No:</p>
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
                                                        productWarehouseDetails(option)
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
                                        <p>{data.currentCost}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Base Uom:</p>
                                        <p>{uomsList ? uomsList.find(option => option.value === data.baseUom) ?
                                            uomsList.find(option => option.value === data.baseUom).label : '' : ''}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Quantity In Hand Warehouse:</p>
                                        <p>{data.qtyInHandWarehouse}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Quantity In Hand Other Warehouse:</p>
                                        <p>{data.qtyInHandOther}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="qty"
                                            name="qty"
                                            id="qty"
                                            onChange={(ee) => {
                                                if (ee.target.value[ee.target.value.length - 1] == '.') {
                                                    setFieldValue('qty', ee.target.value)
                                                    return
                                                }
                                                let e = Number(ee.target.value)
                                                if (!isNaN(e)) {
                                                    if (values.unitPrice > 0) {
                                                        let totalNetLinea = values.unitPrice * e
                                                        setFieldValue('totalNetLine', totalNetLinea)
                                                        setFieldValue('qty', e)
                                                    }
                                                    else if (values.totalNetLine > 0) {
                                                        let unitPriceCa = values.totalNetLine / e
                                                        setFieldValue('unitPrice', unitPriceCa)
                                                        setFieldValue('qty', e)
                                                    } else {
                                                        setFieldValue('qty', e)
                                                    }
                                                }
                                            }}
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
                                            onChange={(ee) => {
                                                let e = ee.target.value
                                                if (values.qty > 0) {
                                                    let uprice = e * values.qty
                                                    setFieldValue('totalNetLine', uprice)
                                                    setFieldValue('unitPrice', e)
                                                } else {
                                                    setFieldValue('unitPrice', e)
                                                }                                        
                                            }}
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
                                        <Label for="netQty">Net Quantity</Label>
                                    </FormGroup>
                                </Col>
                                {/* <Col md="6" sm="12"> */}
                                    {/* <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <p>Base Uom:</p>
                                        <p>{uomsList ? uomsList.find(option => option.value === data.baseUom) ?
                                         uomsList.find(option => option.value === data.baseUom).label : '' : ''}</p>
                                    </FormGroup>
                                </Col> */}
                                    {/* <FormGroup className="form-label-group">
                                        <ReactSelect
                                            // isDisabled
                                            isMulti={false}
                                            options={uomsList}
                                            value={uomsList ? uomsList.find(option => option.value === data.baseUom) : ''}
                                            onChange={(option) => {
                                                getUomsRList(option.value)
                                                setData({ ...data, baseUom: option.value })
                                            }}
                                     */}
                                        {/* /> */}
                                        {/* <Field
                                            name="baseUom"
                                            id="baseUom"
                                            className={`form-control ${errors.baseUom &&
                                                touched.baseUom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                            
                                        />
                                        {errors.baseUom && touched.baseUom ? (
                                            <div className="invalid-tooltip mt-25">{errors.baseUom}</div>
                                        ) : null}
                                        <Label for="baseUom" className="select-label">Base UOM</Label> */}
                                    {/* </FormGroup>
                                </Col> */}
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="uom"
                                            id="uom"
                                            className={`form-control ${errors.uom &&
                                                touched.uom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    // isDisabled
                                                    isMulti={false}
                                                    options={uomsRList}
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
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled
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
