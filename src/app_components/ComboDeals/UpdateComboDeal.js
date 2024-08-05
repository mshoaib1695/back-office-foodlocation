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
import Tabs from './Tabs'
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { createMultipartAPI, getList, } from '../../API_Helpers/api'
import { getImage } from '../../API_Helpers/getImage'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    seqNo: Yup.string().required("Required"),
})
// ROW_MATERIAL
function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const [combo, setcomboByID] = useState(useSelector(state => state.updatescreens.combo))
    const user = useSelector(state => state.auth.login.user)
    const [imgUrl, setImgUrl] = useState(null)
    const [imgfile, setImgfile] = useState(null)

    useEffect(() => {
        getcomboByID()
    }, [])

    useEffect(() => {
        if (combo.comboImg) {
            getImageFunction()
        }
    }, [combo])
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
                imgdata.append('id', combo.id);
                imgdata.append('lang', "EN");
                imgdata.append('clientId', client.clientId);
                imgdata.append('comboImg', combo.comboImg);
                let payload = {
                    data: imgdata,
                    tokenType: user.tokenType,
                    accessToken: user.accessToken,
                    apiname: "updateComboImg"
                }
                createMultipartAPI(payload)
                    .then(res => { message(res)


                        return
                    })
            }
            else {
                document.getElementById('file').value = ''
            }
        }
    }
    const getcomboByID = (branchsListParameter) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "comboByID",
            data: {
                id: combo.id,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setcomboByID(res.data.object)
            })
    }
    const getImageFunction = () => {
        let payload = {
            imageId: combo.comboImg,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        getImage(payload)
            .then(res => { message(res)

                var reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    setImgUrl(reader.result)
                }
            })
    }

    const submitHandler = (values) => {
        let data = new FormData();
        if (imgfile) {
            data.append('file', imgfile);
        }
        data.append('client', client.clientId);
        data.append('lang', "EN");
        data.append('seqNo', values.seqNo);
        data.append('name', values.name);
        data.append('nameAr', values.nameAr);
        data.append('isActive', values.isActive);

        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "createCombo"
        }
        createMultipartAPI(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/combodeal/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Combo Deal</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: combo.name,
                        nameAr: combo.nameAr,
                        seqNo: combo.seqNo,
                        isActive: combo.isActive,
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
                                        <Label for="seqNo">Sequence No</Label>
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

                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isActive"
                                            id="isActive"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
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
                                            onClick={() => history.push("/dashboard/combodeal/")}
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
            <Tabs comboId={combo.id} />
        </Card>
    )
}


export default CreateRole

