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
    Label
} from "reactstrap"
import { Formik, Field, Form , useFormik } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, getList, postWithPrams } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { toast } from "react-toastify"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    perfectCostPresentDown: Yup.number().required("Required").positive()
    .lessThan( 100, 'should be less than or equal to 100'),
    dangerCostPresentOver: Yup.number().required("Required").positive()
    .lessThan( 100, 'should be less than or equal to 100'),
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [getCostRate, setCostRate] = useState({})

    useEffect(() => {
        getBranchsList()

    }, [client])


    const getBranchsList = () => {
        if (client.clientId) {
            let data = {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
            let payload = {
                tokenType: user.tokenType,
                accessToken: user.accessToken,
                apiname: "getCostRate",
                data,
            }
            getList(payload)
                .then(res => {
                    if (res.data) {
                        setCostRate(res.data)
                    }
                })
        }
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                PerfectCostPresentDown: values.perfectCostPresentDown,
                DangerCostPresentOver: values.dangerCostPresentOver,
                clientId: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "UpdateCostRate"
        }
        postWithPrams(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    toast.success(res.data.message)
                    history.push('/dashboard/costprices')
                } else {
                    toast.error(res.data.message)
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Cost Price</CardTitle>
            </CardHeader>
            <CardBody>
                {
                    <Formik
                        initialValues={{
                            dangerCostPresentOver: getCostRate.dangerusCostOver,
                            perfectCostPresentDown: getCostRate.perfectCostDown,

                        }}
                        enableReinitialize
                        validationSchema={formSchema}
                        onSubmit={(values, actions) => {
                            submitHandler(values);
                            actions.setSubmitting(false);
                        }}

                    >
                        {({ errors, touched, values }) => (
                            <Form>
                                <Row>
                                    <Col md="4" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Field
                                                name="dangerCostPresentOver"
                                                id="dangerCostPresentOver"
                                                className={`form-control ${errors.dangerCostPresentOver &&
                                                    touched.dangerCostPresentOver &&
                                                    "is-invalid"}`}
                                            />
                                            {errors.dangerCostPresentOver && touched.dangerCostPresentOver ? (
                                                <div className="invalid-tooltip mt-25">{errors.dangerCostPresentOver}</div>
                                            ) : null}
                                            <Label for="dangerCostPresentOver">dangerCostPresentOver</Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md="4" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Field
                                                name="perfectCostPresentDown"
                                                id="perfectCostPresentDown"
                                                className={`form-control ${errors.perfectCostPresentDown &&
                                                    touched.perfectCostPresentDown &&
                                                    "is-invalid"}`}
                                            />
                                            {errors.perfectCostPresentDown && touched.perfectCostPresentDown ? (
                                                <div className="invalid-tooltip mt-25">{errors.perfectCostPresentDown}</div>
                                            ) : null}
                                            <Label for="perfectCostPresentDown">perfectCostPresentDown</Label>
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
                                                onClick={() => history.push("/dashboard/costprices/")}
                                            >
                                                Cancel
                                            </Button.Ripple>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                }
            </CardBody>
        </Card>
    )
}


export default CreateProduct