import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient,getList, deleteapi, parametersListByParaType } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { productAdditonalUpdate } from '../../redux/actions/updatescreens/role'
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
    const [additionalsList, setAdditionalsList] = useState([])
    const [ingredientProductsListt, setIngredientProductsListt] = useState([])
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getAdditionalsList()
    }, [])
    const getAdditionalsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "additionalsList",
            data: {
                clientId: client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setAdditionalsList(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
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
            apiname: "deleteProdAdd"
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
            apiname: "prodAddByProduct"
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
                <CardTitle>Product Additionals</CardTitle>
                {<Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => props.goToCreate()}
                >
                    Create Product Additionals
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
                                    Header: "Additional Product",
                                    accessor: "additional",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(productAdditonalUpdate({ ...row.original }))
                                                props.goToUpdate()
                                            }}>{additionalsList.length > 0 && 
                                                additionalsList.filter(i => i.value == row.original.additional).length > 0 &&
                                                additionalsList.filter(i => i.value == row.original.additional)[0].label
                                                }  </p>
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