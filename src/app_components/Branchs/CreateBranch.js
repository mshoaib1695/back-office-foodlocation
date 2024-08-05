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
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, getList, parametersListByParaType } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'
import Map from '../SelectLocationMap/index'
import ReactSelect from "react-select"
const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    header: Yup.string().required("Required"),
    footer: Yup.string().required("Required"),
    isBarcodeEnable: Yup.string().required("Required"),
    isMinCharge: Yup.string().required("Required"),
    isTobacco: Yup.string().required("Required"),
    isColPointEnable: Yup.string().required("Required"),
    isInclusiveTax: Yup.string().required("Required"),
    isPrntKitPayComp: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [chargeTypeList, setChargeTypeList] = useState([])
    const [show, setShow] = useState(false)
    const [location, setLocation] = useState({ lat: null, lng: null })

    useEffect(() => {
        getChargeTypeList()
    }, [])
    const getChargeTypeList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "MIN_CHARGE_TYPE",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => {
                message(res)

                setChargeTypeList(res.data.map(i => { return { value: i.paramCode, label: i.name, id: i.id } }))
            })
    }

    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            name: values.name,
            nameAr: values.nameAr,
            address: values.address,
            description: values.description,
            header: values.header,
            footer: values.footer,
            isMinCharge: values.isMinCharge,
            isBarcodeEnable: values.isBarcodeEnable,
            isTobacco: values.isTobacco,
            isColPointEnable: values.isColPointEnable,
            isInclusiveTax: values.isInclusiveTax,
            isPrntKitPayComp: values.isPrntKitPayComp,
            latitude: location.lat,
            longitude: location.lng,
        }
        if (values.isMinCharge) {
            data.minCharge = values.minCharge
            data.chargeType = values.chargeType
            data.isTaxOnChrg = values.isTaxOnChrg
        }
        if (values.isColPointEnable) {
            data.minPoint = values.minPoint
            data.pointValue = values.pointValue
            data.pointValueAmt = values.pointValueAmt
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createBranch"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    history.push("/dashboard/branchsetup/")
                }
            })
    }

    const handleConfirm = () => {
        setShow(false)
    }
    const handleClose = () => {
        setShow(false)
    }

