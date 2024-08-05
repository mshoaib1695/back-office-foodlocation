import { func } from 'prop-types'
import React, { useEffect, useState, useRef } from 'react'
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
import Flatpickr from "react-flatpickr";
import moment from "moment"
import { create, getList, parametersListByParaType } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Tabs from './Tabs'
import message from '../../API_Helpers/toast'
import { api_url1 } from '../../assets/constants/api_url'

const formSchema = Yup.object().shape({
    inventoryDate: Yup.string().required("Required"),
    warehouse: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [chargeTypeList, setChargeTypeList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [inventoryCount, setInventoryCountReducer] = useState(useSelector(state => state.updatescreens.inventoryCount))
    const childRef = useRef();
    useEffect(() => {
        getChargeTypeList()
        getWarehousesList()
        movementID()
    }, [])

    const movementID = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: inventoryCount.id,
            },
            apiname: "inventoryCountByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    setInventoryCountReducer(res.data.object)
                }
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
    const getChargeTypeList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "STOCK_MAINT_REASON",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => {
                message(res)

                setChargeTypeList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }

    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            warehouse: values.warehouse,
            description: values.description,
            inventoryDate: values.inventoryDate,
            id: inventoryCount.id
        }

        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateInventoryCount"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    history.push("/dashboard/inventory/")
                }
            })
    }
    const completeHandler = (v) => {

        let apiname = ""
        if (v == "PRC") {
            apiname = 'processInventoryCount'
        } else {

            apiname = 'completeInventoryCount'
        }
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: inventoryCount.id,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: apiname
        }
        create(payload)
            .then(res => {
                message(res)
                message(res)
                if (res.data.success) {
                    childRef.current.callingFrom()
                    movementID()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Inventory Count </CardTitle>
                <a
                            className="mr-1 mb-1 btn btn-primary"
                            href={`${api_url1}reports/frameset?__report=inventory_report.rptdesign&__title=Inventory-report&__showtitle=false&inventory_id=${inventoryCount.id}`}
                            style={
                                {
                                    "borderColor": "rgb(255, 54, 74)", "backgroundColor": "rgb(255, 54, 74)",
                                    "color": "#fff !important",
                                    "float": "left", "margin": "20px"
                                }
                            }
                            target="_blank"
                        > Inventory Count Report</a>
                {inventoryCount.status == "DR" && <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => completeHandler("PRC")}
                >
                    Process
                </Button.Ripple>}
                {inventoryCount.status == "PRC" && <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => completeHandler("CO")}
                >
                    Complete
                </Button.Ripple>}
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        warehouse: inventoryCount.warehouse,
                        description: inventoryCount.description,
                        inventoryDate: moment(inventoryCount).format("YYYY-MM.DD")
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
                                        <p>{"Document No."}</p>
                                        <p>{inventoryCount.documentNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="inventoryDate"
                                            id="inventoryDate"
                                            className={`form-control ${errors.inventoryDate &&
                                                touched.inventoryDate && "is-invalid"}`}
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
                                        {errors.inventoryDate && touched.inventoryDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.inventoryDate}</div>
                                        ) : null}
                                        <Label for="inventoryDate"> Date</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="description"
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
                                        <Label for="warehouse" className="select-label">  Warehouse</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>{"Total Waste Cost"}</p>
                                        <p>{inventoryCount.totalWasteCost}</p>
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
                                            onClick={() => history.push("/dashboard/inventory/")}
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
            <Tabs ref={childRef} inventoryCountId={inventoryCount.id} />
        </Card>
    )
}


export default CreateRole
