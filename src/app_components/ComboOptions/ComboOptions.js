import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { comboOptionUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import message from '../../API_Helpers/toast'

function Users(props) {
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
                combo: props.comboId
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
                if (element.id == "opt") {
                    payload.opt = element.value
                }
                if (element.id == "minQty") {
                    payload.minQty = element.value
                }
                if (element.id == "maxQty") {
                    payload.maxQty = element.value
                }
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "comboOptLevelByCombo",
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
            apiname:"deleteComboOptLevel"
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
                <CardTitle>Combo Options</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => props.goToCreate()}
                >
                    Create Combo Option
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
                                    Header: "Option",
                                    accessor: "opt",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(comboOptionUpdate({ ...row.original }))
                                                props.goToUpdate()
                                            }}>
                                            {row.original.opt}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Min Quantity",
                                    accessor: "minQty",
                                },
                                {
                                    Header: "Max Quantity",
                                    accessor: "maxQty"
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