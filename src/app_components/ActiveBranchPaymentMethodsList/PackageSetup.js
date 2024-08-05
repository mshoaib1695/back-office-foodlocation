import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { packageUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'

function PaymentReason() {
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
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deleteAppPackage"
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
            isDefault: null

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
                if (element.id == "packageType") {
                    payload.packageType = element.value
                }
                if (element.id == "packageAmt") {
                    payload.packageAmt = element.value
                }
                if (element.id == "description") {
                    payload.description = element.value
                }
                if (element.id == "isDefault") {
                    payload.isDefault = element.value
                }
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "appPackagesByClient",
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
                <CardTitle>Packages</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createpackage")}
                >
                    Create Package
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
                                    Header: "Package Type",
                                    accessor: "packageType",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(packageUpdate({ ...row.original }))
                                                history.push('/dashboard/updatepackage')
                                            }}>
                                            {row.original.packageType}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Package Amount",
                                    accessor: "packageAmt",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(packageUpdate({ ...row.original }))
                                                history.push('/dashboard/updatepackage')
                                            }}>
                                            {row.original.packageAmt}
                                        </p>
                                    )
                                },
                              
                               
                                {
                                    Header: "Description",
                                    accessor: "description",
                                },
                                {

                                    Header: "Is Default",
                                    accessor: "isDefault",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            <option value={true}>True</option>
                                            <option value={false}>False</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.isDefault == true ?
                                                "Default" : row.original.isDefault == false
                                                    ? "Not Default" : ""}
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