import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { parametersByClient, deleteParameters } from '../../API_Helpers/parameters'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import {history} from '../../history'
import {parameterUpdate} from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import message from '../../API_Helpers/toast'


function Parameters() {
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
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            id: id
        }
        deleteParameters(payload)
        .then( res => {
            
            if(res.data.success){
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
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        if (sorted && sorted.length > 0) {
            payload.sortColumn = sorted[0].id
            if(sorted[0].desc){
                payload.sortOrder = 'DESC'
            }else{
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
                if (element.id == "paraType") {
                    payload.paraType = element.value
                }
                if (element.id == "paraCode") {
                    payload.paraCode = element.value
                }
            }
        }
        parametersByClient(payload)
            .then(res => { message(res)

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Parameters</CardTitle>
                <Button.Ripple
                                    color="primary"
                                    type="submit"
                                    className="mr-1 mb-1"
                                    onClick={e => history.push("/dashboard/cretaparameter")}
                                >
                                    Create Parameter
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
                                                dispatch(parameterUpdate({...row.original}))
                                                history.push('/dashboard/updateparameter')
                                            }}>
                                            {row.original.name}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Arabic Name",
                                    accessor: "nameAr",
                                },
                                {
                                    Header: "Description",
                                    accessor: "description",
                                },
                                {
                                    Header: "Code",
                                    accessor: "paraCode",
                                },
                                {
                                    Header: "Type",
                                    accessor: "paraType",
                                },
                                {
                                    Header: "Delete",
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


export default Parameters