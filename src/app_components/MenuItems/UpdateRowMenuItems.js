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
import { create, getList, createMultipartAPI } from '../../API_Helpers/api'
import ReactSelect from "react-select"
import Tabs from './Tabs'
import message from '../../API_Helpers/toast'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import { getImage } from '../../API_Helpers/getImage'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    prodKey: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const rowmaterial = useSelector(state => state.updatescreens.rowmaterial)
    const [isGroupProduct, setIsGroupProduct] = useState(rowmaterial.isGroupProduct)
    const [imgUrl, setImgUrl] = useState(null)
    const [imgfile, setImgfile] = useState(null)
    const [prodCatgry, setProdCatgry] = useState([])
    const [uomsList, setUomsList] = useState([])
    const [rowCatgry, setRowCatgry] = useState({})

    useEffect(() => {
        getProdCatList()
        getuomsList()
    }, [])

    const getProdCatList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productCatsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setRowCatgry(res.data.filter(i => i.name == "ROW_MATERIAL")[0])
                setProdCatgry(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getuomsList = () => {
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
            .then(res => {
                message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    useEffect(() => {
        if(rowmaterial && rowmaterial.prodImg){
            getImageFunction()
        }
    }, [rowmaterial])
    const getImageFunction = () => {
        if (rowmaterial.prodImg) {
            let payload = {
                imageId: rowmaterial.prodImg,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                tokenType: user.tokenType,
                accessToken: user.accessToken,
            }
            getImage(payload)
                .then(res => {
                    message(res)

                    var reader = new FileReader();
                    reader.readAsDataURL(res.data);
                    reader.onloadend = () => {
                        setImgUrl(reader.result)
                    }
                })
        }
    }
    const handleImageUpload = (e) => {
        e.preventDefault();
        if (e.currentTarget.files && e.currentTarget.files[0]) {
            var file = e.currentTarget.files[0];
            let fileName = file.name;
            let extension = fileName.substring(fileName.lastIndexOf('.') + 1);
            if (file.size <= 1024 * 1024 * 2 && /png|jpe?g/i.test(extension)) {
                setImgUrl(URL.createObjectURL(file))
                setImgfile(file)
                let imgdata = new FormData();
                imgdata.append('file', file);
                imgdata.append('id', rowmaterial.id);
                imgdata.append('lang', "EN");
                imgdata.append('clientId', client.clientId);
                let payload = {
                    data: imgdata,
                    tokenType: user.tokenType,
                    accessToken: user.accessToken,
                    apiname: "updateProductImg"
                }
                createMultipartAPI(payload)
                    .then(res => {
                        message(res)

                        return
                    })
            }
            else {
                document.getElementById('file').value = ''
            }
        }
    }
    const submitHandler = (values) => {
        let data = {
            'lang': "EN",
            "id": rowmaterial.id,
            'client': client.clientId,
            'isPurchasedProduct': false,
            'isUomProduct': true,
            'nameAr': values.nameAr,
            'name': values.name,
            'isFinalProduct': true,
            'prodKey': values.prodKey,
            'description': values.description,
            'isCheckLowLimit': values.isCheckLowLimit,
            'isDirectProduct': values.isDirectProduct,
            'isActive': values.isActive,
            'baseUom': values.baseUom,
            'expiryPeriod': 12,
            'seqNo': 12,
            "isScaleProduct": values.isScaleProduct,
            "isBarcodeProduct": values.isBarcodeProduct,
            "isGroupItem": values.isGroupItem,
            "isGroupProduct": values.isGroupProduct,
            "isOnline": values.isOnline,
            "costType": values.costType,
            "currentCost": values.currentCost,

        };
        if (values.maxItemQty) {
            data.maxItemQty = values.maxItemQty
        } else {
            data.maxItemQty = rowmaterial.maxItemQty

        }
        if (values.minItemQty) {
            data.minItemQty = values.minItemQty
        } else {
            data.minItemQty = rowmaterial.minItemQty

        }
        data.category = values.category
        // if (values.isDirectProduct) {
        // } else {
        //     data.category = rowCatgry.id
        // }
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateProduct"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    history.push("/dashboard/menuitems/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Menu Item</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: rowmaterial.name,
                        nameAr: rowmaterial.nameAr,
                        description: rowmaterial.description,
                        prodKey: rowmaterial.prodKey,
                        isActive: rowmaterial.isActive,
                        isScaleProduct: rowmaterial.isScaleProduct,
                        isBarcodeProduct: rowmaterial.isBarcodeProduct,
                        isGroupItem: rowmaterial.isGroupItem,
                        isGroupProduct: rowmaterial.isGroupProduct,
                        isOnline: rowmaterial.isOnline,
                        category: rowmaterial.category,
                        baseUom: rowmaterial.baseUom,
                        costType: rowmaterial.costType,
                        currentCost: rowmaterial.currentCost,
                        minItemQty: rowmaterial.minItemQty,
                        maxItemQty: rowmaterial.maxItemQty,
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
                                            type="prodKey"
                                            name="prodKey"
                                            id="prodKey"
                                            className={`form-control ${errors.prodKey &&
                                                touched.prodKey &&
                                                "is-invalid"}`}
                                        />
                                        {errors.prodKey && touched.prodKey ? (
                                            <div className="invalid-tooltip mt-25">{errors.prodKey}</div>
                                        ) : null}
                                        <Label for="prodKey">Product Key</Label>
                                    </FormGroup>
                                </Col>

                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isActive"
                                            id="isActive"
                                            className={`form-control ${errors.isActive &&
                                                touched.isActive && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isActive"
                                                    name="isActive"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Active</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isScaleProduct"
                                            id="isScaleProduct"
                                            className={`form-control ${errors.isScaleProduct &&
                                                touched.isScaleProduct && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isScaleProduct"
                                                    name="isScaleProduct"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Scale Product</span>
                                                </CustomInput>}
                                        />

                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isBarcodeProduct"
                                            id="isBarcodeProduct"
                                            className={`form-control ${errors.isBarcodeProduct &&
                                                touched.isBarcodeProduct && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isBarcodeProduct"
                                                    name="isBarcodeProduct"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Barcode Product</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isGroupProduct"
                                            id="isGroupProduct"
                                            className={`form-control ${errors.isGroupProduct &&
                                                touched.isGroupProduct && "is-invalid"}`}
                                            component={({ field, form, values }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isGroupProduct"
                                                    name="isGroupProduct"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        if (form.values.isGroupItem || option.target.checked) {
                                                            form.setFieldValue("isGroupItem", false)
                                                        }
                                                        setIsGroupProduct(option.target.checked)
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Group Product</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isGroupItem"
                                            id="isGroupItem"
                                            className={`form-control ${errors.isGroupItem &&
                                                touched.isGroupItem && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isGroupItem"
                                                    name="isGroupItem"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        if (form.values.isGroupProduct || option.target.checked) {
                                                            form.setFieldValue("isGroupProduct", false)
                                                            setIsGroupProduct(false)
                                                        }
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Group Item</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isOnline"
                                            id="isOnline"
                                            className={`form-control ${errors.isOnline &&
                                                touched.isOnline && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isOnline"
                                                    name="isOnline"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Online</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                {values.isDirectProduct && <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="category"
                                            id="category"
                                            className={`form-control ${errors.category &&
                                                touched.category && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={prodCatgry}
                                                    value={prodCatgry ? prodCatgry.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.category && touched.category ? (
                                            <div className="invalid-tooltip mt-25">{errors.category}</div>
                                        ) : null}
                                        <Label for="category">Row Category</Label>
                                    </FormGroup>
                                </Col>}
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                    <Field
                                            type="baseUom"
                                            name="baseUom"
                                            id="baseUom"
                                            value={uomsList ? uomsList.find(option => option.value === values.baseUom)?.label : ''}
                                            disabled
                                            className={`form-control ${errors.description &&
                                                touched.description &&
                                                "is-invalid"}`}
                                        />
                                        <Label for="description">Base UOM</Label>
                                        {/* <Field
                                            name="baseUom"
                                            id="baseUom"
                                            className={`form-control ${errors.baseUom &&
                                                touched.baseUom && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={uomsList}
                                                    value={uomsList ? uomsList.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.baseUom && touched.baseUom ? (
                                            <div className="invalid-tooltip mt-25">{errors.baseUom}</div>
                                        ) : null}
                                        <Label for="baseUom">Base UOM</Label> */}
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="category"
                                            id="category"
                                            className={`form-control ${errors.category &&
                                                touched.category && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={prodCatgry}
                                                    value={prodCatgry ? prodCatgry.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.category && touched.category ? (
                                            <div className="invalid-tooltip mt-25">{errors.category}</div>
                                        ) : null}
                                        <Label for="category">Row Category</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="costType"
                                            id="costType"
                                            className={`form-control ${errors.costType &&
                                                touched.costType && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <>
                                                    <FormGroup check inline>
                                                        <Label check>
                                                            <Input type="radio" name="costType" checked={field.value == "F"} value={"F"}
                                                                onChange={(e) => {
                                                                    form.setFieldValue(field.name, e.target.value)
                                                                }} /> Fixed
                                                        </Label>
                                                    </FormGroup>
                                                    <FormGroup check inline>
                                                        <Label check>
                                                            <Input type="radio" name="costType" checked={field.value == "A"} value={"A"}
                                                                onChange={(e) => {
                                                                    form.setFieldValue(field.name, e.target.value)
                                                                }} /> Average
                                                        </Label>
                                                    </FormGroup>
                                                </>}
                                        />

                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            disabled={values.costType == "A" ? true : false}
                                            type="currentCost"
                                            name="currentCost"
                                            id="currentCost"
                                            className={`form-control ${errors.currentCost &&
                                                touched.currentCost &&
                                                "is-invalid"}`}
                                        />
                                        {errors.currentCost && touched.currentCost ? (
                                            <div className="invalid-tooltip mt-25">{errors.currentCost}</div>
                                        ) : null}
                                        <Label for="currentCost">Current Cost </Label>
                                    </FormGroup>
                                </Col>
                                {isGroupProduct && <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            // disabled={values.costType == "A" ? true : false}
                                            type="minItemQty"
                                            name="minItemQty"
                                            id="minItemQty"
                                            className={`form-control ${errors.minItemQty &&
                                                touched.minItemQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.minItemQty && touched.minItemQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.minItemQty}</div>
                                        ) : null}
                                        <Label for="minItemQty">Min Item Quantity </Label>
                                    </FormGroup>
                                </Col>}
                                {isGroupProduct && <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            // disabled={values.costType == "A" ? true : false}
                                            type="maxItemQty"
                                            name="maxItemQty"
                                            id="maxItemQty"
                                            className={`form-control ${errors.maxItemQty &&
                                                touched.maxItemQty &&
                                                "is-invalid"}`}
                                        />
                                        {errors.maxItemQty && touched.maxItemQty ? (
                                            <div className="invalid-tooltip mt-25">{errors.maxItemQty}</div>
                                        ) : null}
                                        <Label for="maxItemQty">Max Item Quantity </Label>
                                    </FormGroup>
                                </Col>}
                                <Col md="6" sm="12">
                                    <FormGroup>
                                        <span>
                                            <p>Upload files under 2MB, and only in png/jpg/jpeg formats</p>
                                            <Avatar img={imgUrl || '/dummylogo.png'} size="xl" />
                                            <Input type="file" id="file" className="file" onChange={handleImageUpload} />
                                        </span>
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
                                            onClick={() => history.push("/dashboard/menuitems/")}
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
            <Tabs
                menuId={rowmaterial.id}
                isDirectProduct={rowmaterial.isDirectProduct}
                isGroupProduct={isGroupProduct}
            />
        </Card>
    )
}


export default CreateRole
