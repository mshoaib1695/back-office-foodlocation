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
import { create } from '../../API_Helpers/api'
import Tabs from './Tabs'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    maxQty: Yup.string().required("Required"),
    minQty: Yup.string().required("Required"),
    seqNo: Yup.string().required("Required"),
    opt: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [comboOption, setcomboByID] = useState(useSelector(state => state.updatescreens.comboOption))

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                combo: props.comboId,
                seqNo: values.seqNo,
                opt: values.opt,
                minQty: values.minQty,
                maxQty: values.maxQty,
                id: comboOption.id
            },
            apiname: "updateComboOptLevel",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    props.goToSetup()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Combo Option</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        seqNo: comboOption.seqNo,
                        opt: comboOption.opt,
                        minQty: comboOption.minQty,
                        maxQty: comboOption.maxQty,
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
                                            type="seqNo"
                                            name="seqNo"
                                            id="seqNo"
                                            className={`form-control ${errors.seqNo &&
                                                touched.seqNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.seqNo && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.seqNo}</div>
                                        ) : null}
                                        <Label for="seqNo">seqNo</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="opt"
                                            name="opt"
                                            id="opt"
                                            className={`form-control ${errors.opt &&
                                                touched.opt &&
                                                "is-invalid"}`}
                                        />
                                        {errors.opt && touched.opt ? (
                                            <div className="invalid-tooltip mt-25">{errors.opt}</div>
                                        ) : null}
                                        <Label for="opt">Option</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="minQty"
                                            name="minQty"
                                            id="description"
                                            className={`form-control ${errors.minQty &&
                                                touched.minQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.minQty && touched.minQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.minQty}</div>
                                        ) : null}
                                        <Label for="minQty">Min Quantity</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="maxQty"
                                            name="maxQty"
                                            id="maxQty"
                                            className={`form-control ${errors.maxQty &&
                                                touched.maxQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.maxQty && touched.maxQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.maxQty}</div>
                                        ) : null}
                                        <Label for="maxQty">Max Quantity</Label>
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
                                            onClick={() => props.goToSetup()}
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
            <Tabs comboOptionId={comboOption.id}/>
        </Card>
    )
}


export default CreateProductOffer