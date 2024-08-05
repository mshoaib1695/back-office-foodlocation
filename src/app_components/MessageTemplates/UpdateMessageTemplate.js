
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
import { create, } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'


const formSchema = Yup.object().shape({
    msgType: Yup.string().required("Required"),
    msg: Yup.string().required("Required"),
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [messageTemplate, setMessageTemplate] = useState(useSelector(state => state.updatescreens.messageTemplate))

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 })
    }, [])

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                msg: values.msg,
                msgType: values.msgType,
                client: client.clientId,
                id: messageTemplate.id
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateMessageTemplate"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    history.push('/dashboard/messagetemplate')
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Message Template</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        msgType: messageTemplate.msgType,
                        msg: messageTemplate.msg,
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
                                            name="msgType"
                                            id="msgType"
                                            className={`form-control ${errors.msgType &&
                                                touched.msgType &&
                                                "is-invalid"}`}
                                        />
                                        {errors.msgType && touched.msgType ? (
                                            <div className="invalid-tooltip mt-25">{errors.msgType}</div>
                                        ) : null}
                                        <Label for="msgType">Message Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
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
                                            onClick={() => history.push("/dashboard/messagetemplate/")}
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