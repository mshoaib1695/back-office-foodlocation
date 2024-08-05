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
import { create, getList, postWithPrams } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import { toast } from "react-toastify"
import message from '../../API_Helpers/toast'
import moment from 'moment'
import Flatpickr from "react-flatpickr";

const formSchema = Yup.object().shape({
    newCost: Yup.number().required("Required").positive()
        .lessThan(100, 'should be less than or equal to 100'),
    productId: Yup.string().required("Required")
})

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        };
        getList(payload).then((res) => {
            message(res);

            setProducts(
                res.data.map((i) => {
                    return { value: i.id, label: i.name };
                })
            );
        });
    };
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                newCost: values.newCost,
                productId: values.productId,
                clientId: client.clientId,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateCurrentCost"
        }
        postWithPrams(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    toast.success(res.data.message)
                    history.push('/dashboard/productcostprices')
                } else {
                    toast.error(res.data.message)
                }
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>       Update Product Current Cost </CardTitle>

            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        newCost: null,
                        productId: null,

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
                                <Col md="4" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="newCost"
                                            id="newCost"
                                            className={`form-control ${errors.newCost &&
                                                touched.newCost &&
                                                "is-invalid"}`}
                                        />
                                        {errors.newCost && touched.newCost ? (
                                            <div className="invalid-tooltip mt-25">{errors.newCost}</div>
                                        ) : null}
                                        <Label for="newCost">New Cost</Label>
                                    </FormGroup>
                                    {console.log(errors)}
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="productId"
                                            id="productId"
                                            className={`form-control ${errors.productId &&
                                                touched.productId && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={products}
                                                    value={products ? products.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.productId && touched.productId ? (
                                            <div className="invalid-tooltip mt-25">{errors.productId}</div>
                                        ) : null}
                                        <Label for="productId" className="select-label">Product</Label>
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
                                            onClick={() => history.push("/dashboard/productcostprices/")}
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