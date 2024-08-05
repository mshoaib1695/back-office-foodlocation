import React, { useEffect, useState } from 'react'
import { gridDataByClient, deleteapi, getList, report } from '../../API_Helpers/api'
import { Card, CardHeader, CardTitle, CardBody, Button, Row, Col } from "reactstrap"
import { useSelector } from "react-redux"
import message from '../../API_Helpers/toast'
import axios from 'axios'
import moment from 'moment'
import Radio from "../../components/@vuexy/radio/RadioVuexy"

import Flatpickr from "react-flatpickr";
import { Download } from 'react-feather'

import { api_url1 } from '../../assets/constants/api_url'

function SalesInvoiceReport(props) {
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState('')
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [reportType, setReportType] = useState('')
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const [loading, setLoading] = React.useState(false)
    const [customerList, setCustomersList] = useState([])
    const [customer, setCustomer] = useState('')
    const [min_order_value, setMin_order_value] = useState(null)
    const [cost_added_value, setCost_added_value] = useState(null)

    const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/;

    useEffect(() => {
        if ( toDate && fromDate && min_order_value && cost_added_value) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [customer, product, toDate, fromDate, min_order_value, cost_added_value])
    useEffect(() => {
        getCustomersList()
        getProducts()
    }, [])
    const getCustomersList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "customerList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                setCustomersList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
            .catch(e => {
                console.error(e)
            })
    }
    const getProducts = () => {
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
                <CardTitle style={{ textAlign: "center", width: '100%' }}>Sales Invoice Report</CardTitle>
                <p  style={{ textAlign: "center", width: '100%' }}>(with filters)</p>
            </CardHeader>
            <CardBody>
                <>
                    <h5 className="mt-1">Select Branch</h5>
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
                    <h5 className="mt-1">Select Customer</h5>
                    <Row>
                        <Col md="12" sm="12">
                            <select
                                style={{ width: '100%' }}
                                onChange={event => setCustomer(event.target.value)}
                                value={customer}>
                                <option value="">Show All</option>
                                {
                                    customerList.length > 0 && customerList.map(i => (
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
                            <h5 className="mt-1">Min Order Value</h5>
                            <Row>
                                <Col md="12" sm="12">
                                    <input
                                        type="text"
                                        maxLength={9}
                                        className="form-control"
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Enter amount"
                                        onChange={(e) => {
                                            if (rx_live.test(e.target.value)){
                                                setMin_order_value(e.target.value)
                                            }
                                        }}
                                        value={min_order_value}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" sm="12">
                            <h5 className="mt-1">Cost Added Value</h5>
                            <Row>
                                <Col md="12" sm="12">
                                    <input
                                        type="text"
                                        maxLength={9}
                                        className="form-control"
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        placeholder="Enter amount"
                                        onChange={(e) => {
                                            if (rx_live.test(e.target.value)){
                                                setCost_added_value(e.target.value)
                                            }
                                        }}
                                        value={cost_added_value}
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
                                        href={`${api_url1}reports/frameset?__report=sales_invoices_report.rptdesign&title=invoices-report&__showtitle=false&client_id=${client.clientId}&from=${fromDate}&to=${toDate}&min_order_value=${min_order_value}&cost_added_value=${cost_added_value}&customer=${customer ? customer : ""}&branch_id=${product ? product : ""}`}
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