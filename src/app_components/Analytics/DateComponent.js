import React from 'react'
import moment from 'moment'
import {
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col
} from "reactstrap"
import { ChevronDown, Filter, Calendar } from "react-feather"
import Flatpickr from "react-flatpickr";
import './style.css'

function DateAndTimePicker(props) {
    const [filterName, setFilterName] = React.useState(null)
    const [overlay, setOverlay] = React.useState(false)
    const [visible, setVisible] = React.useState(false)
    const [fromDate, setFromDate] = React.useState(null)
    const [toDate, setToDate] = React.useState(null)
    const dropDownClickHandler = () => {
        setVisible(true)
    }
    const applyHandler = () => {
        props.onChange(moment(fromDate).format("YYYY-MM-DD HH:mm:ss"), moment(toDate).format("YYYY-MM-DD HH:mm:ss"))
        setVisible(false)
    }
    React.useEffect(() => {
        if (props.defaultType) {
            setFilterName(props.defaultType)
        }
    }, [])
    React.useEffect(() => {
        if (props.fromDate) {
            setFromDate(props.fromDate)
        }
        if (props.toDate) {
            setToDate(props.toDate)
        }
    }, [props.fromDate, props.toDate])

    return (
        <Row>
            <Col md="12" sm="12">
                <div className="dropdown mr-1 mb-1 d-inline-block" style={{ width: '100%' }}>
                    <ButtonDropdown
                        isOpen={visible}
                        toggle={dropDownClickHandler}
                        style={{ width: '100%' }}>
                        <DropdownToggle color="primary" size="sm" caret >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Calendar size={15} style={{ marginRight: "10px" }} />
                                    <p className="filterNmae"
                                        style={{ margin: 0, marginRight: "10px", marginLeft: "10px" }}
                                    >{filterName ? filterName + ": " : props.placeholder}</p>
                                    <p style={{ margin: 0, marginRight: "10px" }} className="date" >
                                        {props.fromDate &&
                                            moment(props.fromDate).format("lll") != "Invalid date" &&
                                            moment(props.fromDate).format("lll")}
                                        {filterName != "Today" && props.toDate &&
                                            moment(props.toDate).format("lll") != "Invalid date" &&
                                            " - " + moment(props.toDate).format("lll")}

                                    </p>
                                </div>
                                <ChevronDown size={15} />

                            </div>
                        </DropdownToggle>
                        <DropdownMenu style={{ width: '100%' }}>
                            <div className="topBar"
                                style={
                                    {
                                        "display": "flex",
                                        "justifyContent": "space-around",
                                        "color": "#fff",
                                        "background": "#7367F0"
                                    }
                                }
                            >
                                <p style={{ padding: '10px 5px', "alignItems": "center", "display": "flex" }}>
                                    <Filter size={15} />
                                </p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "Today" ? "#fff" : "",
                                        color: filterName == "Today" ? "#7367F0" : "",
                                    }}
                                    onClick={() => {
                                        props.onChange(moment(new Date()).format('YYYY-MM-DD') + " 00:00:00", moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
                                        setFilterName("Today")
                                        setVisible(false)
                                    }}>Today</p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "Yesterday" ? "#fff" : "",
                                        color: filterName == "Yesterday" ? "#7367F0" : "",
                                    }}
                                    onClick={() => {
                                        var d = new Date();
                                        d.setDate(d.getDate() - 1);
                                        props.onChange(moment(d).format('YYYY-MM-DD') + " 00:00:00", moment(d).format('YYYY-MM-DD') + " 23:59:59")
                                        setFilterName("Yesterday")
                                        setVisible(false)
                                    }}>Yesterday</p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "This Week" ? "#fff" : "",
                                        color: filterName == "This Week" ? "#7367F0" : "",
                                    }}
                                    onClick={() => {
                                        props.onChange(moment().startOf('isoweek').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('isoweek').format('YYYY-MM-DD HH:mm:ss'))
                                        setFilterName("This Week")
                                        setVisible(false)
                                    }}>This Week</p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "This Month" ? "#fff" : "",
                                        color: filterName == "This Month" ? "#7367F0" : "",
                                    }}
                                    onClick={() => {
                                        props.onChange(moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'), moment().endOf('month').format('YYYY-MM-DD HH:mm:ss'))
                                        setFilterName("This Month")
                                        setVisible(false)
                                    }}
                                >This Month</p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "Last Month" ? "#333333" : ""
                                    }}
                                    onClick={() => {
                                        props.onChange(moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD HH:mm:ss'), moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD HH:mm:ss'))
                                        setFilterName("Last Month")
                                        setVisible(false)
                                    }}
                                >Last Month</p>
                                <p className="filterText"
                                    style={{
                                        padding: '10px 5px', "alignItems": "center", "display": "flex",
                                        backgroundColor: filterName == "Custom" ? "#fff" : "",
                                        color: filterName == "Custom" ? "#7367F0" : "",
                                    }}
                                    onClick={() => {
                                        setFilterName("Custom")
                                    }}>Custom</p>
                            </div>
                            {
                                filterName == "Custom" ?
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            margin: "5px",
                                        }}>
                                            <div>
                                                <p className="text-bold-500">From</p>
                                                <Flatpickr

                                                    className="form-control"
                                                    data-enable-time
                                                    value={fromDate}
                                                    disabled={filterName == "Custom" ? false : true}
                                                    onChange={date => {
                                                        setFromDate(moment(date[0]).format("YYYY-MM-DD HH:mm:ss"))
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-bold-500">To </p>
                                                <Flatpickr
                                                    disabled={filterName == "Custom" ? false : true}
                                                    className="form-control"
                                                    data-enable-time
                                                    value={toDate}
                                                    onChange={date => {
                                                        setToDate(moment(date[0]).format("YYYY-MM-DD HH:mm:ss"))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </>
                                    : <></>
                            }
                            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                                <Button
                                    style={{ marginRight: "10px" }}
                                    color="primary"
                                    disabled={filterName != "Custom"}
                                    onClick={applyHandler}>Apply</Button>
                                <Button
                                    color="danger"
                                    onClick={() => setVisible(false)}>Cancel</Button>
                            </div>
                        </DropdownMenu>
                    </ButtonDropdown>
                </div>
            </Col>
        </Row>
    )
}

export default DateAndTimePicker