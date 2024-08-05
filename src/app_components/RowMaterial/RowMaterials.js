import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { rowmaterialUpdate } from '../../redux/actions/updatescreens/role'
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

    const fetch = ({ pageSize, page }) => {
        setLoading(false)
        let payload = {
            data: {
                clientId: client.clientId,
                size: pageSize,
                page: page,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                isPurchasedProduct: true
            },
            apiname: "productsByClient",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        gridDataByClient(payload)
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
            apiname:"deleteProduct"
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
                <CardTitle>Row Materials</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createrowmaterial")}
                >
                    Create Row Material
                  </Button.Ripple>
            </CardHeader>
            <CardBody>
                <ReactTable
                    data={data}
                    pages={totalPages}
                    columns={[
                        {
                            columns: [
                                {
                                    Header: "Name",
                                    accessor: "name",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(rowmaterialUpdate({ ...row.original }))
                                                history.push('/dashboard/updaterowmaterial')
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
                                    accessor: "description"
                                },
                                {
                                    Header: "Product Key",
                                    accessor: "prodKey"
                                },
                                {
                                    Header: "Current Cost",
                                    accessor: "currentCost"
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
                        fetch({ pageSize: state.pageSize, page: state.page })
                    }}
                />
            </CardBody>
        </Card>
    )
}


export default Users