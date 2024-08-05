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
import { create, getList } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { toast } from "react-toastify"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    nameAr: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    offerCategory: Yup.string().required("Required"),
    buyQty: Yup.string().required("Required"),
    getQty: Yup.string().required("Required"),
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [ProductsList, setPaymentMethodsList] = useState([])


    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getProductsList()

    }, [])
    const getProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParaType",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                paraType: 'OFFER_TYPES'

            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setPaymentMethodsList(res.data.map(i => { return { value: i.paramCode, label: i.name } }))

            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                name: values.name,
                nameAr: values.nameAr,
                buyQty: values.buyQty,
                getQty: values.getQty,
                offerCategory: values.offerCategory,
                client: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createOfferType"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    toast.success(res.data.message)
                    history.push('/dashboard/offers')
                } else {
                    toast.error(res.data.message)
                }
            })
    }
   
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Offer</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        nameAr: '',
                        nameAr: '',
                        offerCategory: null,
                        buyQty: null,
                        getQty: null,
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
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="nameAr"
                                            id="nameAr"
                                            className={`form-control ${errors.nameAr &&
                                                touched.nameAr &&
                                                "is-invalid"}`}
                                        />
                                        {errors.nameAr && touched.name ? (
                                            <div className="invalid-tooltip mt-25">{errors.nameAr}</div>
                                        ) : null}
                                        <Label for="nameAr">Arabic Name</Label>
                                    </FormGroup>
                                </Col>



                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="offerCategory"
                                            id="offerCategory"
                                            className={`form-control ${errors.offerCategory &&
                                                touched.offerCategory && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={ProductsList}
                                                    value={ProductsList ? ProductsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.offerCategory && touched.offerCategory ? (
                                            <div className="invalid-tooltip mt-25">{errors.offerCategory}</div>
                                        ) : null}
                                        <Label for="offerCategory" className="select-label">Offer Category</Label>
                                    </FormGroup>
                                </Col>

                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="buyQty"
                                            id="buyQty"
                                            className={`form-control ${errors.buyQty &&
                                                touched.buyQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.buyQty && touched.buyQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.buyQty}</div>
                                        ) : null}
                                        <Label for="buyQty">Buy Quantity</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="getQty"
                                            id="getQty"
                                            className={`form-control ${errors.getQty &&
                                                touched.getQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.getQty && touched.getQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.getQty}</div>
                                        ) : null}
                                        <Label for="getQty">Get Quantity</Label>
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
                                            onClick={() => history.push("/dashboard/offers/")}
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