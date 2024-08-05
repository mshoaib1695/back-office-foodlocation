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
import message from '../../API_Helpers/toast'

import { history } from "../../history"
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
import { gridDataByClient, deleteapi, getList, report } from '../../API_Helpers/api'
import Sidebar from "./DataListSidebar"
import Chip from "../../components/@vuexy/chips/ChipComponent"
import { warehouseUpdate } from '../../redux/actions/updatescreens/role'
import Checkbox from "../../components/@vuexy/checkbox/CheckboxesVuexy"

import "../../assets/scss/plugins/extensions/react-paginate.scss"
import "../../assets/scss/pages/data-list.scss"

const chipColors = {
    "on hold": "warning",
    delivered: "success",
    pending: "primary",
    canceled: "danger"
}

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
    }
}



const CustomHeader = props => {

    return (
        <div className="data-list-header d-flex justify-content-between flex-wrap">
            <div className="actions-left d-flex flex-wrap">
                <span style={{marginRight: "10px"}}>
                <Checkbox
                    color="primary"
                    icon={<Check className="vx-icon" size={16} />}
                    label="All Selected"
                    defaultChecked={false}
                    onChange={(option) => {
                        props.allSelected(option.target.checked)
                    }}
                />
                </span>
                {props.isPrintBtnShow && <Button.Ripple
                    color="primary "
                    className="add-new-btn"
                    style={{ marginRight: "10px" }}
                    onClick={() => props.printHandler()}
                >
                    Print
                </Button.Ripple>}
                <Button
                    className="add-new-btn"
                    color="primary"
                    onClick={() => {
                        history.push("/dashboard/createwarehouse")
                    }}
                    outline>
                    <Plus size={15} />
                    <span className="align-middle">Add New</span>
                </Button>
            </div>
            <div className="actions-right d-flex flex-wrap mt-sm-0 mt-2">
                <div className="filter-section">
                    <Input type="text" onChange={e => props.handleFilter(e)} />
                </div>
            </div>
        </div>
    )
}

class DataListConfig extends Component {
    componentDidMount() {
        this.fetch({ pageSize: 10, page: 0 });
        this.getWarehousesList()
    }
    state = {
        data: [],
        totalPages: 0,
        warehousesList: [],
        currentPage: 0,
        pagination: {},
        page: 0,
        data: [],
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
    printHandler = async () => {
        let tempArr = []
        let data = {
                data: {},
                tokenType: this.props.user.tokenType,
                accessToken: this.props.user.accessToken,
                apiname: "printWarehouse",
        }
        
        if(this.state.allSelected){
            data.data = {
                "clientId": this.props.client.clientId,
                "selectAll": this.state.allSelected,
                "lang": "EN"
            }
        }else{
            await this.state.selected.forEach(i => {
                tempArr.push(i.id)
            })
            data.data = {
                "clientId": this.props.client.clientId,
                "selectAll": this.state.allSelected,
                "lang": "EN",
                "ids": tempArr
            }
        }
        report(data)
            .then(res => { message(res)

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                let a = new Date()
                let date = a.getDate() + '-' + (a.getMonth() + 1) + '-' + a.getFullYear() + '-' + a.getHours() + ':' + a.getMinutes() + ':' + a.getSeconds()
                link.setAttribute('download', `InventoryCountReport${date}.pdf`);
                document.body.appendChild(link);
                link.click();
            })
    }
    getWarehousesList = () => {
        let payload = {
            tokenType: this.props.user.tokenType,
            accessToken: this.props.user.accessToken,
            apiname: "warehousesList",
            data: {
                clientId: this.props.client.clientId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                this.setState({ warehousesList: res.data.map(i => { return { value: i.id, label: i.name } }) })

            })
    }
    thumbView = this.props.thumbView
    fetch = ({ pageSize, page, sorted, filtered }) => {
        this.setState({ loading: false })
        let payload = {
            clientId: this.props.client.clientId,
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
                if (element.id == "name") {
                    payload.name = element.value
                }
                if (element.id == "description") {
                    payload.description = element.value
                }
                if (element.id == "nameAr") {
                    payload.nameAr = element.value
                }
                if (element.id == "address") {
                    payload.address = element.value
                }
            }
        }
        payload.isFinalProduct = true
        gridDataByClient({
            data: payload,
            apiname: "warehousesByClient",
            tokenType: this.props.user.tokenType,
            accessToken: this.props.user.accessToken,
        })
            .then(res => { 

                this.setState({
                    page: res.data.page,
                    data: res.data.content,
                    totalPages: res.data.totalPages,
                })
            })
    }
    deleteHandler = (id) => {
        let payload = {
            tokenType: this.props.user.tokenType,
            accessToken: this.props.user.accessToken,
            data: {
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
                id: id
            },
            apiname: "deleteWarehouse"
        }
        deleteapi(payload)
            .then(res => { message(res)

                if (res.data.success) {
                    this.fetch({ pageSize: 10, page: 0 });

                }
            })
    }

