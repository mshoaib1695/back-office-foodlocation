import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, Button, Row, Col } from "reactstrap"
import { useSelector } from "react-redux"
import moment from 'moment'
import Flatpickr from "react-flatpickr";
import { api_url1 } from '../../assets/constants/api_url'

function SalesInvoiceReport(props) {
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const client = useSelector(state => state.auth.login.client)
    const [loading, setLoading] = React.useState(false)


    useEffect(() => {
        if (toDate && fromDate) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [toDate, fromDate])
  

    return (
        <Card>
            <CardHeader>
                <CardTitle style={{ textAlign: "center", width: '100%' }}>Sales Invoice Report</CardTitle>
                <p style={{ textAlign: "center", width: '100%' }}>(without filters)</p>
            </CardHeader>
            <CardBody>
                <>
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
                                        href={`${api_url1}reports/frameset?__report=sales_invoices_report_without_filter.rptdesign&__title=Sales-invoices&__showtitle=false&client_id=${client.clientId}&from=${fromDate}&to=${toDate}`}
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