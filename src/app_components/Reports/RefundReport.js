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
    const [loading, setLoading] = React.useState(true)
  

    return (
       <>
        <Card>
            <CardHeader>
                <CardTitle style={{ textAlign: "center", width: '100%' }}>Refund Report</CardTitle>
            </CardHeader>
            <CardBody>
                <>
                    <Row>
                        <Col md="12" sm="12" style={{"textAlign": "center"}}>
                            {
                                loading ?
                                    <a
                                        // customer, product, toDate, fromDate, min_order_value, cost_added_value
                                        className="mr-1 mb-1 btn btn-primary"
                                        href={`${api_url1}reports/frameset?__report=refund_report.rptdesign&__title=Refund-report&__showtitle=false&client_id=${client.clientId}`}
                                        style={
                                            {
                                               "marginTop": "20px", "textAlign": "center"
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
        <Card>
            <CardHeader>
                <CardTitle style={{ textAlign: "center", width: '100%' }}>Menu Report</CardTitle>
            </CardHeader>
            <CardBody>
                <>
                    <Row>
                        <Col md="12" sm="12" style={{"textAlign": "center"}}>
                            {
                                loading ?
                                    <a
                                        // customer, product, toDate, fromDate, min_order_value, cost_added_value
                                        className="mr-1 mb-1 btn btn-primary"
                                        href={`${api_url1}reports/frameset?__report=menu_report.rptdesign&__title=Menu-report&__showtitle=false&client_id=${client.clientId}`}
                                        style={
                                            {
                                               "marginTop": "20px", "textAlign": "center"
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
        </Card></>
    )
}

export default SalesInvoiceReport