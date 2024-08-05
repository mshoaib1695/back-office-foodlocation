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
    Label
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { parametersList, createParameters } from '../../API_Helpers/parameters'
import ReactSelect from "react-select"
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Check } from "react-feather"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
})

function CreateParameter() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [parameters, setParameters] = useState([])
    useEffect(() => {
        getParameters()
    }, [])
    const getParameters = () => {
        let payload = {
            clientId: client.clientId,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        parametersList(payload)
            .then(res => { message(res)

                setParameters(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                name: values.name,
                nameAr: values.nameAr,
                description: values.description,
                paraCode: values.code,
                paraType: values.type,
                isParent: values.isParent,
                parent: values.parent,
                client: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        createParameters(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/parametersetup/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Parameter</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: "",
                        nameAr: "",
                        description: "",
                        code: "",
                        type: "",
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
                                            name="code"
                                            id="code"
                                            className={`form-control ${errors.code &&
                                                touched.code &&
                                                "is-invalid"}`}
                                        />
                                        {errors.code && touched.code ? (
                                            <div className="invalid-tooltip mt-25">{errors.code}</div>
                                        ) : null}
                                        <Label for="code">Code</Label>
                                    </FormGroup>
                                </Col>

                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="type"
                                            id="type"
                                            className={`form-control ${errors.type &&
                                                touched.type &&
                                                "is-invalid"}`}
                                        />
                                        {errors.type && touched.type ? (
                                            <div className="invalid-tooltip mt-25">{errors.type}</div>
                                        ) : null}
                                        <Label for="type">Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="isParent"
                                            id="isParent"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Checkbox
                                                    color="primary"
                                                    icon={<Check className="vx-icon" size={16} />}
                                                    label="Is Parent"
                                                    defaultChecked={false}
                                                    checked={field.value}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                />
                                            }
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="parent"
                                            id="parent"
                                            className={`form-control ${errors.parent &&
                                                touched.parent && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={parameters}
                                                    value={parameters ? parameters.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.terminal && touched.terminal ? (
                                            <div className="invalid-tooltip mt-25">{errors.terminal}</div>
                                        ) : null}
                                        <Label for="terminal">Terminal</Label>
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
                                            onClick={() => history.push("/dashboard/parametersetup/")}
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


export default CreateParameter