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
    groupItem: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [additionalsList, setAdditionalsList] = useState([])

    useEffect(() => {
        getAdditionalsList()
    }, [])
    const getAdditionalsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "groupItemProductsList",
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
                groupItem: values.groupItem
            },
            apiname: "createProdGroupItem",
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
                <CardTitle>Add Product Group Item</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        groupItem: null
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
                                            name="groupItem"
                                            id="groupItem"
                                            className={`form-control ${errors.groupItem &&
                                                touched.groupItem && "is-invalid"}`}
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
                                                /><Label for="groupItem">Group Item</Label></>}
                                        />
                                        {errors.groupItem && touched.groupItem ? (
                                            <div className="invalid-tooltip mt-25">{errors.groupItem}</div>
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