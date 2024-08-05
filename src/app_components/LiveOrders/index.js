
import React, { Component } from "react"
import {
    Button,
    Progress,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Input
} from "reactstrap"
import DataTable from "react-data-table-component"
import classnames from "classnames"
import ReactPaginate from "react-paginate"
import { history } from "../../history"
import message from '../../API_Helpers/toast'
import Timer from '../Kitchen/Timer'

import {
    Edit,
    Trash,
    ChevronDown,
    Plus,
    Check,
    ChevronLeft,
    ChevronRight
} from "react-feather"
import { connect } from "react-redux"
import { useDispatch } from 'react-redux'
import { gridDataByClient, deleteapi, getList, report, websocketAPI } from '../../API_Helpers/api'
// import Sidebar from "./DataListSidebar"
import Chip from "../../components/@vuexy/chips/ChipComponent"
import { stockMaintananceeUpdate } from '../../redux/actions/updatescreens/role'
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"

import "../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../assets/scss/pages/data-list.scss"

const selectedStyle = {
    rows: {
        selectedHighlighStyle: {
            backgroundColor: "rgba(115,103,240,.05)",
            color: "#7367F0 !important",
            boxShadow: "0 0 1px 0 #7367F0 !important",
            "&:hover": {
                transform: "translateY(0px) !important"
            }
        }
    },
    rec: {
        "background": "#15b6d0",
        "padding": "4px 12px",
        "color": "#fff"
    },
    prepare: {
        "background": "#eaea13",
        "padding": "4px 12px",
        "color": "#fff"
    },
    ready: {
        "background": "#067b06",
        "padding": "4px 12px",
        "color": "#fff"
    }
}


