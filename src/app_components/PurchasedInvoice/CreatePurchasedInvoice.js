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
import { purchasedInvoiceUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'

const formSchema = Yup.object().shape({
    payMethod: Yup.string().required("Required"),
    warehouse: Yup.string().required("Required"),
    invoiceDate: Yup.string().required("Required"),
    vendor: Yup.string().required("Required"),


   
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const rowmaterial = useSelector(state => state.updatescreens.rowmaterial)
    const [imgUrl, setImgUrl] = useState(null)
    const [imgfile, setImgfile] = useState(null)
    const [prodCatgry, setProdCatgry] = useState([])
    const [uomsList, setUomsList] = useState([])
    const [rowCatgry, setRowCatgry] = useState({})
    const [vendorList, setVendorList] = useState([])
    const [paymentMethodsList, setPaymentMethodsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        getProdCatList()
        getuomsList()
        getVendorList()
        getPaymentMethodsList()
        getWarehousesList()
    }, [])
    const getVendorList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "vendorList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setVendorList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
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
            .then(res => { message(res)

                setWarehousesList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getProdCatList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productCatsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setRowCatgry(res.data.filter(i => i.name == "ROW_MATERIAL")[0])
                setProdCatgry(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getuomsList = () => {
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

    const handleImageUpload = (e) => {
        e.preventDefault();
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            var file = e.currentTarget.files[0];
            let fileName = file.name;
            let extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (file.size <= 1024 * 1024 * 2 && /png|jpe?g/i.test(extension)) {
                setImgUrl(URL.createObjectURL(file))
                setImgfile(file)
            }
            else {
                document.getElementById('file').value = ''
            }
        }
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            invoiceDate: values.invoiceDate,
            payMethod: values.payMethod,
            warehouse: values.warehouse,
            vendor: values.vendor,
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createPurchaseInvoice"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    dispatch(purchasedInvoiceUpdate({ ...res.data.object }))
                    history.push("/dashboard/updatepurchaseinvoice/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Purchased Invoice</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        invoiceDate: "",
                        payMethod: null,
                        warehouse: null,
                        vendor: null,
                    }}
                    validationSchema={formSchema}
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
                                        <p>Invoice no:</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="invoiceDate"
                                            id="invoiceDate"
                                            className={`form-control ${errors.invoiceDate &&
                                                touched.invoiceDate && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("YYYY-MM-DD"))
                                                    }}
                                                />}
                                        />
                                        {errors.invoiceDate && touched.invoiceDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.invoiceDate}</div>
                                        ) : null}
                                        <Label for="invoiceDate">Invoice Date</Label></FormGroup>
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
                                        <Label for="payMethod" className="select-label">Payment Methpd</Label>
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
                                        <Label for="warehouse" className="select-label">Warehouse</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="vendor"
                                            id="vendor"
                                            className={`form-control ${errors.vendor &&
                                                touched.vendor && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={vendorList}
                                                    value={vendorList ? vendorList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.vendor && touched.vendor ? (
                                            <div className="invalid-tooltip mt-25">{errors.vendor}</div>
                                        ) : null}
                                        <Label for="vendor" className="select-label">Vendor</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Total Net Amount:</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Total Gross Amount:</p>
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
                                            onClick={() => history.push("/dashboard/purchaseinvoicesetup/")}
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
