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
    Label,
    CustomInput
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { getList, create } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import moment from "moment"
import Flatpickr from "react-flatpickr";
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    offerType: Yup.string().required("Required"),
    startDate: Yup.string().required("Required"),
    endDate: Yup.string().required("Required"),
    startTime: Yup.string().required("Required"),
    endTime: Yup.string().required("Required"),
    collectPoints: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const productOfferId = useSelector(state => state.updatescreens.productOffer)  
    const [productOffer, setProductOffer] = useState({...productOfferId})
    const [uomsList, setUomsList] = useState({})
    const [offerTypesList, setOfferTypesList] = useState([])
    const [branchsList, setBranchsList] = useState([])
    const [branchList, setBranchList] = useState([])
    const [sendBranchList, setSendBranchList] = useState([])
    const [baseuom, setBaseuom] = useState('')
    const [currentCost, setCurrentCost] = useState(0)
    const [cost, setCost] = useState(0)
    const [offerCategory, setOfferCategory] = useState('')
    useEffect(() => {
        getUomsList()
        getBranchsList()
        getIngredientProductsList()
    }, [])
  
    const getproductOffer = (branchsListParameter) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "prodOfferByID",
            data: {
                id: productOfferId.id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setProductOffer(res.data.object) 
                let newArray = []
                let branchsListTemp = [...branchsListParameter]
                res.data.object.branchList.forEach(item => {
                    newArray.push({ ...branchsListParameter.filter(i => i.value == item)[0] })
                    branchsListTemp = branchsListParameter.filter(i => i.value != item)
                })
                setBranchList(newArray)
                setProductOffer(res.data.object)                
                setSendBranchList(res.data.object.branchList)
                setBranchsList(branchsListTemp)
            })
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                product: props.menuId,
                name: values.name,
                offerType: values.offerType,
                startTime: values.startTime,
                endTime: values.endTime,
                startDate: values.startDate,
                endDate: values.endDate,
                offerPrice: values.offerPrice,
                offerPriceTax: values.offerPriceTax,
                offPtg: values.offPtg,
                collectPoints: values.collectPoints,
                isSat: values.isSat,
                isSun: values.isSun,
                isMon: values.isMon,
                isTue: values.isTue,
                isWed: values.isWed,
                isThu: values.isThu,
                isFri: values.isFri,
                branchList: sendBranchList,
                id: productOffer.id
            },
            apiname: "updateProdOffer",
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
            apiname: "offerTypesList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setOfferTypesList(res.data.map(i => { return { baseUom: i.baseUom, value: i.id, label: i.name, currentCost: i.currentCost } }))
            })
    }
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
            .then( async res => {
               await setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))
               getproductOffer(res.data.map(i => { return { value: i.id, label: i.name } }))
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
    const addBranchList = (value) => {
        let branch = { ...branchsList.filter(i => i.value == value)[0] }
        let branchListTemp = [...branchList]
        let sendBranchListTemp = [...sendBranchList]
        let branchsListTemp = [...branchsList.filter(i => i.value != value)]

        branchListTemp.push(branch)
        sendBranchListTemp.push(branch.value)
        setBranchList(branchListTemp)
        setBranchsList(branchsListTemp)
        setSendBranchList(sendBranchListTemp)
    }
    const removeFromBranchList = (value) => {
        let branch = { ...branchList.filter(i => i.value == value)[0] }
        let branchListTemp = [...branchList.filter(i => i.value != value)]       
        let sendBranchListTemp = [...sendBranchList.filter(i => i != value)]
        let branchsListTemp = [...branchsList]
        branchsListTemp.push(branch)
        setBranchList(branchListTemp)
        setBranchsList(branchsListTemp)
        setSendBranchList(sendBranchListTemp)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Product Offer</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: productOffer.name,
                        isSat: productOffer.isSat,
                        isSun: productOffer.isSun,
                        isMon: productOffer.isMon,
                        isTue: productOffer.isTue,
                        isWed: productOffer.isWed,
                        isThu: productOffer.isThu,
                        isFri: productOffer.isFri,
                        startDate: productOffer.startDate,
                        endDate: productOffer.endDate,
                        startTime: productOffer.startTime,
                        endTime: productOffer.endTime,
                        offerPrice: productOffer.offerPrice,
                        offerPriceTax: productOffer.offerPriceTax,
                        offerType: productOffer.offerType,
                        offPtg: productOffer.offPtg,
                        collectPoints: productOffer.collectPoints,
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
                                            name="offerType"
                                            id="offerType"
                                            className={`form-control ${errors.offerType &&
                                                touched.offerType && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={offerTypesList}
                                                    value={offerTypesList ? offerTypesList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        let payload = {
                                                            tokenType: user.tokenType,
                                                            accessToken: user.accessToken,
                                                            apiname: "offerTypeByID",
                                                            data: {
                                                                id: option.value,
                                                                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                                                            },
                                                        }
                                                        getList(payload)
                                                            .then(res => { message(res)

                                                                setOfferCategory(res.data.object.offerCategory)
                                                            })
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.offerType && touched.offerType ? (
                                            <div className="invalid-tooltip mt-25">{errors.offerType}</div>
                                        ) : null}
                                        <Label for="offerType">Offer Type</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="startDate"
                                            id="startDate"
                                            className={`form-control ${errors.startDate &&
                                                touched.startDate && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("YYYY-MM-DD"))
                                                    }}
                                                />}
                                        />
                                        {errors.startDate && touched.startDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.startDate}</div>
                                        ) : null}
                                        <Label for="startDate">Start Date</Label></FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="endDate"
                                            id="endDate"
                                            className={`form-control ${errors.endDate &&
                                                touched.endDate && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("YYYY-MM-DD"))
                                                    }}
                                                />}
                                        />
                                        {errors.endDate && touched.endDate ? (
                                            <div className="invalid-tooltip mt-25">{errors.endDate}</div>
                                        ) : null}
                                        <Label for="endDate">End Date</Label></FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="startTime"
                                            id="startTime"
                                            className={`form-control ${errors.startTime &&
                                                touched.startTime && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("HH:mm:ss"))
                                                    }}
                                                />}
                                        />
                                        {errors.startTime && touched.startTime ? (
                                            <div className="invalid-tooltip mt-25">{errors.startTime}</div>
                                        ) : null}
                                        <Label for="startTime">Start Time</Label></FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="endTime"
                                            id="endTime"
                                            className={`form-control ${errors.endTime &&
                                                touched.endTime && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <Flatpickr
                                                    options={{
                                                        enableTime: true,
                                                        noCalendar: true,
                                                        dateFormat: "H:i",
                                                    }}
                                                    className="form-control"
                                                    value={field.value}
                                                    onChange={date => {
                                                        form.setFieldValue(field.name, moment(date[0]).format("HH:mm:ss"))
                                                    }}
                                                />}
                                        />
                                        {errors.endTime && touched.endTime ? (
                                            <div className="invalid-tooltip mt-25">{errors.endTime}</div>
                                        ) : null}
                                        <Label for="endTime">End Time</Label></FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="offerPrice"
                                            name="offerPrice"
                                            id="offerPrice"
                                            onBlur={(v) => {
                                                getList({
                                                    apiname: "salesPricewithTax",
                                                    tokenType: user.tokenType,
                                                    accessToken: user.accessToken,
                                                    data: {
                                                        salesPrice: v.target.value,
                                                        tax: client.tax,
                                                    }
                                                })
                                                    .then(res => { message(res)

                                                        setFieldValue("offerPriceTax", res.data)
                                                    })
                                            }}
                                            disabled={offerCategory == 'PTG' ? true : false}
                                            className={`form-control ${errors.offerPrice &&
                                                touched.offerPrice &&
                                                "is-invalid"}`}
                                        />
                                        {errors.offerPrice && touched.offerPrice ? (
                                            <div className="invalid-tooltip mt-25">{errors.offerPrice}</div>
                                        ) : null}
                                        <Label for="offerPrice">Offer Price</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={offerCategory == 'PTG' ? true : false}
                                            type="offerPriceTax"
                                            name="offerPriceTax"
                                            id="offerPriceTax"
                                            onBlur={(v) => {
                                                getList({
                                                    apiname: "salesPricewithoutTax",
                                                    tokenType: user.tokenType,
                                                    accessToken: user.accessToken,
                                                    data: {
                                                        salesPriceTax: v.target.value,
                                                        tax: client.tax,
                                                    }
                                                })
                                                    .then(res => { message(res)

                                                        setFieldValue("offerPrice", res.data)
                                                    })
                                            }}
                                            className={`form-control ${errors.offerPriceTax &&
                                                touched.offerPriceTax &&
                                                "is-invalid"}`}
                                        />
                                        {errors.offerPriceTax && touched.offerPriceTax ? (
                                            <div className="invalid-tooltip mt-25">{errors.offerPriceTax}</div>
                                        ) : null}
                                        <Label for="offerPriceTax">Offer Price Tax</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={offerCategory == 'PRC' ? true : false}
                                            type="offPtg"
                                            name="offPtg"
                                            id="offPtg"
                                            className={`form-control ${errors.offPtg &&
                                                touched.offPtg &&
                                                "is-invalid"}`}
                                        />
                                        {errors.offPtg && touched.offPtg ? (
                                            <div className="invalid-tooltip mt-25">{errors.offPtg}</div>
                                        ) : null}
                                        <Label for="offPtg">Offer Price Percentage</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="collectPoints"
                                            name="collectPoints"
                                            id="collectPoints"
                                            className={`form-control ${errors.collectPoints &&
                                                touched.collectPoints &&
                                                "is-invalid"}`}
                                        />
                                        {errors.collectPoints && touched.collectPoints ? (
                                            <div className="invalid-tooltip mt-25">{errors.collectPoints}</div>
                                        ) : null}
                                        <Label for="collectPoints">Collection Points</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isSat"
                                            id="isSat"
                                            className={`form-control ${errors.isSat &&
                                                touched.isSat && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSat"
                                                    name="isSat"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Saturday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isSun"
                                            id="isSun"
                                            className={`form-control ${errors.isSun &&
                                                touched.isSun && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSun"
                                                    name="isSun"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Sunday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isMon"
                                            id="isMon"
                                            className={`form-control ${errors.isMon &&
                                                touched.isMon && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isMon"
                                                    name="isMon"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Monday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isTue"
                                            id="isTue"
                                            className={`form-control ${errors.isTue &&
                                                touched.isTue && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isTue"
                                                    name="isTue"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Tuesday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isWed"
                                            id="isWed"
                                            className={`form-control ${errors.isWed &&
                                                touched.isWed && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isWed"
                                                    name="isWed"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Wednesday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isThu"
                                            id="isThu"
                                            className={`form-control ${errors.isThu &&
                                                touched.isThu && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isThu"
                                                    name="isThu"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Thursday</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isFri"
                                            id="isFri"
                                            className={`form-control ${errors.isFri &&
                                                touched.isFri && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isFri"
                                                    name="isFri"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Friday</span>
                                                </CustomInput>}
                                        />
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
            <AddToListComponent
                list={branchsList}
                onAddToList={(value => addBranchList(value))}
                data={branchList}
                fieldTitle={"Branch Name"}
                onRemoveToList={(value) => removeFromBranchList(value)}
            />
        </Card>
    )
}


export default CreateProductOffer