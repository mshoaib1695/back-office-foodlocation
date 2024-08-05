import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient,getList, deleteapi, parametersListByParaType } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { productOfferUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function ProductProductOffers(props) {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(0)
    const [uomsList, setUomsList] = useState([])
    const [ingredientProductsListt, setIngredientProductsListt] = useState([])
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getUomsList()
        getIngredientProductsList()
    }, [])
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
            .then(res => { message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getIngredientProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "ingredientProductsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setIngredientProductsListt(res.data.map(i => { return { value: i.id, label: i.name, currentCost: i.currentCost } }))
            })
    }

    const deleteHandler = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deleteProdPrice"
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
            product: props.menuId
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
                if (element.id == "barcode") {
                    payload.city = element.value
                }
                if (element.id == "collectPoints") {
                    payload.country = element.value
                }
                if (element.id == "salesPrice") {
                    payload.email = element.value
                }
                if (element.id == "salesPriceTax") {
                    payload.flatNo = element.value
                }
                if (element.id == "uom") {
                    payload.name = element.value
                }
            }
        }
        gridDataByClient({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: payload,
            apiname: "prodOfferByProduct"
        })
            .then(res => { 

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
    const get_currentCost = (record) => {
        let cc = 0
        if(ingredientProductsListt.length > 0){
          if(ingredientProductsListt.filter(item => item.value == record.ingrntProd).length > 0){
            cc = ingredientProductsListt.filter(item => item.value == record.ingrntProd)[0].currentCost
          }
        }   
        
        return cc
      }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Offers</CardTitle>
                {<Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => props.goToCreate()}
                >
                    Create Product Offers
                  </Button.Ripple>}
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
                                                dispatch(productOfferUpdate({ ...row.original }))
                                                props.goToUpdate()
                                            }}>{row.original.name}  </p>
                                    )
                                },
                                {
                                    Header: "Start Date",
                                    accessor: "startDate",
                                },
                                {
                                    Header: "End Date",
                                    accessor: "endDate",
                                },
                                {
                                    Header: "Offer Price",
                                    accessor: "offerPrice",
                                },
                                {
                                    Header: "Offer Price",
                                    accessor: "offerPriceTax",
                                },
                                {
                                    Header: "Collection Points  ",
                                    accessor: "collectPoints",
                                },
                                {
                                    Header: "Status",
                                    accessor: "isActive",
                                },
          
                                {
                                    Header: "Unit Of Measure",
                                    accessor: "offerType",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event =>  onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
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
                    defaultPageSize={1}
                    className="-striped -highlight"
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


export default ProductProductOffers