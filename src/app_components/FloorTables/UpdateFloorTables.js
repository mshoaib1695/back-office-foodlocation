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
import { create, getList } from '../../API_Helpers/api'
import message from '../../API_Helpers/toast'
import { onlinewebsite } from '../../assets/constants/api_url'
var QRCode = require('qrcode.react');

const formSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    nameAr: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    tableNo: Yup.string().required("Required"),
})

function CreateProductOffer(props) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [table, setTable] = useState(useSelector(state => state.updatescreens.table))
    const [url, setUrl] = useState(null)
    useEffect(() => {
        gettableData()
    }, [])
    const gettableData = () => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                clientId: client.clientId,
                id: table.id
            },
            apiname: "flrTableByID",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(result => {
                setTable(result.data.object)
                getList({
                    data: {
                        lang: "AR",
                        clientId: client.clientId,
                    },
                    apiname: "branchsList",
                    tokenType: user.tokenType,
                    accessToken: user.accessToken
                })
                    .then(res => { message(res)

                        if(res.data.find(i => i.id == client.branchId) && client.name){
                            let urlTemp = `${onlinewebsite}${client.name}/${res.data.find(i => i.id == client.branchId).name}?fid=${result.data.object.floor}&tid=${result.data.object.id}/`
                            setUrl(urlTemp)
                        }
                    })
            })
    }
    const thandleQrBtn = () => {
        var link = document.createElement('a');
        link.download = 'table_qrcode.png';
        link.href = document.getElementById('qr-code').toDataURL()
        link.click();
    }
    const submitHandler = (values) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                client: client.clientId,
                id: table.id,
                description: values.description,
                name: values.name,
                nameAr: values.nameAr,
                tableNo: values.tableNo,
                floor: props.floorId,
            },
            apiname: "updateFlrTable",
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
                <CardTitle>Update Floor Table</CardTitle>
            </CardHeader>
            <CardBody>
                <Formik
                    initialValues={{
                        description: table.description,
                        name: table.name,
                        nameAr: table.nameAr,
                        tableNo: table.tableNo,
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
                                            type="tableNo"
                                            name="tableNo"
                                            id="tableNo"
                                            className={`form-control ${errors.tableNo &&
                                                touched.tableNo &&
                                                "is-invalid"}`}
                                        />
                                        {errors.tableNo && touched.tableNo ? (
                                            <div className="invalid-tooltip mt-25">{errors.tableNo}</div>
                                        ) : null}
                                        <Label for="tableNo">Floo rNo</Label>
                                    </FormGroup>
                                </Col>
                                {url && <>
                                    <Col md="6" sm="12">
                                        <FormGroup className="form-label-group">
                                            <QRCode
                                                id="qr-code"
                                                size="128"
                                                value={url} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6" sm="12">
                                        <FormGroup className="form-label-group">
                                            <Button.Ripple
                                                onClick={() => thandleQrBtn()}>
                                                Download
                                        </Button.Ripple>
                                        </FormGroup>
                                    </Col>
                                </>}
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