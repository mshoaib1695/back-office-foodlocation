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
import { getImage } from '../../API_Helpers/getImage'
import Avatar from '../../components/@vuexy/avatar/AvatarComponent'
import ReactSelect from "react-select"
import {  updateProfileImg, updateUser, posTerminalsList } from '../../API_Helpers/users'
import { getList } from '../../API_Helpers/api'
import AddToListComponent from './AddToListComponent'
import message from '../../API_Helpers/toast'

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    nameAr: Yup.string().required("Required"),
    posTerminal: Yup.string().required("Required"),
})

function UpdateUser() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [imgUrl, setImgUrl] = useState(null)
    const [userObj, setUserObj] = useState(useSelector(state => state.updatescreens.user))
    const [imgfile, setImgfile] = useState(null)
    const [terminals, setTerminal] = useState([])
    const [printers, setPrinters] = useState([])

    const [roleList, setRoleList] = useState([])
    const [rolesList, setRolesList] = useState([])
    const [sendrolesList, setSendrolesList] = useState([])

    useEffect(() => {
        getImageFunction()
        getRolesList()
        getTerminals()
        getPrintersList()
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
    const getImageFunction = () => {
        let payload = {
            imageId: userObj.profileImg,
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
    
    const getRolesList = () => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
            },
            apiname:"rolesList",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                setRolesList(res.data)
                getRoleList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getPrintersList = () => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                branchId: client.branchId,
            },
            apiname:"printerListByBranch",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)
                let a = res.data.map(i => { return { value: i.id, label: i.name } })
                a.push({value: null, label: "Default (No printer selected)" })
                setPrinters(a)
            })
    }
    const getRoleList = (rolesListParameter) => {
        let payload = {
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                userId: userObj.id,
            },
            apiname:"userByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    setSendrolesList(res.data.object.roleList)
                    setUserObj(res.data.object)
                    let newArray = []
                    let rolesListTemp = [...rolesListParameter]
                    res.data.object.roleList.forEach(item => {
                        newArray.push({ ...rolesListParameter.filter(i => i.value == item)[0]})
                        rolesListTemp = [...rolesListTemp.filter(i => i.value != item)]
                    })                  
                    setRoleList(newArray)
                    setRolesList(rolesListTemp)
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
                imgdata.append('id', userObj.id);
                imgdata.append('lang', "EN");
                imgdata.append('clientId', client.clientId);
                let payload = {
                    data: imgdata,
                    tokenType: user.tokenType,
                    accessToken: user.accessToken,
                }
                updateProfileImg(payload)
                    .then(res => { message(res)

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
                clientId: client.clientId,
                email: values.email,
                isManager: values.isManager,
                isPosUser: values.isPosUser,
                isCashMgmt: values.isCashMgmt,
                name: values.name,
                posTerminal: values.posTerminal,
                nameAr: values.nameAr,
                printer: values.printer,
                id: userObj.id,
                roleList: sendrolesList
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        updateUser(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    history.push("/dashboard/usersetup/")
                }
            })
    }
    const addroleList = (value) => {
        let role = { ...rolesList.filter(i => i.value == value)[0] }
        let roleListTemp = [...roleList]
        let sendrolesListTemp = [...sendrolesList]
        let rolesListTemp = [...rolesList.filter(i => i.value != value)]
        roleListTemp.push({...role})
        sendrolesListTemp.push(role.value)
        setRoleList(roleListTemp)
        setRolesList(rolesListTemp)
        setSendrolesList(sendrolesListTemp)
    }
    const removeFromRolesList = (value) => {
        let role = { ...roleList.filter(i => i.value == value)[0] }
        let roleListTemp = [...roleList.filter(i => i.value != value)]
        let sendrolesListTemp = [...sendrolesList.filter(i => i != value)]
        let rolesListTemp = [...rolesList]
        rolesListTemp.push({ label: role.label, value: role.value })
        sendrolesList.push(role)
        setRoleList(roleListTemp)
        setRolesList(rolesListTemp)
        setSendrolesList(sendrolesListTemp)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Update User</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        name: userObj.name,
                        nameAr: userObj.nameAr,
                        username: userObj.username,
                        email: userObj.email,
                        isManager: userObj.isManager,
                        isCashMgmt: userObj.isCashMgmt,
                        isPosUser: userObj.isPosUserm,
                        posTerminal: userObj.posTerminal,
                        printer: userObj.printer,
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
                                            name="posTerminal"
                                            id="posTerminal"
                                            className={`form-control ${errors.posTerminal &&
                                                touched.posTerminal && "is-invalid"}`}
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
                                        {errors.posTerminal && touched.posTerminal ? (
                                            <div className="invalid-tooltip mt-25">{errors.posTerminal}</div>
                                        ) : null}
                                        <Label for="posTerminal">Terminal</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <Field
                                            name="printer"
                                            id="printer"
                                            className={`form-control ${errors.printer &&
                                                touched.printer && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <ReactSelect
                                                    isMulti={false}
                                                    options={printers}
                                                    value={printers ? printers.find(option => option.value === field.value) : ''}
                                                    onChange={(option) => {

                                                        form.setFieldValue(field.name, option.value)
                                                    }}
                                                    error={errors.state}
                                                    onBlur={field.onBlur}
                                                />}
                                        />
                                        {errors.posTerminal && touched.posTerminal ? (
                                            <div className="invalid-tooltip mt-25">{errors.posTerminal}</div>
                                        ) : null}
                                        <Label for="posTerminal">printer</Label>
                                    </FormGroup>
                                </Col>
                                <Col md="2" sm="4">
                                    <FormGroup>
                                        <Field
                                            name="isCashMgmt"
                                            id="isCashMgmt"
                                            className={`form-control ${errors.isCashMgmt &&
                                                touched.isCashMgmt && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isCashMgmt"
                                                    name="isCashMgmt"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
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
                                            className={`form-control ${errors.isManager &&
                                                touched.isManager && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isManager"
                                                    name="isManager"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
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
                                            className={`form-control ${errors.isPosUser &&
                                                touched.isPosUser && "is-invalid"}`}
                                            component={({ field, form }) =>
                                                <CustomInput
                                                    type="switch"
                                                    className="mr-1 mb-2"
                                                    id="isPosUser"
                                                    name="isPosUser"
                                                    checked={field.value}
                                                    inline
                                                    onChange={(option) => {
                                                        form.setFieldValue(field.name, option.target.checked)
                                                    }}
                                                >
                                                    <span className="mb-0 switch-label">Is POS User</span>
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
            <AddToListComponent
                    list={rolesList}
                    onAddToList={(value => addroleList(value))}
                    data={roleList}
                    fieldTitle={"Assign Role"}
                    onRemoveToList={(value) => removeFromRolesList(value)}
                />
            </CardBody>
        </Card>
    )
}


export default UpdateUser