class DataListConfig extends Component {
    componentDidMount() {
        this.getOrderUpdates()
        this.getKitchenOrders()
        this.getReadyOrdersFromLocalStorage()
        setInterval(() => {
            this.getKitchenOrders()
            
        }, 5000);
    }
    getReadyOrdersFromLocalStorage = () => {
        if(localStorage.getItem('readyOrdersLIst') && JSON.parse(localStorage.getItem('readyOrdersLIst')).length){
            this.setState({ readyOrdersLIst: JSON.parse(localStorage.getItem('readyOrdersLIst')) }, () => {
                this.getKitchenOrders()
            })
            for(let i = 0; i < JSON.parse(localStorage.getItem('readyOrdersLIst')).length; i++){
                let orderItem = JSON.parse(localStorage.getItem('readyOrdersLIst'))[i]
                let now = new Date().getTime();
                let fiveMinutesSeconds = 60 * 5
                let distance = now + orderItem.timer;
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeout(() => {
                    this.removeOrderById(orderItem.id)
                }, (fiveMinutesSeconds - seconds) * 1000)
            }
        }
    }
    state = {
        shouldUpdate: true,
        data: [],
        readyOrdersLIst: [],
        totalPages: 0,
        warehousesList: [],
        currentPage: 0,
        pagination: {},
        page: 0,
        dataForCompare: [],
        loading: false,
        allData: [],
        value: "",
        rowsPerPage: 4,
        sidebar: false,
        currentData: null,
        selected: [],
        totalRecords: 0,
        sortIndex: [],
        addNew: "",
        allSelected: false
    }
    objectsEqual = (o1, o2) =>
        Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => o1[p] === o2[p]);
    getKitchenOrders = () => {
        getList({
            tokenType: this.props.user.tokenType,
            accessToken: this.props.user.accessToken,
            apiname: 'displaySaleOrders',
            data: {
                branchId: this.props.client.branchId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            }
        })
            .then(res => {
                if (JSON.stringify(res.data) != JSON.stringify(this.state.dataForCompare) && this.state.shouldUpdate) {
                    if (this.state.readyOrdersLIst.length) {
                        let temmpArr = [...this.state.readyOrdersLIst]
                        Array.prototype.push.apply(temmpArr, res.data);
                        this.setState({ data: temmpArr, dataForCompare: res.data })
                        return
                    }
                    this.setState({ data: res.data, dataForCompare: res.data })
                }
            })
    }
    getOrderUpdates = () => {
        const ws = new WebSocket(
            websocketAPI({
                apiname: "orderLiveUpdate?branchId=" + this.props.client.branchId + '&clientId=' + this.props.client.client
            })
        )
        ws.onmessage = (res) => {
            this.setState({ shouldUpdate: false })
            let data = JSON.parse(res.data.split('order :')[1])
            let tempData = this.state.data.map(item => {
                if (item.id == data.id) {
                    let tempItem = { ...item }
                    tempItem.status = data.status
                    tempItem.kitchenStatus = data.kitchenStatus
                    return { ...tempItem }
                } else {
                    return { ...item }
                }
            })
            this.setState({ data: tempData, dataForCompare: tempData.filter(i => i.kitchenStatus != 'FINISHED') }, () => {
                this.setState({ shouldUpdate: true })

            })
            if (data.kitchenStatus == "FINISHED") {
                let readyOrdersLIst = [...this.state.readyOrdersLIst]
                let item = []
                item = tempData.filter(i => i.id == data.id)
                if (item.length) {
                    let it = item[0]
                    it.timer =  new Date().getTime();
                    readyOrdersLIst.push(it)
                    this.setState({ readyOrdersLIst: readyOrdersLIst })
                    localStorage.setItem('readyOrdersLIst', JSON.stringify(readyOrdersLIst))
                    setTimeout(() => this.removeOrderById(data.id), 5 * 60 * 1000);
                }
            }
        }
    }

    removeOrderById = (id) => {
        let readyOrdersLIst = this.state.readyOrdersLIst.filter(i => i.id != id)
        localStorage.setItem('readyOrdersLIst', JSON.stringify(readyOrdersLIst))
        this.setState({ readyOrdersLIst })
    }
    thumbView = this.props.thumbView


    render() {
        let {
            data,
            allData,
            value,
        } = this.state

        const columns = [
            {
                name: "",
                selector: "",
                sortable: true,
                minWidth: "",
                cell: row => (
                    <p className="text-truncate text-bold-500 mb-0">
                    </p>
                )
            },
            {
                name: "Invoice No",
                selector: "documentNo",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.documentNo} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        {row.documentNo}
                    </p>
                )
            },
            {
                name: "Order No",
                selector: "tokenNo",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.tokenNo} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        {row.tokenNo}
                    </p>
                )
            },
            {
                name: "Order Type",
                selector: "type",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.orderType} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        {row.orderType == "TA" ? "Take Away" : row.orderType == "HM" ? "Home Delivery" : "Dine IN"}
                    </p>
                )
            },
            {
                name: "Total",
                selector: "total",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.totalNet} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        {row.totalNet}
                    </p>
                )
            },
            {
                name: "Timer",
                selector: "time",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.initTime} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        <Timer time={row.initTime} />
                    </p>
                )
            },
            {
                name: "Status",
                selector: "status",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.status} style={
                        row.kitchenStatus == "READY" ? selectedStyle.rec :
                            row.kitchenStatus == "STARTED" ? selectedStyle.prepare : selectedStyle.ready}
                        className="text-truncate text-bold-500 mb-0"
                        onClick={() => {


                        }}
                    >
                        {row.kitchenStatus == "READY" ? "Recieved" : row.kitchenStatus == "STARTED" ? "Preparing" : "Ready"}
                    </p>
                )
            },
        ]
        return (
            <div
                className={`data-list ${this.props.thumbView ? "thumb-view" : "list-view"
                    }`}>
                <DataTable
                    columns={columns}
                    data={value.length ? allData : data}
                    pagination
                    noHeader
                    subHeader
                    responsive
                    pointerOnHover
                    customStyles={selectedStyle}
                    sortIcon={<ChevronDown />}
                    selectableRowsComponent={Checkbox}
                    selectableRowsComponentProps={{
                        color: "primary",
                        icon: <Check className="vx-icon" size={12} />,
                        label: "",
                        size: "sm"
                    }}
                />

            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateHandler: payload => dispatch(stockMaintananceeUpdate({ ...payload }))
    }
}
const mapStateToProps = state => {
    return {
        client: state.auth.login.client,
        user: state.auth.login.user
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DataListConfig)