return (
        <Card>
            <CardHeader>
                <CardTitle>Create Branch</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: "",
                        nameAr: "",
                        description: "",
                        address: "",
                        header: "",
                        footer: "",
                        isMinCharge: false,
                        isTaxOnChrg: false,
                        isBarcodeEnable: false,
                        isTobacco: false,
                        minCharge: "",
                        isColPointEnable: false,
                        chargeType: "",
                        isInclusiveTax: false,
                        isPrntKitPayComp: false,
                        pointValueAmt: "",
                        pointValue: "",
                        pointValueAmt: "",
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
                                        <Label for="nameAr">Arabic Name</Label>
                                    </FormGroup>
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
                                            type="address"
                                            name="address"
                                            id="address"
                                            className={`form-control ${errors.address &&
                                                touched.address &&
                                                "is-invalid"}`}
                                        />
                                        {errors.address && touched.address ? (
                                            <div className="invalid-tooltip mt-25">{errors.address}</div>
                                        ) : null}
                                        <Label for="address">Address</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="header"
                                            name="header"
                                            id="header"
                                            className={`form-control ${errors.header &&
                                                touched.header &&
                                                "is-invalid"}`}
                                        />
                                        {errors.header && touched.header ? (
                                            <div className="invalid-tooltip mt-25">{errors.header}</div>
                                        ) : null}
                                        <Label for="header">Header</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="footer"
                                            name="footer"
                                            id="footer"
                                            className={`form-control ${errors.footer &&
                                                touched.footer &&
                                                "is-invalid"}`}
                                        />
                                        {errors.footer && touched.footer ? (
                                            <div className="invalid-tooltip mt-25">{errors.footer}</div>
                                        ) : null}
                                        <Label for="footer">Footer</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isMinCharge"
                                            id="isMinCharge"
                                            className={`form-control ${errors.isMinCharge &&
                                                touched.isMinCharge && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isMinCharge"
                                                    name="isMinCharge"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Minimum Charge</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                {values.isMinCharge &&
                                    <>
                                        <Col md="4" sm="12">
                                            <FormGroup className="form-label-group">
                                                <Field
                                                    name="chargeType"
                                                    id="chargeType"

                                                    className={`form-control ${errors.chargeType &&
                                                        touched.chargeType && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <ReactSelect
                                                            disabled={values.isMinCharge ? false : true}
                                                            isMulti={false}
                                                            options={chargeTypeList}
                                                            value={chargeTypeList ? chargeTypeList.find(option => option.value === field.value) : ''}
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.value)
                                                            }}
                                                            error={errors.state}
                                                            onBlur={field.onBlur}
                                                        />}
                                                />
                                                {errors.chargeType && touched.chargeType ? (
                                                    <div className="invalid-tooltip mt-25">{errors.chargeType}</div>
                                                ) : null}
                                                <Label for="chargeType" className="select-label">Charge Type</Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="12">
                                            <FormGroup className="form-label-group">
                                                <Field

                                                    type="minCharge"
                                                    name="minCharge"
                                                    id="minCharge"
                                                    className={`form-control ${errors.minCharge &&
                                                        touched.minCharge &&
                                                        "is-invalid"}`}
                                                />
                                                {errors.minCharge && touched.minCharge ? (
                                                    <div className="invalid-tooltip mt-25">{errors.minCharge}</div>
                                                ) : null}
                                                <Label for="minCharge">Minimum Charge </Label>
                                            </FormGroup>
                                        </Col>
                                        <Col md="4" sm="4">
                                            <FormGroup>
                                                <Field
                                                    name="isTaxOnChrg"
                                                    id="isTaxOnChrg"
                                                    className={`form-control ${errors.isTaxOnChrg &&
                                                        touched.isTaxOnChrg && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isTaxOnChrg"
                                                            name="isTaxOnChrg"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Is Tax on Charge</span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </>}
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isBarcodeEnable"
                                            id="isBarcodeEnable"
                                            className={`form-control ${errors.isBarcodeEnable &&
                                                touched.isBarcodeEnable && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isBarcodeEnable"
                                                    name="isBarcodeEnable"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">is Barcode Enable</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isTobacco"
                                            id="isTobacco"
                                            className={`form-control ${errors.isTobacco &&
                                                touched.isTobacco && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isTobacco"
                                                    name="isTobacco"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">is Tobacco</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isColPointEnable"
                                            id="isColPointEnable"
                                            className={`form-control ${errors.isColPointEnable &&
                                                touched.isColPointEnable && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isColPointEnable"
                                                    name="isColPointEnable"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Collection points enable</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isInclusiveTax"
                                            id="isInclusiveTax"
                                            className={`form-control ${errors.isInclusiveTax &&
                                                touched.isInclusiveTax && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isInclusiveTax"
                                                    name="isInclusiveTax"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">is Inclusive Tax</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isPrntKitPayComp"
                                            id="isPrntKitPayComp"
                                            className={`form-control ${errors.isPrntKitPayComp &&
                                                touched.isPrntKitPayComp && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isPrntKitPayComp"
                                                    name="isPrntKitPayComp"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">is Print In Kitchen On Payment Complete</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                {values.isColPointEnable && <>
                                    <Col md="6" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Field
                                                disabled={values.costType == "A" ? true : false}
                                                type="minPoint"
                                                name="minPoint"
                                                id="minPoint"
                                                className={`form-control ${errors.minPoint &&
                                                    touched.minPoint &&
                                                    "is-invalid"}`}
                                            />
                                            {errors.minPoint && touched.minPoint ? (
                                                <div className="invalid-tooltip mt-25">{errors.minPoint}</div>
                                            ) : null}
                                            <Label for="minPoint">Minimum Points </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Field
                                                disabled={values.costType == "A" ? true : false}
                                                type="pointValue"
                                                name="pointValue"
                                                id="pointValue"
                                                className={`form-control ${errors.pointValue &&
                                                    touched.pointValue &&
                                                    "is-invalid"}`}
                                            />
                                            {errors.pointValue && touched.pointValue ? (
                                                <div className="invalid-tooltip mt-25">{errors.pointValue}</div>
                                            ) : null}
                                            <Label for="pointValue"> Points values </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Field
                                                disabled={values.costType == "A" ? true : false}
                                                type="pointValueAmt"
                                                name="pointValueAmt"
                                                id="pointValueAmt"
                                                className={`form-control ${errors.pointValueAmt &&
                                                    touched.pointValueAmt &&
                                                    "is-invalid"}`}
                                            />
                                            {errors.pointValueAmt && touched.pointValueAmt ? (
                                                <div className="invalid-tooltip mt-25">{errors.pointValueAmt}</div>
                                            ) : null}
                                            <Label for="pointValueAmt"> Points values Amounmt </Label>
                                        </FormGroup>
                                    </Col>
                                </>}
                                <Row style={{margin: '20px 0'}}>
                                    <Col sm="12">
                                        <Button onClick={() => setShow(true)} color='primary' >Select Branch Location</Button>
                                    </Col>
                                </Row>
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
                                            onClick={() => history.push("/dashboard/branchsetup/")}
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
            <Modal isOpen={show} toggle={handleClose}>
                <ModalHeader closeButton>
                    <h3>Please Select Branch Location</h3>
                </ModalHeader>
                <ModalBody style={{ minHeight: '200px' }}>
                    <Map apiKey={process.env.REACT_APP_MAP_KEY} onSelectLocation={(e) => {
                        setLocation(e)
                    }} location={location}/>
                </ModalBody>
                <ModalFooter>
                    {location.lat && <div onClick={handleConfirm} style={{
                        backgroundColor: '#7367f0', "color": "#fff",
                        "padding": "10px 20px",
                        "borderRadius": "7px",
                        cursor: 'pointer'
                    }}>
                        <span className="align-middle ml-50">Save and Proceed</span>
                    </div>}
                </ModalFooter>
            </Modal>
        </Card>
    )
}


export default CreateRole
