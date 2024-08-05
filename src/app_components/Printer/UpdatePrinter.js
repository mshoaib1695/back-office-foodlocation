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
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    ipAddr: Yup.string().required("Required"),
    noOfCopy: Yup.string().required("Required"),
    printerModel: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    isPrntReciept: Yup.string().required("Required"),
    isPrntAllCat: Yup.string().required("Required"),
    isPrntBarcode: Yup.string().required("Required"),
    isPrntDelivery: Yup.string().required("Required"),
    isPrntDinein: Yup.string().required("Required"),
    isPrntTakeaway: Yup.string().required("Required"),
    isPrntOnline: Yup.string().required("Required"),
    isPrntKitchen: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateProdCat() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [paymentMethodsList, setPaymentMethodsList] = useState([])
    const [printerModelsList, setPrinterModelsList] = useState([])
    const [printer, setPrinter] = useState( useSelector(state => state.updatescreens.printer))
    const [prodCatList, setProdCatList] = useState([])
    const [sendProdCatList, setSendProdCatList] = useState([])
    const [prodCatsList, setProdCatsList] = useState([])

    useEffect(() => {
        getPaymentMethodsList()
        getPrinterModelsList()
        getProductCatsList()
    }, [])
 
    const getProductCatsList = () => {
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

                getProdCatList(res.data.map(i => { return { value: i.id, label: i.name } }))
                setProdCatsList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const getProdCatList = (prodCatsListParameter) => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: printer.id,
            },
            apiname:"printerSetupByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    setSendProdCatList(res.data.object.categories)
                    setPrinter(res.data.object)
                    let newArray = []
                    let prodCatsListTemp = [...prodCatsListParameter]
                    res.data.object.categories.forEach(item => {
                        newArray.push({ ...prodCatsListParameter.filter(i => i.value == item)[0]})
                        prodCatsListTemp = [...prodCatsListTemp.filter(i => i.value != item)]
                    })                  
                    setProdCatList(newArray)
                    setProdCatsList(prodCatsListTemp)
                }
            })
    }
    const getPaymentMethodsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branchsList",
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
    const getPrinterModelsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParaType",
            data: {
                paraType: 'PRINTER_MODEL',
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setPrinterModelsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: printer.id,
            client: client.clientId,
            name: values.name,
            ipAddr: values.ipAddr,
            noOfCopy: values.noOfCopy,
            printerModel: values.printerModel,
            branch: values.branch,
            isPrntReciept: values.isPrntReciept,
            isPrntBarcode: values.isPrntBarcode,
            isPrntAllCat: values.isPrntAllCat,
            isPrntDelivery: values.isPrntDelivery,
            isPrntDinein: values.isPrntDinein,
            isPrntTakeaway: values.isPrntTakeaway,
            isPrntKitchen: values.isPrntKitchen,
            isPrntOnline: values.isPrntOnline,
            categories: sendProdCatList
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updatePrinterSetup"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/printers/")
                }
            })
    }
    const addProdCatList = (value) => {
        let prodCat = { ...prodCatsList.filter(i => i.value == value)[0] }
        let prodCatListTemp = [...prodCatList]
        let sendProdCatListTemp = [...sendProdCatList]
        let prodCatsListTemp = [...prodCatsList.filter(i => i.value != value)]
        prodCatListTemp.push({...prodCat})
        sendProdCatListTemp.push(prodCat.value)
        setProdCatList(prodCatListTemp)
        setProdCatsList(prodCatsListTemp)
        setSendProdCatList(sendProdCatListTemp)
    }
    const removeFromProdCatList = (value) => {
        let prodCat = { ...prodCatList.filter(i => i.value == value)[0] }
        let prodCatListTemp = [...prodCatList.filter(i => i.value != value)]
        let sendProdCatListTemp = [...sendProdCatList.filter(i => i != value)]
        let prodCatsListTemp = [...prodCatsList]
        prodCatsListTemp.push({ label: prodCat.label, value: prodCat.value })
        sendProdCatList.push(prodCat)
        setProdCatList(prodCatListTemp)
        setProdCatsList(prodCatsListTemp)
        setSendProdCatList(sendProdCatListTemp)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Printer</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: printer.name,
                        ipAddr: printer.ipAddr,
                        noOfCopy: printer.noOfCopy,
                        branch: printer.branch,
                        printerModel: printer.printerModel,
                        isPrntDinein: printer.isPrntDinein,
                        isPrntReciept: printer.isPrntReciept,
                        isPrntAllCat: printer.isPrntAllCat,
                        isPrntBarcode: printer.isPrntBarcode,
                        isPrntDelivery: printer.isPrntDelivery,
                        isPrntTakeaway: printer.isPrntTakeaway,
                        isPrntOnline: printer.isPrntOnline,
                        isPrntKitchen: printer.isPrntKitchen,
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
                                            type="ipAddr"
                                            name="ipAddr"
                                            id="ipAddr"
                                            className={`form-control ${errors.ipAddr &&
                                                touched.ipAddr &&
                                                "is-invalid"}`}
                                        />
                                        {errors.ipAddr && touched.ipAddr ? (
                                            <div className="invalid-tooltip mt-25">{errors.ipAddr}</div>
                                        ) : null}
                                        <Label for="ipAddr">Ip Address</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="noOfCopy"
                                            name="noOfCopy"
                                            id="noOfCopy"
                                            className={`form-control ${errors.noOfCopy &&
                                                touched.noOfCopy &&
                                                "is-invalid"}`}
                                        />
                                        {errors.noOfCopy && touched.noOfCopy ? (
                                            <div className="invalid-tooltip mt-25">{errors.noOfCopy}</div>
                                        ) : null}
                                        <Label for="noOfCopy">No. Of Copies</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="branch"
                                            id="branch"
                                            className={`form-control ${errors.branch &&
                                                touched.branch && "is-invalid"}`}
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
                                        {errors.branch && touched.branch ? (
                                            <div className="invalid-tooltip mt-25">{errors.branch}</div>
                                        ) : null}
                                        <Label for="branch" className="select-label">Branch</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="printerModel"
                                            id="printerModel"
                                            className={`form-control ${errors.printerModel &&
                                                touched.printerModel && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={printerModelsList}
                                                    value={printerModelsList ? printerModelsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.printerModel && touched.printerModel ? (
                                            <div className="invalid-tooltip mt-25">{errors.printerModel}</div>
                                        ) : null}
                                        <Label for="printerModel" className="select-label">Printer Model</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <Row>
                                        <Col md="12" sm="12">
                                            <p>Print Type:</p>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntReciept"
                                                    id="isPrntReciept"
                                                    className={`form-control ${errors.isPrntReciept &&
                                                        touched.isPrntReciept && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntReciept"
                                                            name="isPrntReciept"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Reciepts</span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntKitchen"
                                                    id="isPrntKitchen"
                                                    className={`form-control ${errors.isPrntKitchen &&
                                                        touched.isPrntKitchen && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntKitchen"
                                                            name="isPrntKitchen"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Kitchens </span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col md="6" sm="12">
                                    <Row>
                                        <Col md="12" sm="12">
                                            <p>Order Type:</p>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntDinein"
                                                    id="isPrntDinein"
                                                    className={`form-control ${errors.isPrntDinein &&
                                                        touched.isPrntDinein && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntDinein"
                                                            name="isPrntDinein"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Dine In</span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntTakeaway"
                                                    id="isPrntTakeaway"
                                                    className={`form-control ${errors.isPrntTakeaway &&
                                                        touched.isPrntTakeaway && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntTakeaway"
                                                            name="isPrntTakeaway"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Take Away  </span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntDelivery"
                                                    id="isPrntDelivery"
                                                    className={`form-control ${errors.isPrntDelivery &&
                                                        touched.isPrntDelivery && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntDelivery"
                                                            name="isPrntDelivery"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Home Delivery</span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isPrntOnline"
                                                    id="isPrntOnline"
                                                    className={`form-control ${errors.isPrntOnline &&
                                                        touched.isPrntOnline && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isPrntOnline"
                                                            name="isPrntOnline"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Print Online  </span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup>
                                        <Field
                                            name="isPrntAllCat"
                                            id="isPrntAllCat"
                                            className={`form-control ${errors.isPrntAllCat &&
                                                touched.isPrntAllCat && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isPrntAllCat"
                                                    name="isPrntAllCat"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Print All</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup>
                                        <Field
                                            name="isPrntBarcode"
                                            id="isPrntBarcode"
                                            className={`form-control ${errors.isPrntBarcode &&
                                                touched.isPrntBarcode && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isPrntBarcode"
                                                    name="isPrntBarcode"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Prnter Barcode</span>
                                                </CustomInput>}
                                        />
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
                                            onClick={() => history.push("/dashboard/printers/")}
                                        >
                                            Cancel
                  </Button.Ripple>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                <AddToListComponent
                    list={prodCatsList}
                    onAddToList={(value => addProdCatList(value))}
                    data={prodCatList}
                    fieldTitle={"Product Category"}
                    onRemoveToList={(value) => removeFromProdCatList(value)}
                />
            </CardBody>

        </Card>
    )
}


export default CreateProdCat
