import { func, number } from 'prop-types'
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
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, createMultipartAPI } from '../../API_Helpers/api'
import { getImage } from '../../API_Helpers/getImage'
import message from '../../API_Helpers/toast'
import AddToListComponent from './AddToListComponent'
import { getList } from '../../API_Helpers/api'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    seqNo: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})

function CreateVendor() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [imgUrl, setImgUrl] = useState(null)
    const [imgfile, setImgfile] = useState(null)
    const prodCatgry = useSelector(state => state.updatescreens.prodCatgry)
    const [screenList, setScreenList] = useState([])
    const [screensList, setScreensList] = useState([])
    const [sendscreensList, setSendscreensList] = useState([])
    const [isSeven24, setIsSeven24] = useState(false)

    useEffect(() => {   
        setIsSeven24(prodCatgry.isSeven24)
    }, [JSON.stringify(prodCatgry)])
    useEffect(() => {
        getImageFunction()
        getScreensList()
    }, [])
    const getScreenList = (screensListParameter) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productCatByID",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: prodCatgry.id,
            },
        }


        getList(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    setSendscreensList(res.data.object.shifts)
                    let newArray = []
                    let screensListTemp = [...screensListParameter]
                    res.data.object.shifts.forEach(item => {
                        newArray.push({ ...screensListParameter.filter(i => i.value == item)[0] })
                        screensListTemp = [...screensListTemp.filter(i => i.value != item)]
                    })
                    setScreenList(newArray)
                    setScreensList(screensListTemp)
                }
            })
    }
    const getScreensList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "shiftsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)
                getScreenList(res.data.map(i => { return { value: i.id, label: i.name } }))
                setScreensList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }
    const getImageFunction = () => {
        let payload = {
            imageId: prodCatgry.catImg,
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
                imgdata.append('id', prodCatgry.id);
                imgdata.append('lang', "EN");
                imgdata.append('clientId', client.clientId);
                let payload = {
                    data: imgdata,
                    tokenType: user.tokenType,
                    accessToken: user.accessToken,
                    apiname: "updateProductCatImg"
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
        let payload = {
            data: {
                id: prodCatgry.id,
                description: values.description,
                client: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                name: values.name,
                seqNo: values.seqNo,
                isSeven24: values.isSeven24,
                nameAr: values.nameAr,
                isOnline: values.isOnline,
                shifts: sendscreensList
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateProductCat"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    history.push("/dashboard/productcategorysetup")
                }
            })
    }
    const removeFromWarehouseList = (value) => {
        let screen = { ...screenList.filter(i => i.value == value)[0] }
        let screenListTemp = [...screenList.filter(i => i.value != value)]
        let sendscreensListTemp = [...sendscreensList.filter(i => i != value)]
        let screensListTemp = [...screensList]
        screensListTemp.push({ label: screen.label, value: screen.value })
        sendscreensList.push(screen)
        setScreenList(screenListTemp)
        setScreensList(screensListTemp)
        setSendscreensList(sendscreensListTemp)
    }
    const addScreenList = (value) => {
        let screen = { ...screensList.filter(i => i.value == value)[0] }
        let screenListTemp = [...screenList]
        let sendscreensListTemp = [...sendscreensList]
        let screensListTemp = [...screensList.filter(i => i != value)]
        screenListTemp.push({ ...screen })
        sendscreensListTemp.push(screen.value)
        setScreenList(screenListTemp)
        setScreensList(screensListTemp)
        setSendscreensList(sendscreensListTemp)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Product Category</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        seqNo: prodCatgry.seqNo,
                        name: prodCatgry.name,
                        nameAr: prodCatgry.nameAr,
                        description: prodCatgry.description,
                        isOnline: prodCatgry.isOnline,
                        isSeven24: prodCatgry.isSeven24,

                    }}
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values, ...propsss }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            type="seqNo"
                                            name="seqNo"
                                            id="seqNo"
                                            className={`form-control ${errors.seqNo &&
                                                touched.seqNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.seqNo && touched.seqNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.seqNo}</div>
                                        ) : null}
                                        <Label for="seqNo">Sequence No.</Label>
                                    </FormGroup>
                                </Col>
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
                                        <Label for="name">Description</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="3" sm="6">
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
                                <Col md="3" sm="6">
                                    <FormGroup>
                                        <Field
                                            name="isSeven24"
                                            id="isSeven24"
                                            className={`form-control ${errors.isSeven24 &&
                                                touched.isSeven24 && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isSeven24"
                                                    name="isSeven24"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        setIsSeven24(option.target.checked)
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is 24/7</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
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
                                            onClick={() => history.push("/dashboard/productcategorysetup/")}
                                        >
                                            Cancel
                                        </Button.Ripple>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                {
                    !isSeven24 &&
                    <AddToListComponent
                        list={screensList}
                        onAddToList={(value => addScreenList(value))}
                        data={screenList}
                        fieldTitle={"Assign Sshift"}
                        onRemoveToList={(value) => removeFromWarehouseList(value)}
                    />
                }
            </CardBody>
        </Card>
    )
}


export default CreateVendor