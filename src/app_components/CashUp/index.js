import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Row,
    Col,
} from "reactstrap"
import { getList, create, report } from '../../API_Helpers/api'
import { useSelector } from 'react-redux'
import message from '../../API_Helpers/toast'

function CashUp() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [cashupList, setCashupList] = useState([])
    const [cashup, setCashup] = useState({})

    useEffect(() => {
        getCashupList()
    }, [])
    useEffect(() => {
        if (cashupList.length > 0) {
            getCashupById()
        }
    }, [cashupList])
    const getCashupList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "cashUpPaymentTypeList",
            data: {
                clientId: client.clientId,
                branchId: client.branchId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)
 
                setCashupList(res.data)

            })
    }
    const getCashupById = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "cashupByID",
            data: {
                id: cashupList[0].cashup,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setCashup(res.data.object)
            })
    }
    const cashupAction = (api) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: api,
            data: {
                branch: client.branchId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        create(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    getCashupList()
                }
            })
    }
    const printHandler = async () => {
        let data = {
                data: {
                    cashupId: cashupList[0].cashup,
                    lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                    clientId: client.clientId
                },
                tokenType: user.tokenType,
                accessToken: user.accessToken,
                apiname: "cashupDetailsPdfReport",
        }
       
        report(data)
            .then(res => { message(res)

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                let a = new Date()
                let date = a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear() + '-' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                link.setAttribute('download', `cashup${date}.pdf`);
                document.body.appendChild(link);
                link.click();
            })
    }
    return (
        <>
            <div>
                <p className="headingTag">Cash Up</p>
                <Card>
                    <CardHeader>
                        <Button.Ripple
                            color="primary"
                            className="mr-1 mb-1"
                            disabled={cashupList?.length ? false : true}
                            onClick={() => printHandler()}
                        >Print Cash Up Report</Button.Ripple>
                        <Button.Ripple
                            onClick={() => {
                                if (cashup.status == "O") {
                                    cashupAction("closeCashUp")
                                } else {
                                    cashupAction("openCashup")
                                }
                            }}
                            color="primary"
                            className="mr-1 mb-1"
                        >{cashup.status == "O" ? 'Close Cash Up' : "Open Cash Up"}</Button.Ripple>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            {
                                cashupList.length > 0 &&
                                cashupList.map(item => (
                                    <Col md="6" sm="12">
                                        <Card className="shadowCard">
                                            <CardBody>
                                                <p  ><span className="cashup-heading-text">Name:</span>
                                                    <span className="cashup-text">{item.name}</span>
                                                </p>
                                                <p><span className="cashup-heading-text">Arabic Name:</span>
                                                    <span className="cashup-text">{item.nameAr}</span>
                                                </p>
                                                <p><span className="cashup-heading-text">Payment Ammount:</span>
                                                    <span className="cashup-text">{item.paymentAmt}</span>
                                                </p>
                                                <p><span className="cashup-heading-text">Payment Ammount With Tax:</span>
                                                    <span className="cashup-text">{item.payAmtWithoutTax}</span>
                                                </p>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                ))
                            }
                        </Row>
                    </CardBody>
                </Card>
            </div>
            <div>
                <p className="headingTag">Discount Details</p>
                <Row>
                    <Col md="12" sm="12">
                        <Card className="shadowCard">
                            <CardBody>
                                <p  ><span className="cashup-heading-text">Coupon Discount Total:</span>
                                    <span className="cashup-text">{cashup.cpnDiscountAmt}</span>
                                </p>
                                <p><span className="cashup-heading-text">Collection Point Discount Total:</span>
                                    <span className="cashup-text">{cashup.pntDiscountAmt}</span>
                                </p>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default CashUp