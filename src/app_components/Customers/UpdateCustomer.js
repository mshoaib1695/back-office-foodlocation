import { func, number } from 'prop-types'
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
    Input,
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Flatpickr from "react-flatpickr";
import moment from 'moment'
import { gridDataByClient, getList, parametersListByParaType } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    phoneNo: Yup.number().required("Required"),
})

function CreateVendor() {
    const customer = useSelector(state => state.updatescreens.customer)
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [countries, seCountries] = useState([])
    const [customerGroup, seCustomerGroup] = useState([])
    const [deliveryAreas, setDeliveryAreas] = useState([])
    const [gender, setGender] = useState([])
    const [cities, setCities] = useState([])
    const [branchesList, setBranchesList] = useState([])
    useEffect(() => {
        getCountries()
        getCustomerGroup()
        getGender()
        getBranchesList()
    }, [])
    const getCountries = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "COUNTRY",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                seCountries(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getCustomerGroup = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "CUSTOMER_GROUP",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                seCustomerGroup(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getGender = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "GENDER",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                setGender(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getCities = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParent",
            data: {
                parent: id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setCities(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getBranchesList = () => {
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

                setBranchesList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getDeliveryAreas = (id) => {

        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParent",
            data: {
                parent: id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setDeliveryAreas(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: customer.id,
                client: client.clientId,
                name: values.name,
                birthday: values.birthday,
                phoneNo: values.phoneNo,
                email: values.email,
                city: values.city,
                isFav: values.isFav,
                country: values.country,
                gender: values.gender,
                deliveryArea: values.deliveryArea,
                group: values.group,
                branch: values.branch,
                flatNo: values.flatNo,
                street: values.street,
                building: values.building,
                landmark: values.landmark,
                taxNo: values.taxNo,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateCustomer"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/customersetup")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Customer</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: customer.name,
                        birthday: customer.birthday,
                        phoneNo: customer.phoneNo,
                        email: customer.email,
                        country: customer.country,
                        city: customer.city,
                        gender: customer.gender,
                        deliveryArea: customer.deliveryArea,
                        group: customer.group,
                        branch: customer.branch,
                        flatNo: customer.flatNo,
                        isFav: customer.isFav,
                        street: customer.street,
                        building: customer.building,
                        landmark: customer.landmark,
                        taxNo: customer.taxNo,
                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values, ...propsss }) => (
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
                                        <Label for="name">Customer Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="birthday"
                                            id="birthday"
                                            className={`form-control ${errors.birthday &&
                                                touched.birthday && "is-invalid"}`}
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
                                        {errors.birthday && touched.birthday ? (
                                            <div className="invalid-tooltip mt-25">{errors.birthday}</div>
                                        ) : null}
                                        <Label for="birthday">Date Of Birth</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="phoneNo"
                                            name="phoneNo"
                                            id="phoneNo"
                                            className={`form-control ${errors.phoneNo &&
                                                touched.phoneNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.phoneNo && touched.phoneNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.phoneNo}</div>
                                        ) : null}
                                        <Label for="phoneNo">Phone number</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="email"
                                            name="email"
                                            id="email"
                                            className={`form-control ${errors.email &&
                                                touched.email &&
                                                "is-invalid"}`}
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="invalid-tooltip mt-25">{errors.email}</div>
                                        ) : null}
                                        <Label for="name">Email</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="country"
                                            id="country"
                                            className={`form-control ${errors.country &&
                                                touched.country && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={countries}
                                                    value={countries ? countries.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        getCities(option.value)
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.country && touched.country ? (
                                            <div className="invalid-tooltip mt-25">{errors.country}</div>
                                        ) : null}
                                        <Label for="country"> Select Country</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="city"
                                            id="city"
                                            className={`form-control ${errors.city &&
                                                touched.city && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={cities}
                                                    value={cities ? cities.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        getDeliveryAreas(option.value)
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.city && touched.city ? (
                                            <div className="invalid-tooltip mt-25">{errors.city}</div>
                                        ) : null}
                                        <Label for="city"> Select City</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="gender"
                                            id="gender"
                                            className={`form-control ${errors.gender &&
                                                touched.gender && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <>
                                                    {
                                                        gender.length > 0 && gender.map(item => (
                                                            <FormGroup check inline>
                                                                <Label check>
                                                                    <Input type="radio" name="gender" checked={field.value == item.value} value={item.value}
                                                                        onChange={(e) => {
                                                                            form.setFieldValue(field.name, e.target.value)
                                                                            }} /> {item.label}
                                                        </Label>
                                                            </FormGroup>
                                                        ))
                                                    }
                                                </>}
                                        />

                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="group"
                                            id="group"
                                            className={`form-control ${errors.group &&
                                                touched.group && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={customerGroup}
                                                    value={customerGroup ? customerGroup.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.group && touched.group ? (
                                            <div className="invalid-tooltip mt-25">{errors.group}</div>
                                        ) : null}
                                        <Label for="group"> Select Customer Group</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="deliveryArea"
                                            id="deliveryArea"
                                            className={`form-control ${errors.deliveryArea &&
                                                touched.deliveryArea && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={deliveryAreas}
                                                    value={deliveryAreas ? deliveryAreas.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.deliveryArea && touched.deliveryArea ? (
                                            <div className="invalid-tooltip mt-25">{errors.deliveryArea}</div>
                                        ) : null}
                                        <Label for="deliveryArea"> Select Delivery Area</Label>
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
                                                    options={branchesList}
                                                    value={branchesList ? branchesList.find(option => option.value === field.value) : ''}
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
                                        <Label for="branch"> Select Branch</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="flatNo"
                                            name="flatNo"
                                            id="flatNo"
                                            className={`form-control ${errors.flatNo &&
                                                touched.flatNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.flatNo && touched.flatNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.flatNo}</div>
                                        ) : null}
                                        <Label for="flatNo">Flat No.</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="street"
                                            name="street"
                                            id="street"
                                            className={`form-control ${errors.street &&
                                                touched.street &&
                                                "is-invalid"}`}
                                        />
                                        {errors.street && touched.street ? (
                                            <div className="invalid-tooltip mt-25">{errors.street}</div>
                                        ) : null}
                                        <Label for="street">Street</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="building"
                                            name="building"
                                            id="building"
                                            className={`form-control ${errors.building &&
                                                touched.building &&
                                                "is-invalid"}`}
                                        />
                                        {errors.building && touched.building ? (
                                            <div className="invalid-tooltip mt-25">{errors.building}</div>
                                        ) : null}
                                        <Label for="building">Building</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="landmark"
                                            name="landmark"
                                            id="landmark"
                                            className={`form-control ${errors.landmark &&
                                                touched.landmark &&
                                                "is-invalid"}`}
                                        />
                                        {errors.landmark && touched.landmark ? (
                                            <div className="invalid-tooltip mt-25">{errors.landmark}</div>
                                        ) : null}
                                        <Label for="landmark">Landmark</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="taxNo"
                                            name="taxNo"
                                            id="taxNo"
                                            className={`form-control ${errors.taxNo &&
                                                touched.taxNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.taxNo && touched.taxNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.taxNo}</div>
                                        ) : null}
                                        <Label for="taxNo">Tax No.</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="6">
                                            <FormGroup>
                                                <Field
                                                    name="isFav"
                                                    id="isFav"
                                                    className={`form-control ${errors.isFav &&
                                                        touched.isFav && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
                                                        disabled
                                                            type="switch"
                                                            className="mr-1 mb-2"
                                                            id="isFav"
                                                            name="isFav"
                                                            checked={field.value}
                                                            inline
                                                            onChange={(option) => {
                                                                form.setFieldValue(field.name, option.target.checked)
                                                            }}
                                                        >
                                                            <span className="mb-0 switch-label">Is Favourite</span>
                                                        </CustomInput>}
                                                />
                                            </FormGroup>
                                        </Col>
                                <Col md="6" sm="6">
                                           <p style={{fontWeight:'bold'}}>No. Of Orders: {" "}
                                           <span  style={{fontWeight:"lighter"}}>{customer.noOfOrders}</span>
                                           </p>
                                          
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
                                            onClick={() => history.push("/dashboard/customersetup/")}
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


export default CreateVendor