import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap"
import { gridDataByClient, deleteapi, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import { history } from '../../history'
import { printerUpdate } from '../../redux/actions/updatescreens/role'
import { useDispatch } from 'react-redux'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'

function Users() {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(0)
    const [branchsList, setbranchsList] = useState([])
    const [warehousesList, setWarehousesList] = useState([])
    const user = useSelector(state => state.auth.login.user)
    const client = useSelector(state => state.auth.login.client)
    const dispatch = useDispatch()

    useEffect(() => {
        fetch({ pageSize: 10, page: 0 });
        getbranchsList()
        getWarehousesList()
    }, [])
    const getbranchsList = () => {
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
            .then(res => { message(res)

                setbranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }
    const getWarehousesList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "parametersListByParaType",
            data: {
                paraType:'PRINTER_MODEL',
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setWarehousesList(res.data.map(i => { return { value: i.id, label: i.name } }))

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
                if (element.id == "noOfCopy") {
                    payload.noOfCopy = element.value
                }
                if (element.id == "branch") {
                    payload.branch = element.value
                }
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "printerModel") {
                    payload.printerModel = element.value
                }
                if (element.id == "ipAddr") {
                    payload.ipAddr = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "printerSetupsByClient",
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
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deletePrinterSetup"
        }
        deleteapi(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    fetch({ pageSize: 10, page: 0 });
                }
            })
    }
    const testHandler = (record) => {
        let dID =  this.state.printer_models.find( i => i.id == record.printerModel).paramCode.toLowerCase()
        var builder = new window.epson.ePOSBuilder();
        builder.addTextLang('en');
     builder.addTextSmooth(true);
     builder.addTextFont(builder.FONT_A);
     builder.addTextSize(3, 3);
     builder.addText('Printer,\nCheck!\n');
     builder.addCut(builder.CUT_FEED);
     var request = builder.toString();
     var address = `http://${record.ipAddr}/cgi-bin/epos/service.cgi?devid=${dID}&timeout=10000`;
     //Create an ePOS-Print object
  
     var epos = new window.epson.ePOSPrint(address);
     //Set a response receipt callback function
     epos.onreceive = function (res) {
     //When the printing is not successful, display a message
     if (!res.success) {
    //    message.error('A print error occurred');
    }else{
    
    //   message.success('Printed Successfully');
    }
     }
     //Send the print document
     epos.send(request);
    }
    return (
        <Card>
            <CardHeader>
                {/* createmenuitem */}
                <CardTitle>Printers</CardTitle>
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/createprinter")}
                >
                    Create Printer
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
                                                dispatch(printerUpdate({ ...row.original }))
                                                history.push('/dashboard/updateprinter')
                                            }}>
                                            {row.original.name}
                                        </p>
                                    )
                                },                      
                                {
                                    Header: "Branch",
                                    accessor: "branch",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                branchsList.length > 0 && branchsList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {branchsList.length > 0 && branchsList.filter(i => i.value == row.original.branch).length > 0 &&
                                                branchsList.filter(i => i.value == row.original.branch)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "IP address",
                                    accessor: "ipAddr",
                                },
                                {
                                    Header: "No. Of Copies",
                                    accessor: "noOfCopy",
                                },
                                {
                                    Header: "Printer Models",
                                    accessor: "printerModel",
                                    Filter: ({ filter, onChange }) => (
                                        <select
                                            onChange={event => onChange(event.target.value)}
                                            value={filter ? filter.value : ""}>
                                            <option value="">Show All</option>
                                            {
                                                warehousesList.length > 0 && warehousesList.map(i => (
                                                    <option value={i.value}>{i.label}</option>
                                                ))
                                            }
                                        </select>
                                    ),
                                    Cell: (row) => (
                                        <p className="gridBtn">
                                            {warehousesList.length > 0 && warehousesList.filter(i => i.value == row.original.printerModel).length > 0 &&
                                                warehousesList.filter(i => i.value == row.original.printerModel)[0].label
                                            }
                                        </p>
                                    )
                                },
                                {
                                    Header: "Test",
                                    filterable: false,
                                    id: 'test',
                                    accessor: str => "test",

                                    Cell: (row) => (
                                        <Button.Ripple
                                            onClick={() => {
                                                testHandler(row.original)
                                            }}>
                                            Test Print
                                        </Button.Ripple>
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