    render() {
        let {
            data,
            allData,
            totalPages,
            value,
            rowsPerPage,
            currentData,
            sidebar,
            totalRecords,
            sortIndex
        } = this.state
        const columns = [
            {
                name: "Name",
                selector: "name",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.name} className="text-truncate text-bold-500 mb-0"
                        onClick={() => {
                            this.props.updateHandler({ ...row })
                            history.push("/dashboard/updatewarehouse")
                        }}
                    >
                        {row.name}
                    </p>
                )
            },
            {
                name: "Arabic Name",
                selector: "nameAr",
                sortable: true,
                minWidth: "60px",
                cell: row => (
                    <p title={row.nameAr} className="text-truncate text-bold-500 mb-0">
                        {row.nameAr}
                    </p>
                )
            },
        
            {
                name: "Description",
                selector: "description",
                sortable: true,
                minWidth: "60px",
            },
            {
                name: "Address",
                selector: "address",
                sortable: true,
                minWidth: "60px",
                
            },
            {
                name: "Actions",
                sortable: true,
                cell: row => (
                    <div className="data-list-action">
                        <Trash
                            className="cursor-pointer"
                            size={20}
                            onClick={() => {
                                this.deleteHandler(row.id)
                            }}
                        />
                    </div>
                )
            }
        ]
        return (
            <div
                className={`data-list ${this.props.thumbView ? "thumb-view" : "list-view"
                    }`}>
                <DataTable
                    columns={columns}
                    data={value.length ? allData : data}
                    pagination
                    paginationServer
                    paginationComponent={() => (
                        <ReactPaginate
                            previousLabel={<ChevronLeft size={15} />}
                            nextLabel={<ChevronRight size={15} />}
                            breakLabel="..."
                            breakClassName="break-me"
                            pageCount={totalPages}
                            containerClassName="vx-pagination separated-pagination pagination-end pagination-sm mb-0 mt-2"
                            activeClassName="active"
                            forcePage={0}
                            onPageChange={page => this.fetch({ pageSize: 10, page: page.selected })}
                        />
                    )}
                    noHeader
                    subHeader
                    selectableRows
                    responsive
                    pointerOnHover
                    selectableRowsHighlight
                    onSelectedRowsChange={data => {
                        this.setState({ selected: data.selectedRows})
                    }
                    }
                    customStyles={selectedStyle}
                    subHeaderComponent={
                        <CustomHeader
                            handleSidebar={this.handleSidebar}
                            handleFilter={this.handleFilter}
                            printHandler={this.printHandler}
                            allSelected={e => this.setState({allSelected: e})}
                            isPrintBtnShow ={ (this.state.selected.length > 0 || this.state.allSelected) ? true : false}
                            handleRowsPerPage={this.handleRowsPerPage}
                            rowsPerPage={rowsPerPage}
                            total={totalRecords}
                            index={sortIndex}
                        />
                    }
                    sortIcon={<ChevronDown />}
                    selectableRowsComponent={Checkbox}
                    selectableRowsComponentProps={{
                        color: "primary",
                        icon: <Check className="vx-icon" size={12} />,
                        label: "",
                        size: "sm"
                    }}
                />
                <Sidebar
                    show={sidebar}
                    data={currentData}
                    updateData={this.props.updateData}
                    addData={this.props.addData}
                    handleSidebar={this.handleSidebar}
                    thumbView={this.props.thumbView}
                    getData={this.props.getData}
                    dataParams={this.props.parsedFilter}
                    addNew={this.state.addNew}
                />
                <div
                    className={classnames("data-list-overlay", {
                        show: sidebar
                    })}
                    onClick={() => this.handleSidebar(false, true)}
                />
            </div>
        )
    }
}
const mapDispatchToProps = dispatch => {
    return {
        updateHandler: payload => dispatch(warehouseUpdate({ ...payload }))
    }
}
const mapStateToProps = state => {
    return {
        client: state.auth.login.client,
        user: state.auth.login.user
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DataListConfig)

