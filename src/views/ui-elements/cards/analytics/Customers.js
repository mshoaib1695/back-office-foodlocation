import React, { useState } from 'react'
import {
    Card, CardBody,
    ListGroup,
    ListGroupItem
} from "reactstrap"
import Chart from "react-apexcharts"
const iState = {
    options: {
        chart: {
            dropShadow: {
                enabled: false,
                blur: 5,
                left: 1,
                top: 1,
                opacity: 0.2
            },
            toolbar: {
                show: false
            }
        },
        colors: [],
        fill: {
            type: "gradient",
            gradient: {
                gradientToColors: []
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: { show: false },
        stroke: {
            width: 5
        },
        labels: []
    },
    series: []
}

function DoughnutGraph(props) {
    const [statee, setStatee] = useState({ ...iState })
    const setBg = (i) => {
        if (i < 10) {
            return props.colors[i]
        } else {
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            return "#" + randomColor;
        }
    }
    React.useEffect(() => {
        if (props?.data?.length > 0 && statee) {
            let tempState = statee
            let data = [...props.data]
            tempState.options.colors = data.map((c, i) => c[i] = setBg(i))
            tempState.options.labels = data.map((c, i) => c[i] = c.userName)
            tempState.series = data.map((c, i) => c[i] = c.totalOrders)
            tempState.options.fill.gradient.gradientToColors = [...tempState.options.colors]
            setStatee(tempState)
       
        }
    }, [props.data])


    return (
        <Card>
            <CardBody>
                <h5 className="text-bold-600 mt-1 mb-25">{"Total Orders By Cashier"}</h5>
                {statee.series.length > 0 && <Chart
                    options={statee.options}
                    series={statee.series}
                    type="pie"
                    height={290} />}
            </CardBody>
            {statee.series.length > 0 && statee.options.labels.length > 0 &&
                statee.series.map((item, i) => (
                    <ListGroup flush>
                        <ListGroupItem className="d-flex justify-content-between">
                            <div className="item-info">
                                <div
                                    style={{
                                        background: `${statee.options.colors[i]}`,
                                        height: "10px",
                                        width: "10px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        margin: "0 5px"
                                    }}
                                />
                                <span className="text-bold-600">{statee.options.labels[i]}</span>
                            </div>
                            <div className="product-result">
                                <span>{item}</span>
                            </div>
                        </ListGroupItem>

                    </ListGroup>

                ))
            }
        </Card>
    )
}
export default DoughnutGraph