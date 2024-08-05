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
import { api_url1 } from '../../assets/constants/api_url'

const formSchema = Yup.object().shape({
    product: Yup.string().required("Required"),
    warehouse: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    qty: Yup.string().required("Required"),
    productionDate: Yup.string().required("Required"),
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [ProductsList, setPaymentMethodsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [uomsList, setUomsList] = useState([])
    const [production, setProduction] = useState(useSelector(state => state.updatescreens.production))
    const [uom, setUom] = useState('')

    useEffect(() => {
        setUom(production.uom)
    }, [production])
    useEffect(() => {
        getProductsList()
        getWarehousesList()
        getUomsList()
        payProductionID()
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
            .then(res => {
                message(res)

                setPaymentMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getWarehousesList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "warehousesList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setWarehousesList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                description: values.description,
                uom: uom,
                warehouse: values.warehouse,
                product: values.product,
                qty: values.qty,
                productionDate: values.productionDate,
                client: client.clientId,
                id: production.id
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateProduction"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    history.push("/dashboard/productionsetup/")
                }
            })
    }
    const payProductionID = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: production.id,
            },
            apiname: "productionByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    setProduction(res.data.object)
                }
            })
    }
    const completeHandler = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: production.id,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "completeProduction"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    payProductionID()

                }
            })
    }
    const setUomHandler = op => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productByID",
            data: {
                id: op.value,
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    setUom(res.data.object.baseUom)

                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Production</CardTitle>
                <a
                    className="mr-1 mb-1 btn btn-primary"
                    href={`${api_url1}reports/frameset?__report=production_report.rptdesign&__title=Production_Report&__showtitle=false&production_id=${production.id}`}
                    style={
                        {
                            "borderColor": "rgb(255, 54, 74)", "backgroundColor": "rgb(255, 54, 74)",
                            "color": "#fff !important",
                            "float": "left", "margin": "20px"
                        }
                    }
                    target="_blank"
                > Production Report</a>
                {production.status == "DR" && <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => completeHandler()}
                >
                    Complete
                </Button.Ripple>}
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        uom: production.uom,
                        warehouse: production.warehouse,
                        product: production.product,
                        description: production.description,
                        qty: production.qty,
                        productionDate: moment(production).format("YYYY-MM-DD"),
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
                                        <p>Document no.</p>
                                        <p>{production.documentNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status:</p>
                                        <p>{
                                            production.status == "CO" ? "Complete"
                                                :
                                                production.status == "DR" ? "Drafts"
                                                    : ""
                                        }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="productionDate"
                                            id="productionDate"
                                            className={`form-control ${errors.productionDate &&
                                                touched.productionDate && "is-invalid"}`}
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
                                        {errors.productionDate && touched.productionDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.productionDate}</div>
                                        ) : null}
                                        <Label for="productionDate">Production Date</Label></FormGroup>
                                </Col>

                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Expiry Date:</p>
                                        <p>{production.expiryDate}</p>
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
                                                    options={ProductsList}
                                                    value={ProductsList ? ProductsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        setUomHandler(option)
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
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
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
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="warehouse"
                                            id="warehouse"
                                            className={`form-control ${errors.warehouse &&
                                                touched.warehouse && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={warehousesList}
                                                    value={warehousesList ? warehousesList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.warehouse && touched.warehouse ? (
                                            <div className="invalid-tooltip mt-25">{errors.warehouse}</div>
                                        ) : null}
                                        <Label for="warehouse" className="select-label">Warehouse </Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <p style={{ fontSize: '12px' }}><spam style={{ fontWeight: 'bold' }}>UOM:{' '}</spam>
                                        {
                                            uom && uomsList && uomsList.length &&
                                            uomsList.find(i => i.value == uom).label
                                        }
                                    </p>
                                </Col>
                                <Col md="4" sm="12">
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
                                        <Label for="description">Description</Label>
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
                                            onClick={() => history.push("/dashboard/productionsetup/")}
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