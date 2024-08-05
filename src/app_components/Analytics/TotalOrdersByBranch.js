import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import { ChevronDown } from "react-feather"
import Chart from "react-apexcharts"

class Productorders extends React.Component {
  state = {
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
      colors: [this.props.primary, this.props.warning, this.props.danger],
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: [
            this.props.primaryLight,
            this.props.warningLight,
            this.props.dangerLight
          ]
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      stroke: {
        width: 5
      },
      labels: ["Orders", "Sales"]
    },
    series: []
  }

  componentWillReceiveProps(nextProps) {
    
      if (nextProps?.data?.length) {
        let tempState = this.state
        let data = [...nextProps.data]
        tempState.options.colors = data.map((c, i) => c[i] = this.setBg(i))
        tempState.options.labels = data.map((c, i) => c[i] = c.userName)
        tempState.series = data.map((c, i) => c[i] = c.totalOrders)
        tempState.options.fill.gradient.gradientToColors = [...tempState.options.colors]
        this.setState(tempState)
    }
    
  }
  setBg = (i) => {
    if (i < 10) {
        return this.props.colors[i]
    } else {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return "#" + randomColor;
    }
}

  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Total Orders By Branch</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          {this.state.series.length > 0 && <Chart
            options={this.state.options}
            series={this.state.series}
            type="pie"
            height={290} />}
        </CardBody>
        {this.state.series.length > 0 && this.state.options.labels.length > 0 &&
                this.state.series.map((item, i) => (
                    <ListGroup flush>
                        <ListGroupItem className="d-flex justify-content-between">
                            <div className="item-info">
                                <div
                                    style={{
                                        background: `${this.state.options.colors[i]}`,
                                        height: "10px",
                                        width: "10px",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        margin: "0 5px"
                                    }}
                                />
                                <span className="text-bold-600">{this.state.options.labels[i]}</span>
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
}
export default Productorders
