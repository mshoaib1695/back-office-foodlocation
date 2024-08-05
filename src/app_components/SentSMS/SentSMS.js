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
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { notify, getList } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'
import ReactSelect from "react-select"


const formSchema = Yup.object().shape({

})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [screensGroup, setScreensGroup] = useState([])

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 })
        getScreensGroup()
    }, [])
    const getScreensGroup = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "messageTemplatesList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                setScreensGroup(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                isFav: values.isFav,
                msg: values.msg,
                client: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "sendSMS"
        }
        notify(payload)
            .then(res => {
                message(res)
            })
    }
    const getTemplateById = (id) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
                id: id
            },
            apiname: "messageTemplateByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        return getList(payload)

    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Send SMS to Customers</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        isFav: false,
                        msg: '',
                        template: '',

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
                                <Col md="3" sm="12" ></Col>
                                <Col md="6" sm="12" >
                                    <Row>
                                        <Col md="12" sm="12">
                                            <FormGroup className="form-label-group">
                                                <Field
                                                    name="template"
                                                    id="template"
                                                    className={`form-control ${errors.template &&
                                                        touched.template && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <ReactSelect
                                                            isMulti={false}
                                                            options={screensGroup}
                                                            value={screensGroup ? screensGroup.find(option => option.value === field.value) : ''}
                                                            onChange={(option) => {
                                                                getTemplateById(option.value)
                                                                .then(res => {
                                                                    form.setFieldValue('msg', res.data.object.msg)
                                                            
                                                                })
                                                                form.setFieldValue(field.name, option.value)

                                                            }}
                                                            error={errors.state}
                                                            onBlur={field.onBlur}
                                                        />}
                                                />
                                                {errors.template && touched.template ? (
                                                    <div className="invalid-tooltip mt-25">{errors.template}</div>
                                                ) : null}
                                                <Label for="template" className="select-label"> Select Message Template</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col md="12" sm="12">
                                            <FormGroup className="form-label-group">
                                                <Field
                                                    name="msg"
                                                    id="msg"
                                                    className={`form-control ${errors.msg &&
                                                        touched.msg &&
                                                        "is-invalid"}`}
                                                />
                                                {errors.msg && touched.msg ? (
                                                    <div className="invalid-tooltip mt-25">{errors.msg}</div>
                                                ) : null}
                                                <Label for="msg">Message</Label>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4" sm="4">
                                            <FormGroup>
                                                <Field
                                                    name="isFav"
                                                    id="isFav"
                                                    className={`form-control ${errors.isFav &&
                                                        touched.isFav && "is-invalid"}`}
                                                    component={({ field, form }) =>
                                                        <CustomInput
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
                                                    onClick={() => history.push("/dashboard/screensetup/")}
                                                >
                                                    Cancel
                                                </Button.Ripple>
                                            </FormGroup>
                                        </Col>
                                    </Row>

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