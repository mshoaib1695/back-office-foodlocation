import React, { useEffect, useState } from 'react'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Row,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Col,
    FormGroup,
    Label,
} from "reactstrap"
import * as Yup from "yup"
import { useSelector } from 'react-redux'
import { history } from '../../history'
import { create, } from '../../API_Helpers/api'
import "flatpickr/dist/themes/light.css";
import "../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import message from '../../API_Helpers/toast'
import { useLocation } from "react-router-dom";
import { parametersListByParaType, getList } from '../../API_Helpers/api'
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
import ReactSelect from "react-select"
import MyMap from './MyMap'


function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function CreateProduct() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const [branchsList, setBranchsList] = useState([])
    const [orderStatus, setOrderStatus] = useState([])
    const [loading, setLoading] = useState(true)
    const [uomsList, setUomsList] = useState([])
    const [productsList, setProductsList] = useState([])
    const [deliveryPersonsList, setDeliveryPersonsList] = useState([])
    const [deliverPerson, setDeliverPerson] = useState('')

    const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false)
    const [warningModal, setWarningModal] = useState(false)

    const [paymentMethodsList, setPayMethodsList] = useState([])
    const [object, setObject] = useState({
        "id": "",
        "name": "",
        "phoneNo": "",
        "address": "",
        "orderDate": "",
        "payMethod": "",
        "documentNo": "",
        "status": "",
        "totalNet": 0,
        "order": null,
        "lines": [],
        "isView": false,
        "branch": "",
        "isLocal": false,
        "flrTable": null,
        "email": null,
        "type": "",
        "deliveryPerson": null
    })
    let query = useQuery();
    let order_id = query.get("order_id")
    let isDeliveryPerson = query.get("isDeliveryPerson")

    useEffect(() => {
        if (order_id == null || order_id == undefined || order_id == '') {
            history.push('/')
            return
        }
        getOrderDetails()
        getBranchsList()
        getOrderStatus()
        getDeliveryPersonsList()
        getUomsList()
        getPayMethodsList()
        getProductsList()
    }, [order_id])

    const getOrderDetails = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "onlineOrderByID",
            data: {
                id: order_id,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                if (res.data.success) {
                    setObject(res.data.object)
                    setDeliverPerson(res.data.object.deliveryPerson)
                    setLoading(false)
                }
            })
    }
    const getBranchsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "branchsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                setBranchsList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }

    const getDeliveryPersonsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "deliveryPersonsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                setDeliveryPersonsList(res.data.map(i => { return { value: i.id, label: i.name } }))
            })
    }

    const getPayMethodsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "paymentMethodsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                setPayMethodsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }

    const getOrderStatus = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            data: {
                paraType: "ONLINE_ORDER_STATUS",
                lang: "EN"
            },
        }
        parametersListByParaType(payload)
            .then(res => {
                setOrderStatus(res.data.map(i => { return { value: i.paramCode, label: i.name, id: i.id } }))
            })
    }

    const getUomsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "uomsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setUomsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }

    const getProductsList = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "productsList",
            data: {
                clientId: client.clientId,
                lang: "EN",
            },
        }
        getList(payload)
            .then(res => {
                message(res)

                setProductsList(res.data.map(i => { return { value: i.id, label: i.name } }))

            })
    }

    const submitHandler = (values) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: `assignOnlineOrderToDeliveryPerson?onlineOrderId=${object.id}&deliveryPersonId=${deliverPerson}`
        }
        create(payload)
            .then(res => {
                if (res.data.success) {
                    getOrderDetails()
                    setIsDeliverModalOpen(false)
                } else {
                    message(res)
                }
            })
    }

    const acceptOnlineOrderHandler = (values) => {
        let payload = {
            data: {
                lang: "EN",
                id: values.id,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "acceptOnlineOrder"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    getOrderDetails()
                }
            })
    }
    const rejectOnlineOrderHandler = (values) => {
        let payload = {
            data: {
                lang: "EN",
                id: values.id,
            },
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "rejectOnlineOrder"
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    getOrderDetails()
                }
            })
    }
    const orderDelivered = (values) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "completeOnlineOrder?orderId=" + values.id
        }
        create(payload)
            .then(res => {
                message(res)
                if (res.data.success) {
                    getOrderDetails()
                    setWarningModal(false)
                }
            })
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div style={{
                        "display": "flex",
                        "justifyContent": "space-between",
                        "width": "100%"
                    }}>
                        <CardTitle>Order Details</CardTitle>
                        {object.status == 'D' && isDeliveryPerson == 'true' &&
                            <div>
                                <Button color="primary" style={{ marginRight: '5px' }} onClick={() => acceptOnlineOrderHandler(object)}>Accept</Button>
                                <Button color="danger" style={{ marginRight: '5px' }} onClick={() => rejectOnlineOrderHandler(object)}>Reject</Button>
                            </div>
                        }
                        {
                            isDeliveryPerson == 'true' ?
                                <Button color="primary" onClick={() => history.push('/dashboard/delivery-orders')}>Back</Button>
                                :
                                <Button color="primary" onClick={() => history.push('/dashboard/orders-by-deliver-person')}>Back</Button>
                        }
                    </div>
                </CardHeader>
                <CardBody>
                    {
                        object.status == 'A' && isDeliveryPerson == 'true' &&
                        <div>
                            <Button color="primary" onClick={() => setIsDeliverModalOpen(prevVal => !prevVal)}>
                                {
                                    object.deliveryPerson ?
                                        "Change Deliver Person" : "Assign Deliver Person"
                                }
                            </Button>
                        </div>
                    }
                    {
                        object.status == 'A' && isDeliveryPerson == 'false' &&
                        <div>
                            <Button color="primary" onClick={() => setWarningModal(prevVal => !prevVal)}>
                                Mark Order as Completed / Deliverd
                            </Button>
                        </div>
                    }
                    <div>
                        <hr />
                        <Row style={{ margin: '20px 0' }}>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Date</p>
                                <p style={{ fontSize: '14px' }}>{object.orderDate}</p>
                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Status</p>
                                <p style={{ fontSize: '14px' }}>{orderStatus.find(i => i.value == object.status)?.label}</p>

                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Delivery Person</p>
                                <p style={{ fontSize: '14px' }}>{deliveryPersonsList.find(i => i.value == object.deliveryPerson)?.label}</p>

                            </Col>
                        </Row>
                        <hr />
                        <Row style={{ margin: '20px 0' }}>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Customer Name</p>
                                <p style={{ fontSize: '14px' }}>{object.name}</p>
                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Customer Address</p>
                                <p style={{ fontSize: '14px' }}>{object.address}</p>
                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Customer Phone Number</p>
                                <p style={{ fontSize: '14px' }}>{object.phoneNo}</p>
                            </Col>
                        </Row>
                        <hr />
                        <Row style={{ margin: '20px 0' }}>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Customer Email</p>
                                <p style={{ fontSize: '14px' }}>{object.email}</p>
                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Payment Method</p>
                                <p style={{ fontSize: '14px' }}>{paymentMethodsList.find(i => i.value == object.payMethod)?.label}</p>

                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Total Amount</p>
                                <p style={{ fontSize: '14px' }}>{object.totalNet}</p>
                            </Col>
                            <Col md="4" sm="12">
                                <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Branch</p>
                                {console.log(branchsList.find(i => i.value == object.branch)?.label)}
                                <p style={{ fontSize: '14px' }}>{branchsList.find(i => i.value == object.branch)?.label}</p>
                            </Col>
                        </Row>
                        <Row style={{ margin: '20px 0' }}>
                            <Col md="12" sm="12">
                                {
                                    object.lines && object.lines.length &&
                                    <>
                                        <h1>Order Lines</h1>
                                        <ReactTable
                                            data={object.lines}
                                            pages={(object.lines.length / 10)}
                                            filterable
                                            columns={[
                                                {
                                                    columns: [
                                                        {
                                                            Header: "Unit Price",
                                                            accessor: "unitPrice",
                                                            Cell: (row) => (
                                                                <p className="gridBtn">
                                                                    {row.original.unitPrice}
                                                                </p>
                                                            )
                                                        },
                                                        {
                                                            Header: "Quantity",
                                                            accessor: "qty",
                                                            Cell: (row) => (
                                                                <p className="gridBtn">
                                                                    {row.original.qty}
                                                                </p>
                                                            )
                                                        },
                                                        {
                                                            Header: "Product",
                                                            accessor: "product",
                                                            Filter: ({ filter, onChange }) => (
                                                                <select
                                                                    onChange={event => onChange(event.target.value)}
                                                                    value={filter ? filter.value : ""}>
                                                                    <option value="">Show All</option>
                                                                    {
                                                                        productsList.length > 0 && productsList.map(i => (
                                                                            <option value={i.value}>{i.label}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            ),
                                                            Cell: (row) => (
                                                                <p className="gridBtn">
                                                                    {productsList.length > 0 && productsList.filter(i => i.value == row.original.product).length > 0 &&
                                                                        productsList.filter(i => i.value == row.original.product)[0].label
                                                                    }
                                                                </p>
                                                            )
                                                        },
                                                        {
                                                            Header: "UOM",
                                                            accessor: "uom",
                                                            Filter: ({ filter, onChange }) => (
                                                                <select
                                                                    onChange={event => onChange(event.target.value)}
                                                                    value={filter ? filter.value : ""}>
                                                                    <option value="">Show All</option>
                                                                    {
                                                                        uomsList.length > 0 && uomsList.map(i => (
                                                                            <option value={i.value}>{i.label}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            ),
                                                            Cell: (row) => (
                                                                <p className="gridBtn">
                                                                    {uomsList.length > 0 && uomsList.filter(i => i.value == row.original.uom).length > 0 &&
                                                                        uomsList.filter(i => i.value == row.original.uom)[0].label
                                                                    }
                                                                </p>
                                                            )
                                                        },
                                                    ]
                                                },
                                            ]}
                                            defaultPageSize={4}
                                            className="-striped -highlight"
                                            pageSizeOptions={[5, 10, 20, 25, 50]}
                                            loading={loading}
                                            showPagination={true}
                                            showPaginationTop={false}
                                        />
                                    </>
                                }
                            </Col>
                        </Row>
                        {
                            isDeliveryPerson != 'true' &&
                            <Row style={{ margin: '20px 0' }}>
                                <Col md="12" sm="12">
                                    <MyMap
                                        destination={{
                                            lat: object.latitude,
                                            lng: object.longitude
                                        }}
                                        address={object.address}
                                    />
                                </Col>
                            </Row>
                        }
                    </div>
                </CardBody>
            </Card >
            <Modal isOpen={isDeliverModalOpen} toggle={() => setIsDeliverModalOpen(false)}>
                <ModalHeader toggle={() => setIsDeliverModalOpen(false)}>Assign Delivery Person</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="12" sm="12">
                            <FormGroup className="form-label-group">
                                <ReactSelect
                                    isMulti={false}
                                    options={deliveryPersonsList}
                                    value={deliveryPersonsList ? deliveryPersonsList.find(option => option.value === deliverPerson) : ''}
                                    onChange={(option) => {
                                        setDeliverPerson(option.value)
                                    }}

                                />
                                <Label for="fAccount">Select Delivery Person</Label></FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => submitHandler()}>
                        Submit
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={warningModal} toggle={() => setWarningModal(false)}>
                <ModalHeader toggle={() => setIsDeliverModalOpen(false)}>Confirmation</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="12" sm="12">
                            <p>Are you sure you want to mark your order as completed or delivered ?</p>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => orderDelivered(object)}>
                        Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}


export default CreateProduct