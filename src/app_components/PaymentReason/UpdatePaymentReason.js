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
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { updateRole, roleByID } from '../../API_Helpers/roles'
import {create } from '../../API_Helpers/api'
import { getList } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
})

function UpdatePaymentReason() {
    const paymentReason = useSelector(state => state.updatescreens.paymentReason)
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [screenList, setScreenList] = useState([])
    const [screensList, setScreensList] = useState([])
    const [sendscreensList, setSendscreensList] = useState([])

    useEffect(() => {
        getScreensList()

    }, [])
    const getScreenList = (screensListParameter) => {
        let payload = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: paymentReason.id,
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        roleByID(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    setSendscreensList(res.data.object.screenList)
                    let newArray = []
                    let screensListTemp = [...screensListParameter]
                    res.data.object.screenList.forEach(item => {
                        newArray.push({ ...screensListParameter.filter(i => i.value == item.screenId)[0], editable: item.editable })
                        screensListTemp = [...screensListTemp.filter(i => i.value != item.screenId)]
                    })
                    setScreenList(newArray)
                    setScreensList(screensListTemp)
                }
            })
    }
    const getScreensList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "screensList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                getScreenList(res.data.map(i => { return { value: i.id, label: i.name } }))
                setScreensList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    // screensList
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                name: values.name,
                nameAr: values.nameAr,
                id: paymentReason.id,
                description: values.description,
                client: client.clientId
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updatePaymentReason"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/paymentreasons/")
                }
            })
    }
    const addScreenList = (value) => {
        let screen = { ...screensList.filter(i => i.value == value)[0] }
        let screenListTemp = [...screenList]
        let sendscreensListTemp = [...sendscreensList]
        let screensListTemp = [...screensList.filter(i => i.value != value)]
        screenListTemp.push({ ...screen, editable: false })
        sendscreensListTemp.push({ screenId: screen.value, editable: false })
        setScreenList(screenListTemp)
        setScreensList(screensListTemp)
        setSendscreensList(sendscreensListTemp)




    }
    const removeFromWarehouseList = (value) => {
        let screen = { ...screenList.filter(i => i.value == value)[0] }
        let screenListTemp = [...screenList.filter(i => i.value != value)]
        let sendscreensListTemp = [...sendscreensList.filter(i => i.screenId != value)]
        let screensListTemp = [...screensList]
        screensListTemp.push({ label: screen.label, value: screen.value })
        sendscreensList.push(screen)
        setScreenList(screenListTemp)
        setScreensList(screensListTemp)
        setSendscreensList(sendscreensListTemp)
    }
    const onChangeEditable = (row, value) => {
        let screenListTemp = [...screenList]
        let screenListTempIndex = screenListTemp.findIndex(i => i.value == row.value)
        if (screenListTempIndex != -1) {
            screenListTemp[screenListTempIndex].editable = value
            setScreenList(screenListTemp)
        }
        let sendscreensListTemp = [...sendscreensList]
        let sendscreensListTempIndex = sendscreensListTemp.findIndex(i => i.screenId == row.value)
        if (sendscreensListTempIndex != -1) {
            sendscreensListTemp[sendscreensListTempIndex].editable = value
            setSendscreensList(sendscreensListTemp)
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Payment Reasons</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: paymentReason.name,
                        nameAr: paymentReason.nameAr,
                        description: paymentReason.description,
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
                                            def
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
                                            onClick={() => history.push("/dashboard/paymentreasons/")}
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


export default UpdatePaymentReason