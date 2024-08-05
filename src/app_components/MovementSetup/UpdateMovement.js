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
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, getList } from '../../API_Helpers/api'
import Tabs from './Tabs'
import Flatpickr from "react-flatpickr";
import moment from "moment"
import message from '../../API_Helpers/toast'
import { api_url1 } from '../../assets/constants/api_url'


const formSchema = Yup.object().shape({
    movementDate: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})

function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const[movement, setMovement ] = useState(useSelector(state => state.updatescreens.movement))

    const movementID = () => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: movement.id,
            },
            apiname:"movementByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                if(res.data.success){
                    setMovement(res.data.object)
                }
        })
    }
    const completeHandler = (v) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",               
                id: movement.id,
                actionBtn: v
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "completeMovement"
        }
        create(payload)
            .then(res => { message(res)
 
                message(res)
                if (res.data.success) {
                    movementID()
                }
            })
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            id: movement.id,
            description: values.description,
            movementDate: values.movementDate,
        }

        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateMovement"
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
                <CardTitle>Update Movement</CardTitle>
                <a
                            className="mr-1 mb-1 btn btn-primary"
                            href={`${api_url1}reports/frameset?__report=movement_report.rptdesign&__title=movement_report&__showtitle=false&movement_id=${movement.id}`}
                            style={
                                {
                                    "borderColor": "rgb(255, 54, 74)", "backgroundColor": "rgb(255, 54, 74)",
                                    "color": "#fff !important",
                                    "float": "left", "margin": "20px"
                                }
                            }
                            target="_blank"
                        > Movement Report</a>
                {movement.status == "DR" &&<Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => completeHandler() }
                >
                         Complete
                  </Button.Ripple>}
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        description: movement.description,
                        movementDate: movement.movementDate,
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
                                        <p>{movement.documentNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Status</p>
                                        <p>{movement.state == "CO" ? "Complete" : "Drafts"}</p>
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
            <Tabs movementId={movement.id} />
        </Card>
    )
}


export default CreateRole
