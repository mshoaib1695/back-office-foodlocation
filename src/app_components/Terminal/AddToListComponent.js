import React, { useEffect, useState } from 'react'
import ReactSelect from "react-select"
import { Row, Col, Button, Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import ReactTable from "react-table"
import "react-table/react-table.css"
import "../../assets/scss/plugins/extensions/react-tables.scss"
function AddToListComponent(props) {
    const [currentValue, setCurrentValue] = useState(null)
    const [loading, setLoading] = useState(false)
    const deleteHandler = (value) => {
        props.onRemoveToList(value)
    }
    return (
        <>
            <Row>
                <Col md="3" sm="6">
                    <ReactSelect
                        isMulti={false}
                        options={props.list}
                        value={(props.list && currentValue) ? props.list.find(option => option.value === currentValue) : ''}
                        onChange={(option) => {
                            setCurrentValue(option.value)
                        }}

                    />
                </Col>
                <Col md="3" sm="6">
                    <Button.Ripple
                        color="primary"
                        type="submit"
                        className="mr-1 mb-1"
                        onClick={() => {
                            props.onAddToList(currentValue)
                            setCurrentValue(null)
                        }}
                    >Add</Button.Ripple>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <ReactTable
                        data={props.data}                 
                        columns={[
                            {
                                columns: [                                 
                                    {
                                        Header: props.fieldTitle,
                                        accessor: "label",
                                    },
                                    {
                                        Header: "Delete",
                                        filterable: false,
                                        id: 'delete',
                                        accessor: str => "delete",
                                        Cell: (row) => (
                                            <Button.Ripple
                                                onClick={() => {
                                                    deleteHandler(row.original.value)
                                                }}>
                                                Delete
                                            </Button.Ripple>
                                        )
                                    }

                                ]
                            },
                        ]}
                        defaultPageSize={5}
                        className="-striped -highlight"
                        loading={loading}
                        showPagination={true}
                        showPaginationTop={false}
                    />
                </CardBody>
            </Card>
        </>
    )
}

export default AddToListComponent