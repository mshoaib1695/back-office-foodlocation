import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody , Button} from "reactstrap"
import { usersByClient } from '../../API_Helpers/users'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import {history} from '../../history'
import {userUpdate} from '../../redux/actions/updatescreens/role'
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
        fetch({pageSize: 10, page: 0});
    }, [])

    const fetch = ({pageSize, page}) => {
        setLoading(false)
        let payload = {
            clientId: client.clientId,
            size: pageSize,
            page: page,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        }
        usersByClient(payload)
            .then(res => { message(res)

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Users</CardTitle>
                <Button.Ripple
                                    color="primary"
                                    type="submit"
                                    className="mr-1 mb-1"
                                    onClick={e => history.push("/dashboard/createuser")}
                                >
                                    Create User
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
                                                dispatch(userUpdate({...row.original}))
                                                history.push('/dashboard/userupdate')
                                            }}>
                                            {row.original.name}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Arabic Name",
                                    id: "nameAr",
                                },
                                {
                                    Header: "Email",
                                    accessor: "email"
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
                        fetch({pageSize: state.pageSize, page: state.page})
                    }}
                />
            </CardBody>
        </Card>
    )
}


export default Users