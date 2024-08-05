import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Input,
} from "reactstrap";
import {
  gridDataByClient,
  parametersListByParaType,
  report,
  getList,
} from "../../API_Helpers/api";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../../assets/scss/plugins/extensions/react-tables.scss";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import moment from "moment";
import message from "../../API_Helpers/toast";
import OrderItems from "./OrderItems.js";
import { orderdetails } from "../../redux/actions/updatescreens/role";
import { history } from "../../history";

function Users(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(0);
  const user = useSelector((state) => state.auth.login.user);
  const client = useSelector((state) => state.auth.login.client);
  const dispatch = useDispatch();
  const [branchsList, setBranchsList] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [customerList, setCustomersList] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [paymentMethodsList, setPayMethodsList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  useEffect(() => {
    fetch({ pageSize: 10, page: 0 });
    getCustomersList();
    getWarehousesList();
    getBranchsList();
    getOrderStatus();
    getPayMethodsList();
  }, []);
  useEffect(() => {
      if(filterToDate == null && filterFromDate == null){
        fetch({ pageSize: 10, page: 0 });
      }
  }, [filterToDate, filterFromDate]);
  const getBranchsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "branchsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setBranchsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getWarehousesList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "warehousesList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setWarehousesList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getCustomersList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "customerList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setCustomersList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getPayMethodsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "paymentMethodsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setPayMethodsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getOrderStatus = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        paraType: "ORDER_STATUS",
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    parametersListByParaType(payload).then((res) => {
      message(res);

      setOrderStatus(
        res.data.map((i) => {
          return { value: i.paramCode, label: i.name, id: i.id };
        })
      );
    });
  };
  const fetch = ({ pageSize, page, sorted, filtered }) => {
    setLoading(false);
    let payload = {
      clientId: client.clientId,
      size: pageSize,
      page: page,
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
    };
    if (sorted && sorted.length > 0) {
      payload.sortColumn = sorted[0].id;
      if (sorted[0].desc) {
        payload.sortOrder = "DESC";
      } else {
        payload.sortOrder = "ASC";
      }
    }
    if (filterFromDate) {
      payload.fromDate = filterFromDate;
    }
    if (filterToDate) {
      payload.toDate = filterToDate;
    }
    if (filtered && filtered.length > 0) {
      for (let index = 0; index < filtered.length; index++) {
        const element = filtered[index];

        if (element.id == "documentNo") {
          payload.documentNo = element.value;
        }
        if (element.id == "name") {
          payload.name = element.value;
        }
        if (element.id == "payMethod") {
          payload.payMethod = element.value;
        }
        if (element.id == "orderDate") {
          payload.orderDate = element.value;
        }
        if (element.id == "status") {
          payload.status = element.value;
        }
        if (element.id == "branch") {
          payload.branch = element.value;
        }
        if (element.id == "onlineOrderNo") {
          payload.onlineOrderNo = element.value;
        }
        if (element.id == "customer") {
          payload.customer = element.value;
        }
        if (element.id == "warehouse") {
          payload.warehouse = element.value;
        }
      }
    }
    gridDataByClient({
      data: payload,
      apiname: "saleOrdersByClient",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    }).then((res) => {
      setPage(res.data.page);
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };
  const selectOrder = (id) => {
    setSelectedOrder(id);
    dispatch(orderdetails({ orderId: id }));
    history.push("/dashboard/ordersdetails");
  };

  const reports = () => {
    let data = {
      clientId: client.clientId,
      lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      branch: selectedBranch,
      fromDate: selectedFromDate,
      toDate: selectedToDate,
    };
    let authOptions = {
      data: data,
      apiname: "saleOrderTaxReport",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    };
    report(authOptions)
      .then((res) => {
        const url = window.URL.createObjectURL(
          new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        let a = new Date();
        let date =
          a.getDate() + "-" + (a.getMonth() + 1) + "-" + a.getFullYear();
        link.setAttribute("download", `SaleOrderTaxReport${date}.xlsx`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Card>
        <CardHeader>
          {/* createmenuitem */}
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardBody>
          <div style={{ margin: "20px 0px" }}>
            <p>
              Select filters and click "Download" button to download sale order
              tax report.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <select
                  onChange={(event) => setSelectedBranch(event.target.value)}
                  value={selectedBranch}
                >
                  <option value="">Show All</option>
                  {branchsList.length > 0 &&
                    branchsList.map((item) => (
                      <option value={item.value}>{item.label}</option>
                    ))}
                </select>
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Flatpickr
                  options={{
                    dateFormat: "Y-m-d",
                  }}
                  className="form-control"
                  value={selectedFromDate}
                  onChange={(date) =>
                    setSelectedFromDate(moment(date[0]).format("YYYY-MM-DD"))
                  }
                />
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Flatpickr
                  options={{
                    dateFormat: "Y-m-d",
                  }}
                  className="form-control"
                  value={selectedToDate}
                  onChange={(date) =>
                    setSelectedToDate(moment(date[0]).format("YYYY-MM-DD"))
                  }
                />
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Button.Ripple
                  disabled={
                    selectedToDate && selectedFromDate && selectedBranch
                      ? false
                      : true
                  }
                  color="primary"
                  onClick={() => reports()}
                >
                  Download Report
                </Button.Ripple>
              </div>
            </div>
          </div>
          <div style={{ margin: "20px 0px" }}>
            <p>Filter Orders By From and To Date</p>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Flatpickr
                  placeholder="From Date"
                  options={{
                    dateFormat: "Y-m-d",
                  }}
                  className="form-control"
                  value={filterFromDate}
                  onChange={(date) =>
                    setFilterFromDate(moment(date[0]).format("YYYY-MM-DD"))
                  }
                />
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Flatpickr
                  options={{
                    dateFormat: "Y-m-d",
                  }}
                  placeholder="To Date"
                  className="form-control"
                  value={filterToDate}
                  onChange={(date) =>
                    setFilterToDate(moment(date[0]).format("YYYY-MM-DD"))
                  }
                />
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Button.Ripple
                  color="primary"
                  disabled={filterFromDate && filterToDate ? false : true}
                  onClick={() => fetch({ pageSize: 10, page: 0 })}
                >
                  Apply
                </Button.Ripple>
              </div>
              <div style={{ margin: "0 5px", alignItems: "baseline" }}>
                <Button.Ripple
                  color="primary"
                  onClick={() => {
                    setFilterFromDate(null);
                    setFilterToDate(null);
                  }}
                >
                  Clear
                </Button.Ripple>
              </div>
            </div>
          </div>
          <ReactTable
            data={data}
            pages={totalPages}
            filterable
            columns={[
              {
                columns: [
                  {
                    Header: "Order No.",
                    accessor: "documentNo",
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {row.original.documentNo}
                      </p>
                    ),
                  },
                  {
                    Header: "Order Line No.",
                    accessor: "orderNo",
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {row.original.orderNo}
                      </p>
                    ),
                  },
                  {
                    Header: "Total",
                    accessor: "totalNet",
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {row.original.totalNet}
                      </p>
                    ),
                  },
                  {
                    Header: "Branch",
                    accessor: "branch",
                    Filter: ({ filter, onChange }) => (
                      <select
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                      >
                        <option value="">Show All</option>
                        {branchsList.length > 0 &&
                          branchsList.map((i) => (
                            <option value={i.value}>{i.label}</option>
                          ))}
                      </select>
                    ),
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {branchsList.length > 0 &&
                          branchsList.filter(
                            (i) => i.value == row.original.branch
                          ).length > 0 &&
                          branchsList.filter(
                            (i) => i.value == row.original.branch
                          )[0].label}
                      </p>
                    ),
                  },
                  {
                    Header: "Customer",
                    accessor: "customer",
                    Filter: ({ filter, onChange }) => (
                      <select
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                      >
                        <option value="">Show All</option>
                        {customerList.length > 0 &&
                          customerList.map((i) => (
                            <option value={i.value}>{i.label}</option>
                          ))}
                      </select>
                    ),
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {customerList.length > 0 &&
                          customerList.filter(
                            (i) => i.value == row.original.customer
                          ).length > 0 &&
                          customerList.filter(
                            (i) => i.value == row.original.customer
                          )[0].label}
                      </p>
                    ),
                  },
                  {
                    Header: "Warehouse",
                    accessor: "warehouse",
                    Filter: ({ filter, onChange }) => (
                      <select
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                      >
                        <option value="">Show All</option>
                        {warehousesList.length > 0 &&
                          warehousesList.map((i) => (
                            <option value={i.value}>{i.label}</option>
                          ))}
                      </select>
                    ),
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {warehousesList.length > 0 &&
                          warehousesList.filter(
                            (i) => i.value == row.original.warehouse
                          ).length > 0 &&
                          warehousesList.filter(
                            (i) => i.value == row.original.warehouse
                          )[0].label}
                      </p>
                    ),
                  },
                  {
                    Header: "Payment Method ",
                    accessor: "payMethod",
                    Filter: ({ filter, onChange }) => (
                      <select
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                      >
                        <option value="">Show All</option>
                        {paymentMethodsList.length > 0 &&
                          paymentMethodsList.map((i) => (
                            <option value={i.value}>{i.label}</option>
                          ))}
                      </select>
                    ),
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {paymentMethodsList.length > 0 &&
                          paymentMethodsList.filter(
                            (i) => i.value == row.original.payMethod
                          ).length > 0 &&
                          paymentMethodsList.filter(
                            (i) => i.value == row.original.payMethod
                          )[0].label}
                      </p>
                    ),
                  },
                  {
                    Header: "Order Date",
                    accessor: "orderDate",
                    Filter: ({ filter, onChange }) => (
                      <Flatpickr
                        options={{
                          dateFormat: "Y-m-d",
                        }}
                        className="form-control"
                        value={filter ? filter.value : null}
                        onChange={(date) =>
                          onChange(moment(date[0]).format("YYYY-MM-DD"))
                        }
                      />
                    ),
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    Filter: ({ filter, onChange }) => (
                      <select
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : "all"}
                      >
                        <option value="">Show All</option>
                        {orderStatus.length > 0 &&
                          orderStatus.map((item) => (
                            <option value={item.value}>{item.label}</option>
                          ))}
                      </select>
                    ),
                    Cell: (row) => (
                      <p
                        className="gridBtn"
                        onClick={() => {
                          selectOrder(row.original.id);
                        }}
                      >
                        {orderStatus.length > 0 &&
                          orderStatus.filter(
                            (item) => item.value == row.original.status
                          ).length > 0 &&
                          orderStatus.filter(
                            (item) => item.value == row.original.status
                          )[0].label}
                      </p>
                    ),
                  },
                ],
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
                filtered: state.filtered,
              });
            }}
          />
        </CardBody>
      </Card>
      {/* {
                !!selectedOrder &&
                <OrderItems orderId={selectedOrder} />

            } */}
    </>
  );
}

export default Users;
