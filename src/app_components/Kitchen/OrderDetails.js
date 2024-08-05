import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {  getList, create } from '../../API_Helpers/api'
import { api_url as API_URL } from '../../assets/constants/api_url'

const styles = {
    row: {
        textAlign: 'center',
        padding: '8px'
    },
    tablecss: {
        "borderCollapse": "collapse",
        "borderSpacing": "0",
        "width": "100%",
    }
}
function OrderDetails({ order }) {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [itemList, setItemList] = useState([])
    const [productsList, setProductsList] = useState([])
    useEffect(() => {
        getProductsByClient()
        getOrderItems()
    }, [order])

    const getOrderItems = () => {
        create({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: 'saleOrderLinesByOrder',
            data: {
                clientId: client.client,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                order: order.id,
                page: 0,
                size: 50,
                sortColumn: "lineno",
                sortOrder: "ASC",
            }
        })
            .then(res => {
                setItemList(res.data.content)
            })
    }
    const getProductsByClient = () => {
        getList({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: 'posProductsList',
            data: {
                clientId: client.client,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
        })
            .then(res => {
                setProductsList(res.data)
            })
    }
    let n = 0
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0'
                }}
            >
                <div><span>Token No. {" :"}</span> <span>{order.tokenNo}</span></div>
                <div><span>Status. {" :"}</span> <span>{order.kitchenStatus == "READY" ? "Recieve" : order.kitchenStatus == "STARTED" ? "Preparing" : "Ready"}</span></div>
            </div>
            <table style={styles.tablecss} id="kitchenTable">
                <tr
                    style={{

                        padding: '10px 0'
                    }}
                >
                    <th
                        style={{
                            ...styles.row
                        }}
                    ><span>No.</span></th>
                    <th
                        style={{
                            ...styles.row
                        }}
                    ><span>image</span></th>
                    <th style={{
                        ...styles.row
                    }}><span>Item Name</span></th>
                    <th></th>

                    <th style={{
                        ...styles.row
                    }}><span>Quantity</span></th>
                </tr>
                {
                    itemList.length &&
                    itemList.map((item) => {
                        if (item.isAddProduct == false) {
                            n = n + 1
                            return (
                                <>
                                    <tr
                                        style={{

                                            padding: '10px 0'
                                        }}
                                    >
                                        <td
                                            style={{
                                                ...styles.row
                                            }}><span>{n}</span></td>
                                        <td style={{
                                            ...styles.row
                                        }}><span
                                            style={{
                                                "width": "30px",
                                                "height": "30px",
                                                "borderRadius": "25px",
                                                "display": "block"
                                            }}
                                        >
                                                <img style={{
                                                    "height": "100px",
                                                    "borderRadius": "2px 2px 0 0",
                                                    "width": "100%!important"
                                                }}
                                                    src={`${API_URL}getProductImage?clientName=${client.name}&imageName=${item.imageName
                                                        }&imageContent=${item.imageContent}`}
                                                />
                                            </span></td>
                                        <td width="100%" style={{
                                            ...styles.row, textAlign: 'left', "whiteSpace": "nowrap"
                                        }}><span>{
                                            productsList.find(i => i.id == item.product) &&
                                            productsList.find(i => i.id == item.product).name
                                        }</span></td>
                                        <td style={{
                                            ...styles.row
                                        }}><span>{
                                            item.qty
                                        }</span></td>
                                    </tr>
                                </>
                            )
                        }else if (item.isAddProduct) {
                            return (
                                <>
                                    <tr
                                        style={{

                                            padding: '10px 0'
                                        }}
                                    >
                                        <td
                                            style={{
                                                ...styles.row
                                            }}><span>{}</span></td>
                                        <td style={{
                                            ...styles.row
                                        }}><span
                                            style={{
                                                "width": "30px",
                                                "height": "30px",
                                                "borderRadius": "25px",
                                                "display": "block"
                                            }}
                                        >
                                                <img style={{
                                                    "height": "100px",
                                                    "borderRadius": "2px 2px 0 0",
                                                    "width": "100%!important"
                                                }}
                                                    src={`${API_URL}getProductImage?clientName=${client.name}&imageName=${item.imageName
                                                        }&imageContent=${item.imageContent}`}
                                                />
                                            </span></td>
                                        <td width="100%" style={{
                                            ...styles.row, textAlign: 'left', "whiteSpace": "nowrap"
                                        }}><span>{
                                            productsList.find(i => i.id == item.product) &&
                                            productsList.find(i => i.id == item.product).name
                                        }</span></td>
                                        <td style={{
                                            ...styles.row
                                        }}><span>{
                                            item.qty
                                        }</span></td>
                                    </tr>
                                </>
                            )
                        } else {
                            return null
                        }

                    })
                }
            </table>

        </>
    )
}
export default OrderDetails