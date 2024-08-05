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
    Input,
    Label,
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { getImage } from '../../API_Helpers/getImage'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import ReactSelect from "react-select"
import { getList, create, createMultipartAPI, parametersListByParaType} from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    description: Yup.string().required("Required"),
    tax: Yup.string().required("Required"),
    favCustOrdersLimt: Yup.number(),
})
function UpdateUser() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [imgUrl, setImgUrl] = useState(null)
    const [clientObj, setClientObj] = useState(useSelector(state => state.auth.login.client))
    const [taxsList, setTaxsList] = useState([])
    const [gateWayType, setGateWayType] = useState([])
    const [packages, setPackages] = useState([])

    useEffect(() => {
        getClientByID()
        getImageFunction(clientObj.clientlogo)
        getTaxsList()
        getSmsTypes()
        getPackages()
    }, [])
    const getPackages = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
            },
            apiname: "appPackagesList",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => {
                message(res)

                setPackages(res.data.map(i => { return { value: i.id, label: i.packageType } }))
            })
    }
    const getSmsTypes = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "GATEWAY_TYPE",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => {
                setGateWayType(res.data.map(i => { return { value: i.paramCode, label: i.name } }))
            })
    }
    const getImageFunction = (logoImg) => {
        let payload = {
            // imageId: logoImg,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        getImage(payload)
            .then(res => { message(res)

                var reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    setImgUrl(reader.result)
                }
            })
    }
    const getTaxsList = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
            },
            apiname: "taxsList",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                setTaxsList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const getClientByID = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
            },
            apiname: "clientByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    setClientObj(res.data.object)
                    getImageFunction(res.data.object.logoImg)
                }
            })
    }
    const handleImageUpload = (e) => {
        e.preventDefault();
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            var file = e.currentTarget.files[0];
            let fileName = file.name;
            let extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (file.size <= 1024 * 1024 * 2 && /png|jpe?g/i.test(extension)) {
                let imgdata = new FormData();
                imgdata.append('file', file);
                imgdata.append('logoImg', clientObj.logoImg);
                imgdata.append('lang', "EN");
                imgdata.append('id', clientObj.id);
                let payload = {
                    data: imgdata,
                    tokenType: user.tokenType,
                    accessToken: user.accessToken,
                    apiname: "updateClientLogo"
                }
                createMultipartAPI(payload)
                    .then(res => { message(res)

                        setImgUrl(URL.createObjectURL(file))
                    })
            }
            else {
                document.getElementById('file').value = ''
            }
        }
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                clientId: client.clientId,
                id: clientObj.id,
                name: values.name,
                nameAr: values.nameAr,
                email: values.email,
                description: values.description,
                address: values.address,
                smsGatewayUrl: values.smsGatewayUrl,
                smsGatewayType: values.smsGatewayType,
                tax: values.tax,
                isOnline: values.isOnline,
                phoneNo: values.phoneNo,
                smsGatewayPwd: values.smsGatewayPwd,
                smsGatewayUser: values.smsGatewayUser,
                smsGatewaySid: values.smsGatewaySid,
                isSms: values.isSms,
                isWhatsapp: values.isWhatsapp,
                favCustOrdersLimt: values.favCustOrdersLimt,
                isEmail: values.isEmail,
                appPackage: values.appPackage,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateClient"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Client Information</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    enableReinitialize 
                    initialValues={{
                        name: clientObj.name,
                        nameAr: clientObj.nameAr,
                        description: clientObj.description,
                        email: clientObj.email,
                        smsGatewayType: clientObj.smsGatewayType,
                        smsGatewayUrl: clientObj.smsGatewayUrl,
                        phoneNo: clientObj.phoneNo,
                        smsGatewayPwd: clientObj.smsGatewayPwd,
                        favCustOrdersLimt: clientObj.favCustOrdersLimt,
                        smsGatewayUser: clientObj.smsGatewayUser,
                        smsGatewaySid: clientObj.smsGatewaySid,
                        tax: clientObj.tax,
                        isOnline: clientObj.isOnline,
                        isSms: clientObj.isSms,
                        isWhatsapp: clientObj.isWhatsapp,
                        appPackage: clientObj.appPackage,
                        isEmail: clientObj.isEmail,

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
                                            name="email"
                                            id="email"
                                            className={`form-control ${errors.email &&
                                                touched.email &&
                                                "is-invalid"}`}
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="invalid-tooltip mt-25">{errors.email}</div>
                                        ) : null}
                                        <Label for="email">Email</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
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
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
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
                                            name="tax"
                                            id="tax"
                                            className={`form-control ${errors.tax &&
                                                touched.tax && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={taxsList}
                                                    value={taxsList ? taxsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.tax && touched.tax ? (
                                            <div className="invalid-tooltip mt-25">{errors.tax}</div>
                                        ) : null}
                                        <Label for="tax" className="select-label">Terminal</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="smsGatewayUrl"
                                            id="smsGatewayUrl"
                                            className={`form-control ${errors.smsGatewayUrl &&
                                                touched.smsGatewayUrl &&
                                                "is-invalid"}`}
                                        />
                                        {errors.smsGatewayUrl && touched.smsGatewayUrl ? (
                                            <div className="invalid-tooltip mt-25">{errors.smsGatewayUrl}</div>
                                        ) : null}
                                        <Label for="smsGatewayUrl">SMS Gateway Url</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="smsGatewayType"
                                            id="smsGatewayType"
                                            className={`form-control ${errors.smsGatewayType &&
                                                touched.smsGatewayType && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={gateWayType}
                                                    value={gateWayType ? gateWayType.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.smsGatewayType && touched.smsGatewayType ? (
                                            <div className="invalid-tooltip mt-25">{errors.tax}</div>
                                        ) : null}
                                        <Label for="smsGatewayType" className="select-label">SMS Gateway Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="phoneNo"
                                            id="phoneNo"
                                            className={`form-control ${errors.phoneNo &&
                                                touched.phoneNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.phoneNo && touched.phoneNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.phoneNo}</div>
                                        ) : null}
                                        <Label for="phoneNo">Phone Number</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="smsGatewayPwd"
                                            id="smsGatewayPwd"
                                            className={`form-control ${errors.smsGatewayPwd &&
                                                touched.smsGatewayPwd &&
                                                "is-invalid"}`}
                                        />
                                        {errors.smsGatewayPwd && touched.smsGatewayPwd ? (
                                            <div className="invalid-tooltip mt-25">{errors.smsGatewayPwd}</div>
                                        ) : null}
                                        <Label for="smsGatewayPwd">SMS Gateway Password</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="smsGatewayUser"
                                            id="smsGatewayUser"
                                            className={`form-control ${errors.smsGatewayUser &&
                                                touched.smsGatewayUser &&
                                                "is-invalid"}`}
                                        />
                                        {errors.smsGatewayUser && touched.smsGatewayUser ? (
                                            <div className="invalid-tooltip mt-25">{errors.smsGatewayUser}</div>
                                        ) : null}
                                        <Label for="smsGatewayUser">SMS Gateway user</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="smsGatewaySid"
                                            id="smsGatewaySid"
                                            className={`form-control ${errors.smsGatewaySid &&
                                                touched.smsGatewaySid &&
                                                "is-invalid"}`}
                                        />
                                        {errors.smsGatewaySid && touched.smsGatewaySid ? (
                                            <div className="invalid-tooltip mt-25">{errors.smsGatewaySid}</div>
                                        ) : null}
                                        <Label for="smsGatewaySid">SMS Gateway SID</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="favCustOrdersLimt"
                                            id="favCustOrdersLimt"
                                            className={`form-control ${errors.favCustOrdersLimt &&
                                                touched.favCustOrdersLimt &&
                                                "is-invalid"}`}
                                        />
                                        {errors.favCustOrdersLimt && touched.favCustOrdersLimt ? (
                                            <div className="invalid-tooltip mt-25">{errors.favCustOrdersLimt}</div>
                                        ) : null}
                                        <Label for="favCustOrdersLimt">Favourite Customer Order Limit</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="appPackage"
                                            id="appPackage"
                                            className={`form-control ${errors.appPackage &&
                                                touched.appPackage && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={packages}
                                                    value={packages ? packages.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.appPackage && touched.appPackage ? (
                                            <div className="invalid-tooltip mt-25">{errors.tax}</div>
                                        ) : null}
                                        <Label for="appPackage" className="select-label">Select Package Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup>
                                        <span>
                                            <p>Upload files under 2MB, and only in png/jpg/jpeg formats</p>
                                            <Avatar img={imgUrl || '/dummylogo.png'} size="xl" />
                                            <Input type="file" id="file" className="file" onChange={handleImageUpload} />
                                        </span>
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
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
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isSms"
                                            id="isSms"
                                            className={`form-control ${errors.isSms &&
                                                touched.isSms && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSms"
                                                    name="isSms"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is SMS</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isWhatsapp"
                                            id="isWhatsapp"
                                            className={`form-control ${errors.isWhatsapp &&
                                                touched.isOnline && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isWhatsapp"
                                                    name="isWhatsapp"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is WhatsApp</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isEmail"
                                            id="isEmail"
                                            className={`form-control ${errors.isEmail &&
                                                touched.isEmail && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isEmail"
                                                    name="isEmail"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Email</span>
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
                                            onClick={() => history.push("/dashboard/")}
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

export default UpdateUser