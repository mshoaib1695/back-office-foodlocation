import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button, Input } from "reactstrap"
import { gridDataByClient, create, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { stockMaintananceLineUpdate } from '../../redux/actions/updatescreens/role'
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
    const [productsList, setProductsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const [uomsList, setUomsList] = useState([])

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getUomsList()
        getWarehousesList()
        getProductsList()
    }, [])

    useEffect(() => {
        callingFrom()
    }, [props.refresh])
    const callingFrom = () => {
        fetch({ pageSize: 10, page: 0 });
    }
    const getProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getWarehousesList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "warehousesList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setWarehousesList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getUomsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const fetch = ({ pageSize, page, sorted, filtered }) => {
        setLoading(false)
        let payload = {
            clientId: client.clientId,
            size: pageSize,
            page: page,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            inventoryCount: props.inventoryCountId
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
                if (element.id == "lineno") {
                    payload.lineno = element.value
                }
                if (element.id == "qty") {
                    payload.qty = element.value
                }
                if (element.id == "uom") {
                    payload.uom = element.value
                }
                if (element.id == "product") {
                    payload.product = element.value
                }
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "inventoryCountLinesByInventoryCount",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => {

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
    const updateInventoryCountLine = (v, qty) => {
        let payload = {
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: v,
                realQty: qty
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "updateInventoryCountLine"
        }
        create(payload)
            .then(res => {
                message(res)

                if (res.data.success) {
                    fetch({ pageSize: 10, page: page });
                }
            })
    }
    return (
        <Card>
            <CardHeader>
                {/* createmenuitem */}
                <CardTitle>Enventory Count Lines</CardTitle>
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
                                    Header: "No.",
                                    accessor: "lineno",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(stockMaintananceLineUpdate({ ...row.original }))
                                            }}>
                                            {row.original.lineno}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Product",
                                    accessor: "product",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                productsList.length > 0 && productsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {productsList.length > 0 && productsList.filter(i => i.value == row.original.product).length > 0 &&
                                                productsList.filter(i => i.value == row.original.product)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "UOM",
                                    accessor: "uom",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                uomsList.length > 0 && uomsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {uomsList.length > 0 && uomsList.filter(i => i.value == row.original.uom).length > 0 &&
                                                uomsList.filter(i => i.value == row.original.uom)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Real Quantity",
                                    accessor: "realQty",
                                    Cell: (row) => (
                                        <Input value={row.original.realQty}  onBlur={(e) => updateInventoryCountLine(row.original.id, e.target.value)} />
                                    )
                                },
                                {
                                    Header: "Quantity",
                                    accessor: "qty",
                                },
                                {
                                    Header: "Quantity Difference",
                                    accessor: "qtyDif",
                                },
                                {
                                    Header: "Unit Cost",
                                    accessor: "unitCost",
                                },
                                {
                                    Header: "Waste Cost",
                                    accessor: "wasteCost",
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


export default Users