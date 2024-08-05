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
import { create, getList, gridDataByClient } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const additional = useSelector(state => state.updatescreens.additional)
    const [uomsList, setUomsList] = useState([])
    const [uomList, setUomList] = useState([])
    const [sendUomList, setSendUomList] = useState([])
    useEffect(() => {
        getUomsList()
    }, [])

    const getUomsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "additionalProductsList",
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
            apiname: "additionalByID",
            data: {
                id: additional.id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setSendUomList(res.data.object.productList)
                let newArray = []
                let uomsListTemp = [...uomsListParameter]
                res.data.object.productList.forEach(item => {
                    newArray.push({
                        ...uomsListParameter.filter(i => i.value == item)[0]
                    })
                    uomsListTemp = [...uomsListTemp.filter(i => i.value != item)]
                })
                setUomList(newArray)
                setUomsList(uomsListTemp)
            })
    }
    const addUomToList = (value) => {
        let uomTemp = { ...uomsList.filter(i => i.value == value)[0] }
        let uomListTemp = [...uomList]
        let sendUomListTemp = [...sendUomList]
        let uomsListTemp = [...uomsList.filter(i => i.value != value)]
        uomListTemp.push({ ...uomTemp })
        sendUomListTemp.push(uomTemp.value)
        setUomList(uomListTemp)
        setUomsList(uomsListTemp)
        setSendUomList(sendUomListTemp)
    }
    const removeFromUomList = (value) => {
        let uomTemp = { ...uomList.filter(i => i.value == value)[0] }
        let uomListTemp = [...uomList.filter(i => i.value != value)]
        let senduomsListTemp = [...sendUomList.filter(i => i != value)]
        let uomsListTemp = [...uomsList]
        uomsListTemp.push(uomTemp)
        setUomList(uomListTemp)
        setUomsList(uomsListTemp)
        setSendUomList(senduomsListTemp)
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: additional.id,
            client: client.clientId,
            name: values.name,
            nameAr: values.nameAr,
            productList:sendUomList,
            description: values.description,
        }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateAdditional"
        }
        create(payload)
            .then(res => { message(res)

                message(res)
                if (res.data.success) {
                    history.push("/dashboard/additionalsetup/")
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Addtional</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: additional.name,
                        nameAr: additional.nameAr,
                        description: additional.description,
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
                                            onClick={() => history.push("/dashboard/additionalsetup/")}
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
                    onAddToList={(value) => addUomToList(value)}
                    data={uomList}
                    fieldTitle={"Assign Product"}
                    onRemoveToList={(value) => removeFromUomList(value)}
                />
            </CardBody>

        </Card>
    )
}


export default CreateRole
