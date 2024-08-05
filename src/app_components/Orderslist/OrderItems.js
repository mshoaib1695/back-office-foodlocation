import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button, Input } from "reactstrap"
import { gridDataByClient, parametersListByParaType, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
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
        getOrderList()
    }, [props.orderId])
  
    const getOrderList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "orderLinesByOrderId",
            data: {
                orderId: props.orderId,
            },
        }
        getList(payload)
            .then(res => { 
                setData(res.data)
            })
    }
 
    return (
        <Card>
            <CardHeader>
                {/* createmenuitem */}
                <CardTitle>Order Lines</CardTitle>
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
                                    Header: "Product Name",
                                    accessor: "productname",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.productname}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Quantity",
                                    accessor: "qty",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.qty}
                                        </p>
                                    )
                                },
                        
                                {
                                    Header: "Unit Price",
                                    accessor: "unitPrice",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.unitPrice}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Price without tax",
                                    accessor: "priceWithoutTax",
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {row.original.priceWithoutTax}
                                        </p>
                                    )
                                },                            
                            ]
                        },
                    ]}
                    defaultPageSize={4}
                    className="-striped -highlight"
                    pageSizeOptions={[5, 10, 20, 25, 50]}
                    loading={loading}
                    showPagination={false}
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