import React, { useEffect, useState } from 'react'
import {getList} from '../../API_Helpers/api'
import { Card, CardHeader, CardTitle, CardBody, Button, Row, Col } from "reactstrap"
import { useSelector } from "react-redux"
import message from '../../API_Helpers/toast'
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import { api_url1 } from '../../assets/constants/api_url'

function SalesInvoiceReport() {
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const [loading, setLoading] = React.useState(false)


    useEffect(() => {
        if ( toDate && fromDate ) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [toDate, fromDate])
    useEffect(() => {
        getProducts()
    }, [])
 
    const getProducts = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "vendorList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setProducts(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const onChange = value => {
        setProduct(value)
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle style={{ textAlign: "center", width: '100%' }}>Purchase Invoice Report</CardTitle>
            </CardHeader>
            <CardBody>
                <>
                    <h5 className="mt-1">Select Vendor</h5>
                    <Row>
                        <Col md="12" sm="12">
                            <select
                                style={{ width: '100%' }}
                                onChange={event => onChange(event.target.value)}
                                value={product}>
                                <option value="">Show All</option>
                                {
                                    products.length > 0 && products.map(i => (
                                        <option value={i.value}>{i.label}</option>
                                    ))
                                }
                            </select>

                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            <h5 className="mt-1">From Date</h5>
                            <Row>
                                <Col md="12" sm="12">
                                    <Flatpickr
                                        options={{
                                            dateFormat: "Y-m-d",
                                        }}
                                        className="form-control"
                                        value={fromDate ? fromDate : null}
                                        onChange={date => setFromDate(moment(date[0]).format("YYYY-MM-DD"))}
                                    />

                                </Col>
                            </Row>

                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            <h5 className="mt-1">To Date</h5>
                            <Row>
                                <Col md="12" sm="12">
                                    <Flatpickr
                                        options={{
                                            dateFormat: "Y-m-d",
                                        }}
                                        className="form-control"
                                        value={toDate ? toDate : null}
                                        onChange={date => setToDate(moment(date[0]).format("YYYY-MM-DD"))}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            {
                                loading ?
                                    <a
                                    // customer, product, toDate, fromDate, min_order_value, cost_added_value
                                        className="mr-1 mb-1 btn btn-primary"
                                        href={`${api_url1}reports/frameset?__report=purchase_invoices_report.rptdesign&__title=Products_sales_Report&__showtitle=false&client_id=${client.clientId}&from=${fromDate}&to=${toDate}&branch_id=${product ? product : ""}`}
                                        href={`${api_url1}reports/frameset?__report=purchase_invoices_report.rptdesign&__title=purchase_invoices&__showtitle=false&client_id=${client.clientId}&fromDate=${fromDate}&toDate=${toDate}&vendor_id=${product ? product : ""}`}
                                        style={
                                            {
                                                "borderColor": "rgb(255, 54, 74)", "backgroundColor": "rgb(255, 54, 74)",
                                                "color": "#fff !important",
                                                "float": "left", "marginTop": "20px"
                                            }
                                        }
                                        target="_blank"
                                    > Open Report</a>
                                    :
                                    <Button color="primary" style={{ marginTop: "20px", cursor: "not-allowed" }} disabled>Open Report</Button>
                            }
                        </Col>
                    </Row>
                </>
            </CardBody>
        </Card>
    )
}

export default SalesInvoiceReport