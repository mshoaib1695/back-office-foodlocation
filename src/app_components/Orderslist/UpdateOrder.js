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
import { history } from '../../history'
import { create, getList } from '../../API_Helpers/api'
import Tabs from './Tabs'
import Flatpickr from "react-flatpickr";
import moment from "moment"
import message from '../../API_Helpers/toast'
import { api_url1 } from '../../assets/constants/api_url'


const formSchema = Yup.object().shape({
    movementDate: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
})

function CreateRole() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const[orderDetails, setOrderDetails ] = useState(useSelector(state => state.updatescreens.orderData))

    useEffect(() => {
        getOrderDetails()

    }, [])
    const getOrderDetails = () => {
        let payload = {
            data:{
                orderId: orderDetails.orderId,
            },
            apiname:"orderDetailsById",
            tokenType: user.tokenType,
            accessToken: user.accessToken
        }
        getList(payload)
            .then(res => { 
                setOrderDetails({...res.data})
        })
    }
   
   
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Details </CardTitle>
                <Button onClick={() => {
                    if(history.location.search){
                        let  search = history.location.search.substring(1);
                        let qparam =  JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
                        if(qparam && qparam.cashupviewdetails){
                            history.push('/dashboard/cashupviewdetails')                            
                        }
                    }else{
                        history.push('/dashboard/orderslist')

                    }
                    
                }}>Back</Button>
            </CardHeader>
            <CardBody>
                <Formik
                
                    validationSchema={formSchema}
                    onSubmit={(values, actions) => {
                        return
                        // submitHandler(values);
                        actions.setSubmitting(false);
                    }}

                >
                    {({ errors, touched, values }) => (
                        <Form>
                            <Row>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Document No</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.documentNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Token No</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.tokenNo}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Date</p>
                                        <p style={{fontWeight: "bold"}}>{moment(orderDetails.dateTime).format("Do, MMM YYYY")}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Time</p>
                                        <p style={{fontWeight: "bold"}}>{moment(orderDetails.dateTime).format("hh:mm")}</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Cashier</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.cashier }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Customer</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.customer }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Total</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.totalAmt }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Total Without Tax</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.totalWithoutTax }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Tax</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.taxAmt }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Discount</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.discountAmt }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Cash Payment</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.payCash }</p>
                                    </FormGroup>
                                </Col>
                                <Col md="6" sm="12">
                                    <FormGroup className="form-label-group">
                                        <p>Order Type</p>
                                        <p style={{fontWeight: "bold"}}>{orderDetails.orderTypeEn }</p>
                                    </FormGroup>
                                </Col>
                             </Row>
                        </Form>
                    )}
                </Formik>
            </CardBody>
            <Tabs orderId={orderDetails.id} />
        </Card>
    )
}


export default CreateRole
