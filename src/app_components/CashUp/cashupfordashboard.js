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
import './style.css'
function CashUp() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [branchsList, setBranchsList] = useState([])
    const [cashupList, setCashupList] = useState([])

    useEffect(() => {
        getBranchsList()

    }, [client])

    useEffect(() => {
        if (branchsList?.length) {
            getCashupList()
        }

    }, [branchsList])


    const getBranchsList = () => {
        if (client.clientId) {
            let data = {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
            let payload = {
                tokenType: user.tokenType,
                accessToken: user.accessToken,
                apiname: "branchsList",
                data,
            }
            getList(payload)
                .then(res => {
                    message(res)
                    setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))
                })
        }
    }
    const getCashupList = async () => {
        let newData = []
        for (let i = 0; i < branchsList.length; i++) {
            let payload = {
                tokenType: user.tokenType,
                accessToken: user.accessToken,
                apiname: "cashUpPaymentTypeList",
                data: {
                    clientId: client.clientId,
                    branchId: branchsList[i].value,
                    lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                },
            }
            let res = await getList(payload)
            if (res?.data?.length) {
                newData.push(res.data.map(ii => {
                    return {
                        ...ii,
                        branch: branchsList[i].label
                    }
                }))
            }
        }
        setCashupList(newData)
    }

    return (
        <>
            <div>
                <p className="headingTag">Cash Up By Branches</p>
                <Card>
                    <CardBody>
                        <Row>
                            {
                                cashupList?.length ?
                                    cashupList.map(cashup => {
                                        return <Col md="6" sm="12" key={cashup.id}>
                                            {cashup?.length && <Card className="shadowCard">
                                                <CardHeader>
                                                    <p style={{
                                                        "textAlign": "center",
                                                        "justifyContent": "center",
                                                        "width": "100%",
                                                        "fontSize": "18px",
                                                        "fontWeight": "600",
                                                        "color": "#7367f0"
                                                    }}>{cashup[0].branch}</p>
                                                </CardHeader>
                                                <CardBody>
                                                    <table id='cashupsid'>
                                                        <thead>                                                                    
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Arabic Name</th>
                                                                <th>Payment Ammount</th>
                                                                <th>Payment Ammount With Tax</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                cashup.map((item) => (
                                                                    <tr>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.nameAr}</td>
                                                                        <td>{item.paymentAmt}</td>
                                                                        <td>{item.payAmtWithoutTax}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </CardBody>
                                                {/* <p  ><span className="cashup-heading-text">Name:</span>
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
                                                                </p> */}
                                            </Card>}
                                        </Col>

                                        // : <>  <p style={{
                                        //     width: '100%',
                                        //     textAlign: 'center'
                                        // }}>Loading........</p> </>
                                    })
                                    : <>  <p style={{
                                        width: '100%',
                                        textAlign: 'center'
                                    }}>Loading........</p> </>
                            }
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CashUp