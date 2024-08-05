import React, { useEffect, useState } from 'react';
import {  getList, create } from '../../API_Helpers/api'
import { useSelector } from 'react-redux'
import Timer from './Timer'
import OrderDetails from './OrderDetails'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,

} from "reactstrap"
import message from '../../API_Helpers/toast'

const styles = {
    refreshdivStyles: {
        "display": "flex",
        "justifyContent": "flex-end"
    },
    flexBox: {
        "display": "flex",
        "flexDirection": "row",
        "flexWrap": "wrap",
        "alignItems": "self-start",
        "justifyContent": "space-around",
        "padding": "10px 0"
    },
}
function Kitchen() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [kitOrders, setKitOrders] = useState([])
    useEffect(() => {
        getKitchenOrders()
        setInterval(() => {
            getKitchenOrders()
        }, 5000)
    }, [])

    const getKitchenOrders = () => {
        getList({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: 'displaySaleOrders',
            data: {
                branchId: client.branchId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
        })
            .then(res => {
                setKitOrders(res.data)
            })
    }
    const changeOrderStatus = order => {
        let st = ''
        if (order.kitchenStatus == "READY") {
            st = "STARTED"
        }
        if (order.kitchenStatus == "STARTED") {
            st = "FINISHED"
        }
        create({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: 'updateSaleOrderKitchenStatus',
            data: {
                id: order.id,
                kitchenStatus: st
            }
        })
            .then(res => {
                message(res)
                if (res.data.success) {
                    getKitchenOrders()
                }
            })
    }
    return (
        <>
            <div style={styles.refreshdivStyles}>
                <Button.Ripple
                    color="primary"
                    onClick={() => getKitchenOrders()}
                >
                    Refresh Orders List
                </Button.Ripple></div>
            <div style={styles.flexBox}>
                {
                    kitOrders.length > 0 &&
                    kitOrders.map(order => (
                        <Card key={order.id} id="kitchenCard">
                            <CardHeader
                                style={{
                                    background: '#7367f0',
                                    color: '#fff',
                                    padding: '10px'
                                }}
                            >
                                <CardTitle
                                    style={{
                                        color: '#fff'
                                    }}
                                >Order No: {order.documentNo}</CardTitle>
                                <CardTitle 
                                     style={{
                                        color: '#fff'
                                    }}
                                ><Timer time={order.initTime} /> </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <OrderDetails order={order}/>
                                <Button.Ripple
                                    block
                                    onClick={() => changeOrderStatus(order)}
                                    color="primary"
                                    style={{width: '100%'}}
                                    className="mr-1 mb-1">
                                        
                                    {order.kitchenStatus == "READY" ? "Start" : order.kitchenStatus == "STARTED" ? "Finish" : ""}
                                </Button.Ripple>
                            </CardBody>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}

export default Kitchen;