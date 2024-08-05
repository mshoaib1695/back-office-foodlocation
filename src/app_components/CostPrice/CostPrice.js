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
import { history } from '../../history'

function CashUp() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [getCostRate, setCostRate] = useState({})

    useEffect(() => {
        getBranchsList()

    }, [client])


    const getBranchsList = () => {
        if (client.clientId) {
            let data = {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
            let payload = {
                tokenType: user.tokenType,
                accessToken: user.accessToken,
                apiname: "getCostRate",
                data,
            }
            getList(payload)
                .then(res => {
                    if (res.data) {
                        setCostRate(res.data)
                    }
                })
        }
    }


    return (
        <>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Cost Price</CardTitle>
                        {getCostRate ? <Button.Ripple
                            color="primary"
                            type="submit"
                            className="mr-1 mb-1"
                            onClick={e => history.push("/dashboard/update-costprices")}
                        >
                            Update Cost Price
                        </Button.Ripple> :
                        <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                        onClick={e => history.push("/dashboard/configure-costprices")}
                    >
                        Configure Cost Price
                    </Button.Ripple>}
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="4" sm="12" style={{ display: 'flex' }}>
                                <p style={{ fontWeight: 'bold', marginRight: '10px' }}>Danger Cost Present Over: </p>
                                <p>{" " + getCostRate.dangerusCostOver}</p>
                            </Col>
                            <Col md="4" sm="12" style={{ display: 'flex' }}>
                                <p style={{ fontWeight: 'bold', marginRight: '10px' }}>Perfect Cost Present Down: </p>
                                <p>{" " + getCostRate.perfectCostDown}</p>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default CashUp