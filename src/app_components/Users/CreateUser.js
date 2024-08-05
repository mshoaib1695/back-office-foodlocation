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
import { createUser } from '../../API_Helpers/users'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import ReactSelect from "react-select"
import { posTerminalsList } from '../../API_Helpers/users'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    nameAr: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
    terminal: Yup.string().required("Required"),
})

function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [imgUrl, setImgUrl] = useState(null)
    const [imgfile, setImgfile] = useState(null)
    const [terminals, setTerminal] = useState([])
    useEffect(() => {
        getTerminals()
    }, [])
    const getTerminals = () => {
        let payload = {
            clientId: client.clientId,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        posTerminalsList(payload)
            .then(res => { message(res)

                setTerminal(res.data.map(i => { return { value: i.id, label: i.name } }))
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
            }
            else {
                document.getElementById('file').value = ''
            }
        }
    }
    const submitHandler = (values) => {
        let data = new FormData();
        if (imgfile) {
            data.append('file', imgfile);
        }
        data.append('clientId', client.clientId);
        data.append('email', values.email);
        data.append('isManager',  values.isManager);
        data.append('isPosUser',  values.isPosUser);
        data.append('isCashMgmt',  values.isCashMgmt);
        data.append('lang', "EN");
        data.append('name', values.name);
        data.append('nameAr', values.nameAr);
        data.append('password', values.password);
        data.append('posTerminal', values.terminal);
        data.append('username', values.username);
        let payload = {
            data: data,
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        createUser(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/usersetup/")
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create User</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: "",
                        nameAr: "",
                        username: "",
                        email: "",
                        password: "",
                        isManager: false,
                        isCashMgmt: false,
                        isPosUser: false,
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
                                        <Label for="nameAr">Aracbi Name</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="username"
                                            id="username"
                                            className={`form-control ${errors.username &&
                                                touched.username &&
                                                "is-invalid"}`}
                                        />
                                        {errors.username && touched.username ? (
                                            <div className="invalid-tooltip mt-25">{errors.username}</div>
                                        ) : null}
                                        <Label for="username">Username</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="email"
                                            id="email"
                                            className={`form-control ${errors.email &&
                                                touched.email &&
                                                "is-invalid"}`}
                                        />
                                        {errors.email && touched.email ? (
                                            <div className="invalid-tooltip mt-25">{errors.email}</div>
                                        ) : null}
                                        <Label for="email">Email Address</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="password"
                                            id="password"
                                            className={`form-control ${errors.password &&
                                                touched.password &&
                                                "is-invalid"}`}
                                        />
                                        {errors.password && touched.password ? (
                                            <div className="invalid-tooltip mt-25">{errors.password}</div>
                                        ) : null}
                                        <Label for="password">Password</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="terminal"
                                            id="terminal"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={terminals}
                                                    value={terminals ? terminals.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {
                                                        
                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.terminal && touched.terminal ? (
                                            <div className="invalid-tooltip mt-25">{errors.terminal}</div>
                                        ) : null}
                                        <Label for="terminal">Terminal</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>                                        
                                        <Field
                                            name="isCashMgmt"
                                            id="isCashMgmt"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isCashMgmt"
                                                    name="isCashMgmt"
                                                    checked={field.value}
                                                    inline
                                                    onChange={ (option) => {
                                                        form.setFieldValue(field.name, option.target.checked )
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Cash Manager</span>
                                                </CustomInput>}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isManager"
                                            id="isManager"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isManager"
                                                    name="isManager"
                                                    checked={field.value}
                                                    inline
                                                    onChange={ (option) => {
                                                        form.setFieldValue(field.name, option.target.checked )
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Manager</span>
                                                </CustomInput>}
                                        />

                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isPosUser"
                                            id="isPosUser"
                                            className={`form-control ${errors.terminal &&
                                                touched.terminal && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isPosUser"
                                                    name="isPosUser"
                                                    checked={field.value}
                                                    inline
                                                    onChange={ (option) => {
                                                        form.setFieldValue(field.name, option.target.checked )
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is Pos User</span>
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
                                            onClick={() => history.push("/dashboard/usersetup/")}
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