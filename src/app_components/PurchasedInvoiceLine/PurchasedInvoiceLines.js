import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap";
import {
  gridDataByClient,
  deleteapi,
  getList,
  create,
} from "../../API_Helpers/api";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../../assets/scss/plugins/extensions/react-tables.scss";
import { purchasedInvoiceLineUpdate } from "../../redux/actions/updatescreens/role";
import { useDispatch } from "react-redux";
import message from "../../API_Helpers/toast";

function Users(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const user = useSelector((state) => state.auth.login.user);
  const client = useSelector((state) => state.auth.login.client);
  const [purchasedProductsList, setPurchasedProductsList] = useState([]);
  const [uomsList, setUomsList] = useState([]);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch({ pageSize: 10, page: 0 });
    getPurchasedProductsList();
    getUomsList();
  }, []);
  const getPurchasedProductsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "purchasedProductsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setPurchasedProductsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const getUomsList = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "uomsList",
      data: {
        clientId: client.clientId,
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
      },
    };
    getList(payload).then((res) => {
      message(res);

      setUomsList(
        res.data.map((i) => {
          return { value: i.id, label: i.name };
        })
      );
    });
  };
  const refundInvoice = (lines) => {
    let data = {
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      invoiceId: props.invoice,
      refundLines: lines,
    };
    let payload = {
      data: data,
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      apiname: "refundPurchaseInvoice",
    };
    create(payload).then((res) => {
      message(res);
      props.getInvoice()
    });
  };
  const fetch = ({ pageSize, page, sorted, filtered }) => {
    setLoading(false);
    let payload = {
      clientId: client.clientId,
      size: pageSize,
      page: page,
      lang: localStorage.getItem("lang") ? localStorage.getItem("lang") : "EN",
      invoice: props.invoice,
    };
    if (sorted && sorted.length > 0) {
      payload.sortColumn = sorted[0].id;
      if (sorted[0].desc) {
        payload.sortOrder = "DESC";
      } else {
        payload.sortOrder = "ASC";
      }
    }
    if (filtered && filtered.length > 0) {
      for (let index = 0; index < filtered.length; index++) {
        const element = filtered[index];
        if (element.id == "product") {
          payload.product = element.value;
        }
        if (element.id == "uom") {
          payload.uom = element.value;
        }
        if (element.id == "lineno") {
          payload.lineno = element.value;
        }
        if (element.id == "netQty") {
          payload.netQty = element.value;
        }
        if (element.id == "qty") {
          payload.qty = element.value;
        }
        if (element.id == "taxableAmt") {
          payload.taxableAmt = element.value;
        }
        if (element.id == "totalGrossLine") {
          payload.totalGrossLine = element.value;
        }
        if (element.id == "totalNetLine") {
          payload.totalNetLine = element.value;
        }
        if (element.id == "unitPrice") {
          payload.unitPrice = element.value;
        }
      }
    }
    payload.isFinalProduct = true;
    gridDataByClient({
      data: payload,
      apiname: "purchaseInvoiceLinesByInvoice",
      tokenType: user.tokenType,
      accessToken: user.accessToken,
    }).then((res) => {
      setPage(res.data.page);
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };
  const deleteHandler = (id) => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        lang: localStorage.getItem("lang")
          ? localStorage.getItem("lang")
          : "EN",
        id: id,
      },
      apiname: "deletePurchaseInvoiceLine",
    };
    deleteapi(payload).then((res) => {
      if (res.data.success) {
        fetch({ pageSize: 10, page: 0 });
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        {/* createmenuitem */}
        <CardTitle>Purchased Invoice Line</CardTitle>
        <Button.Ripple
          color="primary"
          type="submit"
          className="mr-1 mb-1"
          onClick={(e) => props.goToCreate()}
        >
          Create Purchased Invoice Line
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
                      onChange={(event) => onChange(event.target.value)}
                      value={filter ? filter.value : ""}
                    >
                      <option value="">Show All</option>
                      {purchasedProductsList.length > 0 &&
                        purchasedProductsList.map((i) => (
                          <option value={i.value}>{i.label}</option>
                        ))}
                    </select>
                  ),
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(
                          purchasedInvoiceLineUpdate({ ...row.original })
                        );
                        props.goToUpdate();
                      }}
                    >
                      {purchasedProductsList.length > 0 &&
                        purchasedProductsList.filter(
                          (i) => i.value == row.original.product
                        ).length > 0 &&
                        purchasedProductsList.filter(
                          (i) => i.value == row.original.product
                        )[0].label}
                    </p>
                  ),
                },
                {
                  Header: "UOM",
                  accessor: "uom",
                  Filter: ({ filter, onChange }) => (
                    <select
                      onChange={(event) => onChange(event.target.value)}
                      value={filter ? filter.value : ""}
                    >
                      <option value="">Show All</option>
                      {uomsList.length > 0 &&
                        uomsList.map((i) => (
                          <option value={i.value}>{i.label}</option>
                        ))}
                    </select>
                  ),
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(
                          purchasedInvoiceLineUpdate({ ...row.original })
                        );
                        props.goToUpdate();
                      }}
                    >
                      {uomsList.length > 0 &&
                        uomsList.filter((i) => i.value == row.original.uom)
                          .length > 0 &&
                        uomsList.filter((i) => i.value == row.original.uom)[0]
                          .label}
                    </p>
                  ),
                },
                {
                  Header: "Line No.",
                  accessor: "lineno",
                },
                {
                  Header: "Net Quantity",
                  accessor: "netQty",
                },
                {
                  Header: "Quantity",
                  accessor: "qty",
                },
                {
                  Header: "Taxable Amount",
                  accessor: "taxableAmt",
                },
                {
                  Header: "Total Gross Amount",
                  accessor: "totalGrossLine",
                },
                {
                  Header: "Total Net Amount",
                  accessor: "totalNetLine",
                },
                {
                  Header: "Unit Price",
                  accessor: "unitPrice",
                },
                {
                  Header: "Delete",
                  filterable: false,
                  id: "delete",
                  accessor: (str) => "delete",

                  Cell: (row) => (
                    <Button.Ripple
                        disabled={props.invoice.status ==  "CO" ? false : true}
                      onClick={() => {
                        refundInvoice([
                          {
                            lineId: row.original.id,
                            refundQty: row.original.qty,
                          },
                        ]);
                      }}
                    >
                      Refund
                    </Button.Ripple>
                  ),
                },
                {
                  Header: "Delete",
                  filterable: false,
                  id: "delete",
                  accessor: (str) => "delete",

                  Cell: (row) => (
                    <Button.Ripple
                      onClick={() => {
                        deleteHandler(row.original.id);
                      }}
                    >
                      Delete
                    </Button.Ripple>
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
  );
}

export default Users;
