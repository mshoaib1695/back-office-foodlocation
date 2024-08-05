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
import { create, getList, gridDataByClient } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    warehouse: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    isOnline: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [paymentMethodsList, setPaymentMethodsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const terminal = useSelector(state => state.updatescreens.terminal)
    const [warehouseList, setWarehouseList] = useState([])
    const [sendWarehouseList, setSendWarehouseList] = useState([])
    const [productCatsList, setProductCatsList] = useState([])
    const [productCatsLista, setProductCatsLista] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [vendorList, setVendorList] = useState([])
    const [page, setPage] = useState(0)
    useEffect(() => {
        getPaymentMethodsList()
        getProductCatsList()
        getWarehousesList()
    }, [])
    useEffect(() => {
        fetch({ pageSize: 5, page: 0 })
    }, [productCatsLista])
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

                setProductCatsList(res.data.map(i => { return { value: i.id, label: i.name } }))
                setProductCatsLista(res.data.map(i => { return { value: i.id, label: i.name } }))

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
    const addWarehouseList = (value) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            posTerminal: terminal.id,
            category: value,
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createTerminalCategory"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    let warehous = { ...warehousesList.filter(i => i.value == value)[0] }
                    let warehousListTemp = [...warehouseList]
                    let sendWarehouseListTemp = [...productCatsList]
                    let warehousesListTemp = [...warehousesList.filter(i => i.value != value)]
                    warehousListTemp.push(warehous)
                    sendWarehouseListTemp.push(warehous.value)
                    setWarehouseList(warehousListTemp)
                    setWarehousesList(warehousesListTemp)
                    setSendWarehouseList(sendWarehouseListTemp)
                }
            })

    }
    const removeFromWarehouseList = (value) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: value,
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "deleteTerminalCategory"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    let warehous = { ...warehouseList.filter(i => i.value == value)[0] }
                    let warehousListTemp = [...warehouseList.filter(i => i.value != value)]
                    let sendBranchListTemp = [...productCatsList.filter(i => i != value)]
                    let sendWarehouseListTemp = [...productCatsList]
                    sendWarehouseListTemp.push(warehous)
                    setWarehouseList(warehousListTemp)
                    setWarehousesList(sendWarehouseListTemp)
                    setSendWarehouseList(sendBranchListTemp)
                }
            })
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: terminal.id,
            client: client.clientId,
            name: values.name,
            nameAr: values.nameAr,
            warehouse: values.warehouse,
            branch: values.branch,
            isOnline: values.isOnline,
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updatePosTerminal"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/terminalsetup/")
                }
            })
    }
    const fetch = ({ pageSize, page, sorted, filtered }) => {
        let payload = {
            clientId: client.clientId,
            posTerminal: terminal.id,
            size: pageSize,
            page: page,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",

        }
        if (sorted && sorted.length > 0) {
            payload.sortColumn = sorted[0].id
            if (sorted[0].desc) {
                payload.sortOrder = 'DESC'
            } else {
                payload.sortOrder = 'ASC'
            }
        }
        if (filtered && filtered.length > 0) {
            for (let index = 0; index < filtered.length; index++) {
                const element = filtered[index];
                if (element.id == "documentNo") {
                    payload.documentNo = element.value
                }
                if (element.id == "vendor") {
                    payload.vendor = element.value
                }
                if (element.id == "invoiceDate") {
                    payload.invoiceDate = element.value
                }
                if (element.id == "payMethod") {
                    payload.payMethod = element.value
                }
                if (element.id == "warehouse") {
                    payload.warehouse = element.value
                }
                if (element.id == "status") {
                    payload.status = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "terminalCategoryByTerminal",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => { 

                
                setWarehouseList(res.data.content.map(i => {
                    setProductCatsList(productCatsList.filter(ii => ii.value != i.value))
                    return {
                        label:
                            productCatsList.length > 0 &&
                            productCatsList.filter(p => p.value == i.category).length > 0 &&
                            productCatsList.filter(p => p.value == i.category)[0].label,
                        value: i.id
                    }
                }))
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Terminal</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: terminal.name,
                        nameAr: terminal.nameAr,
                        branch: terminal.branch,
                        warehouse: terminal.warehouse,
                        isOnline: terminal.isOnline,
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
                                        <Label for="nameAr">Aracbi Name</Label>
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
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isOnline"
                                            id="isOnline"
                                            className={`form-control ${errors.isOnline &&
                                                touched.isOnline && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isOnline"
                                                    name="isOnline"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Online</span>
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
                                            onClick={() => history.push("/dashboard/terminalsetup/")}
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
                    list={productCatsList}
                    onAddToList={(value => addWarehouseList(value))}
                    data={warehouseList}
                    fieldTitle={"Product Category"}
                    onRemoveToList={(value) => removeFromWarehouseList(value)}
                />
            </CardBody>

        </Card>
    )
}


export default CreateRole
