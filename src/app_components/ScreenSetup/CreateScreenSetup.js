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
import { create,getList } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'
import ReactSelect from "react-select"


const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    url: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    screenGroup: Yup.string().required("Required"),

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
            apiname: "parametersListByParaType",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                paraType: 'SCREEN_GROUP'

            },
        }
        getList(payload)
            .then(res => {
                message(res)
                setScreensGroup(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                url: values.url,
                description: values.description,
                name: values.name,
                screenGroup: values.screenGroup,
                nameAr: values.nameAr,
                client: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createScreen"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    history.push('/dashboard/screensetup')
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Screen</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: '',
                        nameAr: '',
                        url: '',
                        description: '',
                        screenGroup: null
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
                                            name="url"
                                            id="url"
                                            className={`form-control ${errors.url &&
                                                touched.url &&
                                                "is-invalid"}`}
                                        />
                                        {errors.url && touched.url ? (
                                            <div className="invalid-tooltip mt-25">{errors.url}</div>
                                        ) : null}
                                        <Label for="url">URL</Label>
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
                                            name="screenGroup"
                                            id="screenGroup"
                                            className={`form-control ${errors.screenGroup &&
                                                touched.screenGroup && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={screensGroup}
                                                    value={screensGroup ? screensGroup.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.screenGroup && touched.screenGroup ? (
                                            <div className="invalid-tooltip mt-25">{errors.screenGroup}</div>
                                        ) : null}
                                        <Label for="screenGroup" className="select-label">Screen Group</Label>
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
                        </Form>
                    )}
                </Formik>
            </CardBody>
        </Card>
    )
}


export default CreateProduct