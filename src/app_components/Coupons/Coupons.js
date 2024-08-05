import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { couponrUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function Coupons() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
    }, [])
    const deleteHandler = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data:{
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deleteCoupon"
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
                if (element.id == "couponNo") {
                    payload.couponNo = element.value
                }
                if (element.id == "fromDate") {
                    payload.fromDate = element.value
                }
                if (element.id == "toDate") {
                    payload.toDate = element.value
                }
                if (element.id == "discountAmt") {
                    payload.discountAmt = element.value
                }
                if (element.id == "discountPtg") {
                    payload.discountPtg = element.value
                }
                if (element.id == "discountType") {
                    payload.discountType = element.value
                }
                if (element.id == "noOfTimeUse") {
                    payload.noOfTimeUse = element.value
                }
                if (element.id == "status") {
                    payload.status = element.value
                }
            }
        }
        gridDataByClient({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: payload,
            apiname: "couponsByClient"
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
                <CardTitle>Coupons</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createcoupon")}
                >
                    Create Coupon
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
                                    Header: "Coupon No",
                                    accessor: "couponNo",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(couponrUpdate({ ...row.original }))
                                                history.push('/dashboard/updatecoupon')
                                            }}>
                                            {row.original.couponNo}
                                        </p>
                                    )
                                },
                                {
                                    Header: "From Date",
                                    accessor: "fromDate",
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
                                    Header: "To Date",
                                    accessor: "toDate",
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
                                    Header: "Discount Amount",
                                    accessor: "discountAmt",
                                },
                                {
                                    Header: "Discount Percentage",
                                    accessor: "discountPtg",
                                },
                                {
                                    Header: "Used",
                                    accessor: "noOfTimeUse",

                                },
                                {

                                    Header: "Discount Type",
                                    accessor: "discountType",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            <option value="P">Percentage</option>
                                            <option value="A">Amount</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.discountType == "P" ?
                                                "Percentage" : "Amount"}
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
                                            <option value="A">Active</option>
                                            <option value="E">Expired</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.status == "A" ?
                                                "Active" : "Expired"}
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


export default Coupons