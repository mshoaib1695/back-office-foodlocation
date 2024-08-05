import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { comboProductUpdate } from '../../redux/actions/updatescreens/role'
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
    const [productsList, setProductsList] = useState({})

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getProductsList()
    }, [])
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
            .then(res => { message(res)

                setProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const fetch = ({ pageSize, page, sorted, filtered }) => {
        setLoading(false)
        let payload = {
                clientId: client.clientId,
                size: pageSize,
                page: page,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                comboOpt: props.comboOptionId
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
                if (element.id == "product") {
                    payload.product = element.product
                }
                if (element.id == "salePrice") {
                    payload.salePrice = element.value
                }
                if (element.id == "salePriceTax") {
                    payload.salePriceTax = element.value
                }
                if (element.id == "collectPoints") {
                    payload.collectPoints = element.value
                }               
            }
        }
        gridDataByClient({
            data: payload,
            apiname: "comboProdLevelByOptLevel",
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
            apiname:"deleteComboProdLevel"
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
                <CardTitle>Combo Products</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => props.goToCreate()}
                >
                    Create Combo Product
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
                                    Header: "Product",
                                    accessor: "product",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                              productsList.length > 0 &&  productsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn" 
                                        onClick={() => {
                                            dispatch(comboProductUpdate({ ...row.original }))
                                            props.goToUpdate()
                                        }}
                                        >
                                            {productsList.length > 0 && productsList.filter(i => i.value == row.original.product).length > 0 && 
                                                productsList.filter(i => i.value == row.original.product)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Sale Price",
                                    accessor: "salesPrice",
                                },
                                {
                                    Header: "Sale Price Tax",
                                    accessor: "salesPriceTax"
                                },
                                {
                                    Header: "Collection Points",
                                    accessor: "collectPoints"                                  
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