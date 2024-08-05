import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardBody, Button } from "reactstrap";
import {
  gridDataByClient,
  deleteapi,postWithPrams,
  parametersListByParaType,
} from "../../API_Helpers/api";
import ReactTable from "react-table";
import "react-table/react-table.css";
import "../../assets/scss/plugins/extensions/react-tables.scss";
import { history } from "../../history";
import { transferShow } from "../../redux/actions/updatescreens/role";
import { useDispatch } from "react-redux";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss";
import moment from "moment";
import message from "../../API_Helpers/toast";

function Vendors() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [countries, seCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const user = useSelector((state) => state.auth.login.user);
  const client = useSelector((state) => state.auth.login.client);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch({ pageSize: 10, page: 0 });
    getCountries();
    getCities();
  }, []);

  const getCountries = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        paraType: "COUNTRY",
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    parametersListByParaType(payload).then((res) => {
      message(res);

      seCountries(
        res.data.map((i) => {
          return { value: i.id, label: i.name, paramCode: i.paramCode };
        })
      );
    });
  };
  const getCities = () => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        paraType: "CITY",
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
      },
    };
    parametersListByParaType(payload).then((res) => {
      message(res);

      setCities(
        res.data.map((i) => {
          return { value: i.id, label: i.name, paramCode: i.paramCode };
        })
      );
    });
  };
  const deleteHandler = (id) => {
    let payload = {
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: {
        lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
        transferId: id,
      },
      apiname: "deleteTransfer",
    };
    postWithPrams(payload).then((res) => {
      message(res);

      if (res.data.success) {
        fetch({ pageSize: 10, page: 0 });
      }
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
    if (filtered && filtered.length > 0) {
      for (let index = 0; index < filtered.length; index++) {
        const element = filtered[index];
        if (element.id == "city") {
          payload.city = element.value;
        }
        if (element.id == "senderName") {
          payload.senderName = element.value;
        }
        if (element.id == "senderNameEn") {
          payload.senderNameEn = element.value;
        }
        if (element.id == "receiverName") {
          payload.receiverName = element.value;
        }
        if (element.id == "receiverNameEn") {
          payload.receiverNameEn = element.value;
        }
        if (element.id == "transferDate") {
          payload.transferDate = element.value;
        }
        if (element.id == "details") {
          payload.details = element.value;
        }
        if (element.id == "amount") {
          payload.amount = element.value;
        }
      }
    }
    gridDataByClient({
      tokenType: user.tokenType,
      accessToken: user.accessToken,
      data: payload,
      apiname: "transfersByClient",
    }).then((res) => {
      setPage(res.data.page);
      setData(res.data.content);
      setTotalPages(res.data.totalPages);
    });
  };
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Setup</CardTitle>
        <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                    onClick={e => history.push("/dashboard/setup-transfer-account")}
                >
                    Create Transfer
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
                  Header: "Sender Name Arabic",
                  accessor: "senderName",
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(transferShow({ ...row.original }));
                        history.push("/dashboard/update-transfer-account");
                      }}
                    >
                      {row.original.senderName}
                    </p>
                  ),
                },
                {
                  Header: "Sender Name ",
                  accessor: "senderNameEn",
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(transferShow({ ...row.original }));
                        history.push("/dashboard/update-transfer-account");
                      }}
                    >
                      {row.original.senderNameEn}
                    </p>
                  ),
                },
                {
                  Header: "Receiver Name",
                  accessor: "reciverNameEn",
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(transferShow({ ...row.original }));
                        history.push("/dashboard/update-transfer-account");
                      }}
                    >
                      {row.original.reciverNameEn}
                    </p>
                  ),
                },
                {
                  Header: "Receiver Name Ar",
                  accessor: "reciverName",
                  Cell: (row) => (
                    <p
                      className="gridBtn"
                      onClick={() => {
                        dispatch(transferShow({ ...row.original }));
                        history.push("/dashboard/update-transfer-account");
                      }}
                    >
                      {row.original.reciverName}
                    </p>
                  ),
                },
                {
                  Header: "Transfer Amount",
                  accessor: "transferAmount",
                },
                {
                  Header: "details",
                  accessor: "details",
                },
                {
                  Header: "Transfer Date",
                  accessor: "transferDate",
                  Filter: ({ filter, onChange }) => (
                    <Flatpickr
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        dateFormat: "YYYY-MM-DD",
                      }}
                      className="form-control"
                      value={filter ? filter.value : null}
                      onChange={(date) =>
                        onChange(moment(date[0]).format("YYYY-MM-DD"))
                      }
                    />
                  ),
                  Cell: (row) => (
                    <p className="gridBtn">      
                                  {
                        row.original.transferDate}
                      
                    </p>
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

export default Vendors;
