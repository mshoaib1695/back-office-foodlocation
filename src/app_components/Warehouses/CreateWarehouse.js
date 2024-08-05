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
import ReactSelect from "react-select"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    branch: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [branchsList, setBranchsList] = useState([])

    useEffect(() => {
        getBranchsList()
    }, [])
    const getBranchsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branchsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const submitHandler = (values) => {
        let data = {
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            client: client.clientId,
            branch: values.branch,
            description: values.description,
            name: values.name,
            nameAr: values.nameAr,
            address: values.address,
        }
      
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createWarehouse"
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/warehousesetup/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Warehouse</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        branch: "",
                        description: "",
                        name: "",
                        nameAr: "",
                        address: ""
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
                                            type="address"
                                            name="address"
                                            id="address"
                                            className={`form-control ${errors.address &&
                                                touched.address &&
                                                "is-invalid"}`}
                                        />
                                        {errors.address && touched.address ? (
                                            <div className="invalid-tooltip mt-25">{errors.address}</div>
                                        ) : null}
                                        <Label for="address">Address</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="branch"
                                            id="branch"
                                            className={`form-control ${errors.branch &&
                                                touched.branch && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={branchsList}
                                                    value={branchsList ? branchsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.branch && touched.branch ? (
                                            <div className="invalid-tooltip mt-25">{errors.branch}</div>
                                        ) : null}
                                        <Label for="branch" className="select-label"> Branch</Label>
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
                                            onClick={() => history.push("/dashboard/warehousesetup/")}
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
