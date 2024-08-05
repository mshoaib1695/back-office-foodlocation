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
    Input,
    Label,
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create } from '../../API_Helpers/api'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import ReactSelect from "react-select"
import { posTerminalsList } from '../../API_Helpers/users'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
})

function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)

    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            name: values.name,
            nameAr: values.nameAr,
            startTime: values.startTime,
            endTime: values.endTime,
            isSat: values.isSat,
            isSun: values.isSun,
            isMon: values.isMon,
            isTue: values.isTue,
            isWed: values.isWed,
            isThu: values.isThu,
            isFri: values.isFri,
            client: client.clientId
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createShift"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/shifts/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Shift</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: "",
                        nameAr: "",
                        startTime: "",
                        endTime: "",
                        isSat: false,
                        isSun: false,
                        isMon: false,
                        isTue: false,
                        isWed: false,
                        isThu: false,
                        isFri: false,
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
                                            name="startTime"
                                            id="startTime"
                                            className={`form-control ${errors.startTime &&
                                                touched.startTime && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("HH:mm:ss"))
                                                    }}
                                                />}
                                        />
                                        {errors.startTime && touched.startTime ? (
                                            <div className="invalid-tooltip mt-25">{errors.startTime}</div>
                                        ) : null}
                                        <Label for="startTime">Start Time</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="endTime"
                                            id="endTime"
                                            className={`form-control ${errors.endTime &&
                                                touched.endTime && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("HH:mm:ss"))
                                                    }}
                                                />}
                                        />
                                        {errors.endTime && touched.endTime ? (
                                            <div className="invalid-tooltip mt-25">{errors.endTime}</div>
                                        ) : null}
                                        <Label for="endTime">End Time</Label></FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isSat"
                                            id="isSat"
                                            className={`form-control ${errors.isSat &&
                                                touched.isSat && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSat"
                                                    name="isSat"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Saturday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isSun"
                                            id="isSun"
                                            className={`form-control ${errors.isSun &&
                                                touched.isSun && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSun"
                                                    name="isSun"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Sunday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isMon"
                                            id="isMon"
                                            className={`form-control ${errors.isMon &&
                                                touched.isMon && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isMon"
                                                    name="isMon"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Monday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isTue"
                                            id="isTue"
                                            className={`form-control ${errors.isTue &&
                                                touched.isTue && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isTue"
                                                    name="isTue"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Tuesday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isWed"
                                            id="isWed"
                                            className={`form-control ${errors.isWed &&
                                                touched.isWed && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isWed"
                                                    name="isWed"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Wednesday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isThu"
                                            id="isThu"
                                            className={`form-control ${errors.isThu &&
                                                touched.isThu && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isThu"
                                                    name="isThu"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Thursday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isFri"
                                            id="isFri"
                                            className={`form-control ${errors.isFri &&
                                                touched.isFri && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isFri"
                                                    name="isFri"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Friday</span>
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
                                            onClick={() => history.push("/dashboard/shifts/")}
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