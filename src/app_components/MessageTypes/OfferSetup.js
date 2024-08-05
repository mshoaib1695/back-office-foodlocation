import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { offerUpdate } from '../../redux/actions/updatescreens/role'
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
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getPaymentReasonsList()
    }, [])
    const getPaymentReasonsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParaType",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                paraType: 'OFFER_TYPES'
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setPaymentMethodsList(res.data.map(i => { return { value: i.paramCode, label: i.name } }))

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
            apiname: "deleteOfferType"
        }
        deleteapi(payload)
            .then(res => {
                message(res)

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
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "nameAr") {
                    payload.nameAr = element.value
                }
                if (element.id == "description") {
                    payload.description = element.value
                }
                if (element.id == "offerCategory") {
                    payload.offerCategory = element.value
                }
                if (element.id == "buyQty") {
                    payload.buyQty = element.value
                }
                if (element.id == "getQty") {
                    payload.getQty = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "offerTypesByClient",
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
                <CardTitle>Offers</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createoffer")}
                >
                    Create Offer
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
                                    Header: "Name",
                                    accessor: "name",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(offerUpdate({ ...row.original }))
                                                history.push('/dashboard/updateoffer')
                                            }}>
                                            {row.original.name}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Arabic Name",
                                    accessor: "nameAr",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(offerUpdate({ ...row.original }))
                                                history.push('/dashboard/updateoffer')
                                            }}>
                                            {row.original.nameAr}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Offer Category",
                                    accessor: "offerCategory",
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
                                            {PaymentReasonsList.length > 0 && PaymentReasonsList.filter(i => i.value == row.original.offerCategory).length > 0 &&
                                                PaymentReasonsList.filter(i => i.value == row.original.offerCategory)[0].label
                                            }
                                        </p>
                                    )
                                },
                              
                                {
                                    Header: "Buy Quantity",
                                    accessor: "buyQty",
                                },
                                {
                                    Header: "Get Quantity",
                                    accessor: "getQty",
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