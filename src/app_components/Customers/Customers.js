import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi, parametersListByParaType } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { customerUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import moment from 'moment'
import message from '../../API_Helpers/toast'

function Vendors() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [page, setPage] = useState(0)
    const [countries, seCountries] = useState([])
    const [cities, setCities] = useState([])
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getCountries()
        getCities()

    }, [])
    const getCountries = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "COUNTRY",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                seCountries(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
            })
    }
    const getCities = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "CITY",
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        parametersListByParaType(payload)
            .then(res => { message(res)

                setCities(res.data.map(i => { return { value: i.id, label: i.name, paramCode: i.paramCode } }))
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
            apiname: "deleteCustomer"
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
                if (element.id == "city") {
                    payload.city = element.value
                }
                if (element.id == "country") {
                    payload.country = element.value
                }
                if (element.id == "email") {
                    payload.email = element.value
                }
                if (element.id == "flatNo") {
                    payload.flatNo = element.value
                }
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "phoneNo") {
                    payload.phoneNo = element.value
                }
                if (element.id == "street") {
                    payload.street = element.value
                }
                if (element.id == "building") {
                    payload.building = element.value
                }
                if (element.id == "landmark") {
                    payload.landmark = element.value
                }
                if (element.id == "debitAmt") {
                    payload.debitAmt = element.value
                }
                if (element.id == "collectPoints") {
                    payload.collectPoints = element.value
                }
                if (element.id == "curBalance") {
                    payload.curBalance = element.value
                }
            }
        }
        gridDataByClient({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: payload,
            apiname: "customersByClient"
        })
            .then(res => { 

                setPage(res.data.page)
                setData(res.data.content)
                setTotalPages(res.data.totalPages)
            })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createcustomer")}
                >
                    Create Customer
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
                                                dispatch(customerUpdate({ ...row.original }))
                                                history.push('/dashboard/updatecustomer')
                                            }}>
                                            {row.original.name}
                                        </p>
                                    )
                                },
                                {
                                    Header: "Phone Number",
                                    accessor: "phoneNo",
                                },
                                {
                                    Header: "Email",
                                    accessor: "email",

                                },
                                {
                                    Header: "City",
                                    accessor: "city",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event =>  onChange(event.target.value)}
                                            value={filter ? filter.value : "all"}>
                                            <option value="">Show All</option>
                                            {
                                                cities.length > 0 && cities.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {cities.length > 0 && cities.filter(i => i.value == row.original.city).length > 0 && 
                                                cities.filter(i => i.value == row.original.city)[0].label
                                            }
                                        </p>
                                    )

                                },
                                {
                                    Header: "Country",
                                    accessor: "country",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                              countries.length > 0 &&  countries.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {countries.length > 0 && countries.filter(i => i.value == row.original.country).length > 0 && 
                                                countries.filter(i => i.value == row.original.country)[0].label
                                            }
                                        </p>
                                    )

                                },
                                {
                                    Header: "Street",
                                    accessor: "street",

                                },
                                {
                                    Header: "Flat No.",
                                    accessor: "flatNo",

                                },
                                {
                                    Header: "Building",
                                    accessor: "building",

                                },
                                {
                                    Header: "Landmark",
                                    accessor: "landmark",

                                },
                                {
                                    Header: "Debit Amount",
                                    accessor: "debitAmt",

                                },
                                {
                                    Header: "Collection Points",
                                    accessor: "collectPoints",
                                },
                                {
                                    Header: "Current Balance",
                                    accessor: "curBalance",
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


export default Vendors