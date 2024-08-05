import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { productionUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import { gridDataByClient, deleteapi, getList, report } from '../../API_Helpers/api'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'
import DateComponent from '../Analytics/DateComponent'
import useStateWithCallback from 'use-state-with-callback';

function PaymentReason() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const [PaymentReasonsList, setPaymentMethodsList] = useState([])
    const [finAccountsList, setFinAccountsList] = useState([])
    const [branch, setBranch] = useState('')
    const [state, setState] = useStateWithCallback({ toDate: '', fromDate: '' }, state => {
        if(state.toDate != "" || state.fromDate != "" ){
            apiCalls()
        }
    })
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getPaymentReasonsList()
        getFinAccountsList()
    }, [])
    const getPaymentReasonsList = () => {
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
            .then(res => {
                message(res)

                setPaymentMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getFinAccountsList = () => {
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

                setFinAccountsList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
            apiname: "deleteProduction"
        }
        deleteapi(payload)
            .then(res => {
                message(res)

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
            branch: branch

        }
        if (sorted && sorted.length > 0) {
            payload.sortColumn = sorted[0].id
            if (sorted[0].desc) {
                payload.sortOrder = 'DESC'
            } else {
                payload.sortOrder = 'ASC'
            }
        }
        apihandle(payload)

    }
    const apihandle = (payload) => {
        gridDataByClient({
            data: payload,
            apiname: "productSaleDetails",
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => {
                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
    const onChange = (value) => {
        setBranch(value)
        let payload = {
            clientId: client.clientId,
            size: 10,
            page: 0,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        }
        if (value != 'null') {
            payload.branch = value
        }

        apihandle(payload)
    }
    const apiCalls = () => {
        let payload = {
            clientId: client.clientId,
            size: 10,
            page: 0,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        }
        if (branch != 'null') {
            payload.branch = branch
        }
        
        if (state.toDate != '') {
            payload.toDate = state.toDate.toDateh
        }
        if (state.fromDate != '') {
            payload.fromDate = state.fromDate
        }

        apihandle(payload)
    }
    const printReportFunc = () => {
        let authOptions = {
            apiname:'productSalesPdfReport',
            data: {
              branch: branch ? branch : null,
              toDate: state.toDate ? state.toDate : null,
              fromDate: state.fromDate ? state.fromDate : null,
              fromTime:  null,
              toTime:  null,
              clientId: client.clientId,
              lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
          }
          report(authOptions)
            .then(res => {
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement('a');
              link.href = url;
              let a = new Date()
              let date = a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear()
              link.setAttribute('download', `ProductSaleReport${date}.pdf`);
              document.body.appendChild(link);
              link.click();
            })
            .catch(err => console.log(err))
    }
    return (
        <Card>
            <CardHeader>
            <CardTitle>Product Sale Details</CardTitle>

            </CardHeader>
            <CardHeader>
                <div style={{    width: '20%'}}> 
                <p>Filter By Branch</p>
                <select
                    onChange={event => onChange(event.target.value)}
                    value={branch}>
                    <option value={'null'}>Show All</option>
                    {
                        PaymentReasonsList.length > 0 && PaymentReasonsList.map(i => (
                            <option value={i.value}>{i.label}</option>
                        ))
                    }
                </select>
                </div>
                <div style={{    width: '50%'}}>
                    <DateComponent
                        defaultType={"Today"}
                        toDate={state.toDate ? state.toDate : moment(new Date()).format('YYYY-MM-DD') + "23:59:59"}
                        fromDate={state.fromDate ? state.fromDate : moment(new Date()).format('YYYY-MM-DD') + " 00:00:00"}
                        onChange={(fromDate, toDate) => {
                            (fromDate && toDate) ?
                                setState({ ...state, toDate: toDate, fromDate: fromDate })
                                : setState({ ...state, toDate: '', fromDate: '' })
                        }}
                    />
                </div>
                <div style={{    width: '20%'}}>
                    <Button  onClick={() => printReportFunc()} color="primary">Print</Button>
                </div>
            </CardHeader>
            <CardBody>
                <ReactTable
                    data={data}
                    pages={totalPages}
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
                                                finAccountsList.length > 0 && finAccountsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {finAccountsList.length > 0 && finAccountsList.filter(i => i.value == row.original.product).length > 0 &&
                                                finAccountsList.filter(i => i.value == row.original.product)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Cost",
                                    accessor: "cost",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(productionUpdate({ ...row.original }))
                                            }}>
                                            {row.original.cost}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Product Price Without Tax  ",
                                    accessor: "priceWithOutTax",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(productionUpdate({ ...row.original }))
                                            }}>
                                            {row.original.priceWithOutTax}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Sale Price",
                                    accessor: "salesPrice",
                                    Cell: (row) => (
                                        <p className="gridBtn"
                                            onClick={() => {
                                                dispatch(productionUpdate({ ...row.original }))
                                            }}>
                                            {row.original.salesPrice}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Quantity",
                                    accessor: "qty",
                                },
                                {
                                    Header: "Tax Amount",
                                    accessor: "taxAmount",
                                },
                                {
                                    Header: "Profit",
                                    accessor: "profit",
                                },
                                {
                                    Header: "Delete",
                                    id: 'delete',
                                    accessor: str => "delete",
                                    filterable: false,
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
                        return
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


export default PaymentReason