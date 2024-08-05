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
import { getList, create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    additional: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [additionalsList, setAdditionalsList] = useState([])
    const productAddtional = useSelector(state => state.updatescreens.productAddtional)  

    useEffect(() => {
        getAdditionalsList()
    }, [])
    const getAdditionalsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "additionalsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setAdditionalsList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                product: props.menuId,
                additional: values.additional
            },
            apiname: "updateProdAdd",
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
                <CardTitle>Create Product Additionals</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        additional: productAddtional.additional
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
                                            name="additional"
                                            id="additional"
                                            className={`form-control ${errors.additional &&
                                                touched.additional && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <><ReactSelect
                                                    isMulti={false}
                                                    options={additionalsList}
                                                    value={additionalsList ? additionalsList.find(option => option.value === field.value) : ''}
                                                    error={errors.state}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)

                                                    }}
                                                    onBlur={field.onBlur}
                                                /><Label for="additional">Additional Product</Label></>}
                                        />
                                        {errors.additional && touched.additional ? (
                                            <div className="invalid-tooltip mt-25">{errors.additional}</div>
                                        ) : null}

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
        </Card>
    )
}


export default CreateProductOffer  