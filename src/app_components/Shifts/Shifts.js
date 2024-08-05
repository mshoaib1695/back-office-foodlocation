import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { shiftUpdate } from '../../redux/actions/updatescreens/role'
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
            apiname: "deleteShift"
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
                if (element.id == "name") {
                    payload.couponNo = element.value
                }
                if (element.id == "nameAr") {
                    payload.fromDate = element.value
                }
                if (element.id == "startTime") {
                    payload.toDate = element.value
                }
                if (element.id == "endTime") {
                    payload.discountAmt = element.value
                }
            }
        }
        gridDataByClient({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: payload,
            apiname: "shiftByClient"
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
                    onClick={e => history.push("/dashboard/createshift")}
                >
                    Create Shift
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
                                                dispatch(shiftUpdate({ ...row.original }))
                                                history.push('/dashboard/updateshift')
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
                                                dispatch(shiftUpdate({ ...row.original }))
                                                history.push('/dashboard/updateshift')
                                            }}>
                                            {row.original.nameAr}
                                        </p>
                                    )
                                },
    
                                {
                                    Header: "Start Time",
                                    accessor: "startTime",
                                    Filter: ({ filter, onChange }) => (
                                        <Flatpickr
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                            }}
                                            className="form-control"
                                            value={filter ? filter.value : null}
                                            onChange={date => onChange(moment(date[0]).format("HH:mm:ss"))}
                                        />
                                    )
                                },
                                {
                                    Header: "End TIme",
                                    accessor: "endTime",
                                    Filter: ({ filter, onChange }) => (
                                        <Flatpickr
                                            options={{
                                                enableTime: true,
                                                noCalendar: true,
                                                dateFormat: "H:i",
                                            }}
                                            className="form-control"
                                            value={filter ? filter.value : null}
                                            onChange={date => onChange(moment(date[0]).format("HH:mm:ss"))}
                                        />
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