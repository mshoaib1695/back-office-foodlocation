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
    packageType: Yup.string().required("Required"),
    packageAmt: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [packageyupdate, setPackage] = useState(useSelector(state => state.updatescreens.package))

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 })
    }, [])

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                description: values.description,
                packageType: values.packageType,
                packageAmt: values.packageAmt,
                isDefault: values.isDefault,
                client: client.clientId,
                id: packageyupdate.id
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateAppPackage"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    history.push('/dashboard/package')
                }
            })
    }
  
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Package</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        packageType: packageyupdate.packageType,
                        packageAmt: packageyupdate.packageAmt,
                        description: packageyupdate.description,
                        isDefault: packageyupdate.isDefault
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
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="packageType"
                                            id="packageType"
                                            className={`form-control ${errors.packageType &&
                                                touched.packageType &&
                                                "is-invalid"}`}
                                        />
                                        {errors.packageType && touched.packageType ? (
                                            <div className="invalid-tooltip mt-25">{errors.packageType}</div>
                                        ) : null}
                                        <Label for="packageType">Package Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="packageAmt"
                                            id="packageAmt"
                                            className={`form-control ${errors.packageAmt &&
                                                touched.packageAmt &&
                                                "is-invalid"}`}
                                        />
                                        {errors.packageAmt && touched.packageAmt ? (
                                            <div className="invalid-tooltip mt-25">{errors.packageAmt}</div>
                                        ) : null}
                                        <Label for="packageAmt">Package Amount</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
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
                                <Col md="4" sm="12">
                                <FormGroup>
                                        <Field
                                            name="isDefault"
                                            id="isDefault"
                                            className={`form-control ${errors.isDefault &&
                                                touched.isDefault && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isDefault"
                                                    name="isDefault"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Default</span>
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
                                            onClick={() => history.push("/dashboard/package/")}
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