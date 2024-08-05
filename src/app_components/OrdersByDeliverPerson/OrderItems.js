import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button, Input } from "reactstrap"
import { gridDataByClient, parametersListByParaType, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function Users(props) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()
    const [productsList, setBranchsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [uomsList, setCustomersList] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [paymentMethodsList, setPayMethodsList] = useState([])

    useEffect(() => {
        getCustomersList()
        getWarehousesList()
        getBranchsList()
        getOrderStatus()
        getPayMethodsList()
    }, [])
    useEffect(() => {
        fetch({ pageSize: 4, page: 0 });
    }, [props.orderId])
    const getBranchsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getWarehousesList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "warehousesList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setWarehousesList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getCustomersList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setCustomersList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getPayMethodsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "paymentMethodsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setPayMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getOrderStatus = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "ORDER_STATUS",
                lang: "EN"
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                setOrderStatus(res.data.map(i => { return { value: i.paramCode, label: i.name, id: i.id } }))
            })
    }
    const fetch = ({ pageSize, page, sorted, filtered }) => {
        setLoading(false)
        let payload = {
                clientId: client.clientId,
                size: pageSize,
                page: page,
                lang: "EN",
                order: props.orderId
        }
        if (sorted && sorted.length > 0) {
            payload.sortColumn = sorted[0].id
            if (sorted[0].desc) {
                payload.sortOrder = 'DESC'
            } else {
                payload.sortOrder = 'ASC'
            }
        }
        if (filtered && filtered.length > 0) {
            for (let index = 0; index < filtered.length; index++) {
                const element = filtered[index];
                if (element.id == "unitPrice") {
                    payload.unitPrice = element.value
                }
                if (element.id == "qty") {
                    payload.qty = element.value
                }
                if (element.id == "product") {
                    payload.product = element.value
                }
                if (element.id == "uom") {
                    payload.uom = element.value
                }               
                if (element.id == "status") {
                    payload.status = element.value
                }                
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "saleOrderLinesByOrder",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => { 

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
  
    return (
        <Card>
            <CardHeader>
                {/* createmenuitem */}
                <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardBody>
                <ReactTable
                    data={data}
                    pages={totalPages}
                    filterable
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "Unit Price",
                                    accessor: "unitPrice",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.unitPrice}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Quantity",
                                    accessor: "qty",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.qty}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Product",
                                    accessor: "product",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                productsList.length > 0 && productsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {productsList.length > 0 && productsList.filter(i => i.value == row.original.product).length > 0 &&
                                                productsList.filter(i => i.value == row.original.product)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "UOM",
                                    accessor: "uom",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                uomsList.length > 0 && uomsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {uomsList.length > 0 && uomsList.filter(i => i.value == row.original.uom).length > 0 &&
                                                uomsList.filter(i => i.value == row.original.uom)[0].label
                                            }
                                        </p>
                                    )
                                },                 
                                {

                                    Header: "Status",
                                    accessor: "status",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            {
                                                orderStatus.length > 0 && 
                                                orderStatus.map(item => (
                                                    <option value={item.value}>{item.label}</option>

                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {
                                                orderStatus.length > 0 && 
                                                orderStatus.filter( item => item.value == row.original.status).length > 0 &&
                                                orderStatus.filter( item => item.value == row.original.status)[0].label
                                            }
                                        </p>
                                    )
                                },
                            
                            ]
                        },
                    ]}
                    defaultPageSize={4}
                    className="-striped -highlight"
                    pageSizeOptions={[5, 10, 20, 25, 50]}
                    loading={loading}
                    showPagination={true}
                    showPaginationTop={false}
                    manual
                    onFetchData={(state, instance) => {
                        fetch({
                            pageSize: state.pageSize,
                            page: state.page,
                            sorted: state.sorted,
                            filtered: state.filtered
                        })
                    }}
                />
            </CardBody>
        </Card>
    )
}


export default Users