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
import { toast } from "react-toastify"
import { useDispatch } from 'react-redux'
import { productionUpdate } from '../../redux/actions/updatescreens/role'
import message from '../../API_Helpers/toast'


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
    const [uom, setUom] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getProductsList()
        getWarehousesList()
        getUomsList()
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
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createProduction"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    toast.success(res.data.message)
                    dispatch(productionUpdate({ ...res.data.object }))
                    history.push('/dashboard/updateproduction')
                } else {
                    toast.error(res.data.message)
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

                setUom(res.data.object.baseUom)
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Production</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        uom: null,
                        warehouse: null,
                        product: null,
                        description: "",
                        qty: "",
                        productionDate: moment(new Date()).format("YYYY-MM-DD"),
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
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status</p>
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