import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { productionUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function PaymentReason() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const [PaymentReasonsList, setPaymentMethodsList] = useState([])
    const [finAccountsList, setFinAccountsList] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getPaymentReasonsList()
        getFinAccountsList()
    }, [])
    const getPaymentReasonsList = () => {
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

                setPaymentMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getFinAccountsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setFinAccountsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const deleteHandler = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deleteProduction"
        }
        deleteapi(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    fetch({ pageSize: 10, page: 0 });
                }
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
                if (element.id == "productionDate") {
                    payload.productionDate = element.value
                }
                if (element.id == "expirynDate") {
                    payload.expirynDate = element.value
                }
                if (element.id == "qty") {
                    payload.qty = element.value
                }
                if (element.id == "description") {
                    payload.description = element.value
                }
                if (element.id == "warehouse") {
                    payload.warehouse = element.value
                }
                if (element.id == "product") {
                    payload.product = element.value
                }
                if (element.id == "status") {
                    payload.status = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "productionsByClient",
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
                <CardTitle>Production</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createproduction")}
                >
                    Create Production
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
                                    Header: "Invoice No.",
                                    accessor: "documentNo",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(productionUpdate({ ...row.original }))
                                                history.push('/dashboard/updateproduction')
                                            }}>
                                            {row.original.documentNo}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Production Date",
                                    accessor: "productionDate",
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
                                    Header: "Expiry Date",
                                    accessor: "expiryDate",
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
                                    Header: "Quantity",
                                    accessor: "qty",
                                },
                                {
                                    Header: "Description",
                                    accessor: "description",
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
                                                PaymentReasonsList.length > 0 && PaymentReasonsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {PaymentReasonsList.length > 0 && PaymentReasonsList.filter(i => i.value == row.original.warehouse).length > 0 &&
                                                PaymentReasonsList.filter(i => i.value == row.original.warehouse)[0].label
                                            }
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
                                                finAccountsList.length > 0 && finAccountsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {finAccountsList.length > 0 && finAccountsList.filter(i => i.value == row.original.product).length > 0 &&
                                                finAccountsList.filter(i => i.value == row.original.product)[0].label
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
                                            <option value="DR">Drafts</option>
                                            <option value="CO">Complete</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.status == "CO" ?
                                                "Complete" : row.original.status == "DR"
                                                    ? "Drafts" : ""}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Delete",
                                    id: 'delete',
                                    accessor: str => "delete",
                                    filterable: false,
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


export default PaymentReason