import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, } from "reactstrap"
import { gridDataByClient, parametersListByParaType, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'
import { history } from "../../history"

function Users() {


    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const [branchsList, setBranchsList] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [paymentMethodsList, setPayMethodsList] = useState([])

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
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
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
            .then(res => {
                message(res)

                setPayMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }

    const getOrderStatus = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "ONLINE_ORDER_STATUS",
                lang: "EN"
            },
        }
        parametersListByParaType(payload)
            .then(res => {
                message(res)

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
            status: "A",
            deliveryPerson: user.deliveryPersonId,
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
                if (element.id == "payMethod") {
                    payload.payMethod = element.value
                }
                if (element.id == "orderDate") {
                    payload.orderDate = element.value
                }
                if (element.id == "branch") {
                    payload.branch = element.value
                }
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "phoneNo") {
                    payload.phoneNo = element.value
                }
                if (element.id == "address") {
                    payload.address = element.value
                }
                if (element.id == "totalNet") {
                    payload.totalNet = element.value
                }
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "onlineOrdersByDeliveryPerson",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => {
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }

    const selectOrder = (id) => {
        history.push(`delivery-order-details?order_id=${id}&isDeliveryPerson=${false}`)
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
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
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {row.original.documentNo}
                                            </p>
                                        )
                                    },
                                    {
                                        Header: "Name",
                                        accessor: "name",
                                        Cell: (row) => (
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {row.original.name}
                                            </p>
                                        )
                                    },
                                    {
                                        Header: "Phone Number",
                                        accessor: "phoneNo",
                                        Cell: (row) => (
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {row.original.phoneNo}
                                            </p>
                                        )
                                    },
                                    {
                                        Header: "Address",
                                        accessor: "address",
                                        Cell: (row) => (
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {row.original.address}
                                            </p>
                                        )
                                    },
                                    {
                                        Header: "Total",
                                        accessor: "totalNet",
                                        Cell: (row) => (
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {row.original.totalNet}
                                            </p>
                                        )
                                    },
                                    {
                                        Header: "Branch",
                                        accessor: "branch",
                                        Filter: ({ filter, onChange }) => (
                                            <select
                                                onChange={event => onChange(event.target.value)}
                                                value={filter ? filter.value : ""}>
                                                <option value="">Show All</option>
                                                {
                                                    branchsList.length > 0 && branchsList.map(i => (
                                                        <option value={i.value}>{i.label}</option>
                                                    ))
                                                }
                                            </select>
                                        ),
                                        Cell: (row) => (
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
                                                {branchsList.length > 0 && branchsList.filter(i => i.value == row.original.branch).length > 0 &&
                                                    branchsList.filter(i => i.value == row.original.branch)[0].label
                                                }
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
                                            <p className="gridBtn" onClick={() => { selectOrder(row.original.id) }}>
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
                                    }
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
        </>
    )
}


export default Users