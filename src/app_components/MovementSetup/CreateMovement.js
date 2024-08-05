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
    Input
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux' 
import { history } from '../../history'
import Flatpickr from "react-flatpickr";
import moment from "moment"
import { create, getList, parametersListByParaType } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    description: Yup.string().required("Required"),
    movementDate: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [chargeTypeList, setChargeTypeList] = useState([])

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
            .then(res => { message(res)

                setChargeTypeList(res.data.map(i => { return { value: i.paramCode, label: i.name, id: i.id } }))
            })
    }

    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            description: values.description,
            movementDate: values.movementDate,
        }

        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createMovement"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/movementsetup/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Movement</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        description: "",
                        movementDate: moment(new Date()).format("YYYY-MM-DD")
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
                                        <p>Document No</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status</p>
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
                                            name="movementDate"
                                            id="movementDate"
                                            className={`form-control ${errors.movementDate &&
                                                touched.movementDate && "is-invalid"}`}
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
                                        {errors.movementDate && touched.movementDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.movementDate}</div>
                                        ) : null}
                                        <Label for="movementDate">Movement  Date</Label></FormGroup>
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
                                            onClick={() => history.push("/dashboard/movementsetup/")}
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
