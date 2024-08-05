import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { purchasedInvoiceUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function Users() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [vendorList, setVendorList] = useState([])
    const [paymentMethodsList, setPaymentMethodsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getVendorList()
        getPaymentMethodsList()
        getWarehousesList()
    }, [])
    const getVendorList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "vendorList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setVendorList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getPaymentMethodsList = () => {
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

                setPaymentMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
                if (element.id == "vendor") {
                    payload.vendor = element.value
                }
                if (element.id == "invoiceDate") {
                    payload.invoiceDate = element.value
                }
                if (element.id == "payMethod") {
                    payload.payMethod = element.value
                }               
                if (element.id == "warehouse") {
                    payload.warehouse = element.value
                }               
                if (element.id == "status") {
                    payload.status = element.value
                }               
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "purchaseInvoicesByClient",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => {

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
    const deleteHandler = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname:"deletePurchaseInvoice"
        }
        deleteapi(payload)
        .then( res => {
            if(res.data.success){
                fetch({ pageSize: 10, page: 0 });
            }
        })
    }
    return (
        <Card>
            <CardHeader>
                {/* createmenuitem */}
                <CardTitle>Purchased Invoice</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createpurchaseinvoice")}
                >
                    Create Purchased Invoice
                  </Button.Ripple>
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
                                    Header: "Invoice No",
                                    accessor: "documentNo",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(purchasedInvoiceUpdate({ ...row.original }))
                                                history.push('/dashboard/updatepurchaseinvoice')
                                            }}>
                                            {row.original.documentNo}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Vendor",
                                    accessor: "vendor",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                              vendorList.length > 0 &&  vendorList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {vendorList.length > 0 && vendorList.filter(i => i.value == row.original.vendor).length > 0 && 
                                                vendorList.filter(i => i.value == row.original.vendor)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Invoice Date",
                                    Filter: ({ filter, onChange }) => (
                                        <Flatpickr
                                            className="form-control"
                                            value={filter ? filter.value : null}
                                            onChange={date => onChange(moment(date[0]).format("YYYY-MM-DD"))}
                                        />
                                    ),
                                    accessor: "invoiceDate"
                                },
                                {
                                    Header: "Payment Method",
                                    accessor: "payMethod",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                              paymentMethodsList.length > 0 &&  paymentMethodsList.map(i => (
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
                                    Header: "Warehouse",
                                    accessor: "warehouse",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                              warehousesList.length > 0 &&  warehousesList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {warehousesList.length > 0 && warehousesList.filter(i => i.value == row.original.warehouse).length > 0 && 
                                                warehousesList.filter(i => i.value == row.original.warehouse)[0].label
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
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            <option value="DR">DRAFTS</option>
                                            <option value="CO">COMPLETE</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.status == "CO" ? "Complete" : row.original.status == "DR" ? "Drafts" : ""}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Delete",
                                    filterable: false,
                                    id: 'delete',
                                    accessor: str => "delete",

                                    Cell: (row) => (
                                        <Button.Ripple 
                                            onClick={() => {
                                                deleteHandler(row.original.id)
                                            }}>
                                            Delete
                                        </Button.Ripple>
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
    )
}


export default Users