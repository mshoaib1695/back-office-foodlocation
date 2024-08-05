import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import Flatpickr from "react-flatpickr";
import moment from 'moment'
import "react-table/react-table.css"
import { cashupView } from '../../redux/actions/updatescreens/role'
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { branchUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import message from '../../API_Helpers/toast'


function CashupVeiw() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()
    const [branchsList, setBranchsList] = useState({})
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
    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getBranchsList()
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
                if (element.id == "total") {
                    payload.total = element.value
                }
                if (element.id == "cashMthdAmt") {
                    payload.cashMthdAmt = element.value
                }
                if (element.id == "branch") {
                    payload.branch = element.value
                } 
                if (element.id == "status") {
                    payload.status = element.value
                }
                if (element.id == "cashupDate") {
                    payload.cashupDate = element.value
                }
                if (element.id == "closeDate") {
                    payload.closeDate = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "cashUpsViewByClient",
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
                <CardTitle>Cashup Veiw</CardTitle>

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
                                    Header: "Total",
                                    accessor: "total",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(cashupView({ ...row.original }))
                                                history.push('/dashboard/cashupviewdetails')
                                            }}>
                                            {row.original.total}
                                        </p>
                                    )
                                },
                                {
                                    Header: "cash Method Amt",
                                    accessor: "cashMthdAmt"
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
                                              branchsList.length > 0 &&  branchsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {branchsList.length > 0 && branchsList.filter(i => i.value == row.original.branch).length > 0 && 
                                                branchsList.filter(i => i.value == row.original.branch)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "card Method Amt",
                                    accessor: "cardMthdAmt"
                                },
                            
                                {

                                    Header: "Status",
                                    accessor: "status",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            <option value="O">Open</option>
                                            <option value="C">Close</option>
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.status == "C" ?
                                                "Close" : row.original.status == "O"
                                                    ? "Open" : ""}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Cashup Date",
                                    accessor: "cashupDate",
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
                                    Header: "Close Date",
                                    accessor: "closeDate",
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


export default CashupVeiw