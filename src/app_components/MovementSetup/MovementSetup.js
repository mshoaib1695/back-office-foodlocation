import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { movementUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import message from '../../API_Helpers/toast'

function Users() {
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
                if (element.id == "description") {
                    payload.description = element.value
                }
                if (element.id == "movementDate") {
                    payload.movementDate = element.value
                }
                if (element.id == "address") {
                    payload.address = element.value
                }               
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "movementsByClient",
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
            apiname:"deleteMovement"
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
                <CardTitle>Goods Movemnet Setup</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createmovement")}
                >
                    Create Movemnet
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
                                    Header: "Movement No.",
                                    accessor: "documentNo",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(movementUpdate({ ...row.original }))
                                                history.push('/dashboard/updatemovement')
                                            }}>
                                            {row.original.documentNo}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Date",
                                    accessor: "movementDate",
                                },
                                {
                                    Header: "Description",
                                    accessor: "description"
                                },
                                {
                                    Header: "Status",
                                    accessor: "status",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            <option value="CO">Complete</option>
                                            <option value="DR">Drafts</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.status == "CO" ?
                                                "Complete" : "Drafts"}
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