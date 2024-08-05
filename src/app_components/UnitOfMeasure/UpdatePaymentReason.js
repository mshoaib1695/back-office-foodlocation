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
import {create , getList} from '../../API_Helpers/api'
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
})

function UpdatePaymentReason() {
    const uom = useSelector(state => state.updatescreens.uom)
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [ uomsList, setUomsList] = useState([])
    const [ uomList, setUomList] = useState([])
    const [ sendUomList, setSendUomList] = useState([])

    useEffect(() => {
        getUomsList()
    },[])
    const getUomsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)
               
                getUomById(res.data.map(i => { return { value: i.id, label: i.name } }))
                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getUomById = (uomsListParameter) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomByID",
            data: {
                id: uom.id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setSendUomList(res.data.object.uomRelList)
                let newArray = []
                let uomsListTemp = [...uomsListParameter]
                res.data.object.uomRelList.forEach(item => {
                    newArray.push({ 
                        ...uomsListParameter.filter(i => i.value == item.uomId)[0], 
                        relValue: item.relValue })                    
                        uomsListTemp = [...uomsListTemp.filter(i => i.value != item.uomId)]
                })
                setUomList(newArray)
                setUomsList(uomsListTemp)
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                name: values.name,
                nameAr: values.nameAr,
                id: uom.id,
                description: values.description,
                client: client.clientId,
                uomRelList: sendUomList
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateUom"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/unitofmeasuresetup/")
                }
            })
    }
    const addUomToList = (value, realValue) => {
        let uomTemp = { ...uomsList.filter(i => i.value == value)[0] }
        let uomListTemp = [...uomList]
        let sendUomListTemp = [...sendUomList]
        let uomsListTemp = [...uomsList.filter(i => i.value != value)]
        uomListTemp.push({ ...uomTemp, relValue: realValue })
        sendUomListTemp.push({ uomId: uomTemp.value, relValue: realValue })
        setUomList(uomListTemp)
        setUomsList(uomsListTemp)
        setSendUomList(sendUomListTemp)
    }
    const removeFromUomList = (value, relValue) => {
        let uomTemp = { ...uomList.filter(i => i.value == value)[0] }
        let uomListTemp = [...uomList.filter(i => i.value != value)]
        let senduomsListTemp = [...sendUomList.filter(i => i.uomId != value)]
        let uomsListTemp = [...uomsList]
        uomsListTemp.push(uomTemp)
        setUomList(uomListTemp)
        setUomsList(uomsListTemp)
        setSendUomList(senduomsListTemp)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Unit Of Measure</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: uom.name,
                        nameAr: uom.nameAr,
                        description: uom.description,
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
                                            onClick={() => history.push("/dashboard/unitofmeasuresetup/")}
                                        >
                                            Cancel
                  </Button.Ripple>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                <AddToListComponent
                    list={uomsList}
                    onAddToList={(value, realValue) => addUomToList(value, realValue)}
                    data={uomList}
                    fieldTitle={"Assign Uom"}
                    onRemoveToList={(value, relValue) => removeFromUomList(value, relValue)}
                />
            </CardBody>
        </Card>
    )
}


export default UpdatePaymentReason