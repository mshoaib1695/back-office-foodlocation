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
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    floorNo: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const floor = useSelector(state => state.updatescreens.floor)

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                id:floor.id,
                product: props.rowMatId,
                description: values.description,
                name: values.name,
                nameAr: values.nameAr,
                floorNo: values.floorNo,
                branch: props.branchId,
            },
            apiname: "updateFloor",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        create(payload)
            .then(res => { message(res)

                message(res)
                if (res.data.success) {
                    props.goToSetup()
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Floor</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        description: floor.description,
                        name: floor.name,
                        nameAr: floor.nameAr,
                        floorNo: floor.floorNo,
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
                                        <Label for="nameAr">Arabic Name</Label>
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
                                            type="floorNo"
                                            name="floorNo"
                                            id="floorNo"
                                            className={`form-control ${errors.floorNo &&
                                                touched.floorNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.floorNo && touched.floorNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.floorNo}</div>
                                        ) : null}
                                        <Label for="floorNo">Floo rNo</Label>
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
                <Tabs floorId={floor.id}/>
            </CardBody>
        </Card>
    )
}


export default CreateProductOffer