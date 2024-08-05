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
    const [branchsList, setBranchsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [customerList, setCustomersList] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [paymentMethodsList, setPayMethodsList] = useState([])

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getCustomersList()
        getWarehousesList()
        getBranchsList()
        getOrderStatus()
        getPayMethodsList()
    }, [])
    const getBranchsList = () => {
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
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
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
            apiname: "customerList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
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
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
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
                paraType: "ONLINE_ORDER_STATUS",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
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
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
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
                if (element.id == "documentNo") {
                    payload.documentNo = element.value
                }
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "payMethod") {
                    payload.payMethod = element.value
                }
                if (element.id == "orderDate") {
                    payload.orderDate = element.value
                }               
                if (element.id == "status") {
                    payload.status = element.value
                }               
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "onlineOrdersByClient",
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
                <CardTitle>Online Orders List</CardTitle>
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
                                    Header: "Order No.",
                                    accessor: "documentNo",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.documentNo}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Customer Name",
                                    accessor: "name",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.name}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Payment Method ",
                                    accessor: "payMethod",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                paymentMethodsList.length > 0 && paymentMethodsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {paymentMethodsList.length > 0 && paymentMethodsList.filter(i => i.value == row.original.payMethod).length > 0 &&
                                                paymentMethodsList.filter(i => i.value == row.original.payMethod)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Order Date",
                                    accessor: "orderDate",
                                    Filter: ({ filter, onChange }) => (
                                        <Flatpickr
                                            options={{
                                                dateFormat: "Y-m-d",
                                            }}
                                            className="form-control"
                                            value={filter ? filter.value : null}
                                            onChange={date => onChange(moment(date[0]).format("YYYY-MM-DD"))}
                                        />
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
                    defaultPageSize={10}
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