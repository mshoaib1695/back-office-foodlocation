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
    Input,
    Label
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { getList, create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    ingrntProd: Yup.string().required("Required"),
    qty: Yup.string().required("Required"),
})

function ProductPrice(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [uomsList, setUomsList] = useState([])
    const [ingredientProductsListt, setIngredientProductsListt] = useState([])
    const [baseuom, setBaseuom] = useState('')
    const [currentCost, setCurrentCost] = useState(0)
    const [cost, setCost] = useState(0)
    const [baseuom_name, setBaseuom_name] = useState('')
    useEffect(() => {
        getUomsList()
        getIngredientProductsList()
    }, [])

    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                "product": props.menuId,
                "uom": baseuom,
                "ingrntProd": values.ingrntProd,
                "qty": values.qty
            },
            apiname: "createProdIngrnt",
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
    const getIngredientProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "ingredientProductsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setIngredientProductsListt(res.data.map(i => { return { baseUom: i.baseUom, value: i.id, label: i.name, currentCost: i.currentCost } }))
            })
    }
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

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const changeQty = (v) => {
        var costTemp = cost
        if (currentCost) {
            costTemp = v * currentCost
            setCost(costTemp)
        }
    }
    const productIngdntSelect = (event, currentQTY) => {
        let baseuomTemp, currentCostTemp, costTemp, baseuom_nameTemp
        if (ingredientProductsListt.length > 0) {
            if (ingredientProductsListt.filter(item => item.value == event).length > 0) {
                baseuomTemp = ingredientProductsListt.filter(item => item.value == event)[0].baseUom
                currentCostTemp = ingredientProductsListt.filter(item => item.value == event)[0].currentCost
                setBaseuom(baseuomTemp)
                setCurrentCost(currentCostTemp)
                if (currentQTY.getFieldMeta("qty").value) {
                    costTemp = ingredientProductsListt.filter(item => item.value == event)[0].currentCost * currentQTY.getFieldMeta("qty").value
                    setCost(costTemp)
                }
            }
        }
        if (uomsList.length > 0) {
            if (uomsList.filter(item => item.id == baseuomTemp).length > 0) {
                baseuom_nameTemp = uomsList.filter(item => item.id == baseuomTemp)[0].name
                setBaseuom_name(baseuom_nameTemp)
            }
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Product Ingredients</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        barCode: "",
                        collectPoints: "",
                        uom: baseuom,

                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="ingrntProd"
                                            id="ingrntProd"
                                            className={`form-control ${errors.ingrntProd &&
                                                touched.ingrntProd && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={ingredientProductsListt}
                                                    value={ingredientProductsListt ? ingredientProductsListt.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        productIngdntSelect(option.value, form)
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.ingrntProd && touched.ingrntProd ? (
                                            <div className="invalid-tooltip mt-25">{errors.ingrntProd}</div>
                                        ) : null}
                                        <Label for="ingrntProd">Product Ingredient</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field

                                            disabled={true}
                                            isMulti={false}
                                            name="uom"
                                            id="uom"
                                            className={`form-control ${errors.uom &&
                                                touched.uom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isDisabled={true}
                                                    options={uomsList}
                                                    value={uomsList ? uomsList.find(option => option.value === baseuom) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.uom && touched.uom ? (
                                            <div className="invalid-tooltip mt-25">{errors.uom}</div>
                                        ) : null}
                                        <Label for="uom">Base UOM</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="qty"
                                            name="qty"
                                            id="qty"

                                            onBlur={(v) => {
                                                changeQty(v.target.value)
                                            }}
                                            className={`form-control ${errors.salesPrice &&
                                                touched.salesPrice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.salesPrice && touched.salesPrice ? (
                                            <div className="invalid-tooltip mt-25">{errors.salesPrice}</div>
                                        ) : null}
                                        <Label for="salesPrice">Quantity</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={true}
                                            type="calculatedrpice"
                                            name="calculatedrpice"
                                            id="calculatedrpice"
                                            value={cost}
                                            className={`form-control ${errors.calculatedrpice &&
                                                touched.calculatedrpice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.calculatedrpice && touched.calculatedrpice ? (
                                            <div className="invalid-tooltip mt-25">{errors.calculatedrpice}</div>
                                        ) : null}
                                        <Label for="calculatedrpice">Cost</Label>
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


export default ProductPrice