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
      colors: [this.props.primary, this.props.primaryLight, this.props.warning],
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: [
            this.props.primaryLight,
            this.props.danger,
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
      labels: ["Total Tax", "Total Purchase Tax", "Total Sales Tax"]
    },
    series: []
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ series: [
      nextProps.data.totalNetTax ? nextProps.data.totalNetTax : 0, 
      nextProps.data.totalPurchaseTax ? nextProps.data.totalPurchaseTax : 0,  
      nextProps.data.totalSalesTax ? nextProps.data.totalSalesTax : 0
    ] })
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tax Details</CardTitle>
          {/* <UncontrolledDropdown>
            <DropdownToggle tag="small" className="text-bold-500 cursor-pointer">
              Last 7 days <ChevronDown size={10} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Last 28 days</DropdownItem>
              <DropdownItem>Last Month</DropdownItem>
              <DropdownItem>Last Year</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </CardHeader>
        <CardBody className="pt-0">
          {this.state.series.length > 0 && <Chart
            options={this.state.options}
            series={this.state.series}
            type="pie"
            height={290} />}
        </CardBody>
        <ListGroup flush>
          <ListGroupItem className="d-flex justify-content-between">
            <div className="item-info">
              <div
                className="bg-primary"
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  display: "inline-block",
                  margin: "0 5px"
                }}
              />
              <span className="text-bold-600">Total Tax</span>
            </div>
            <div className="product-result">
              <span>{this.props.data.totalNetTax ? this.props.data.totalNetTax : 0}</span>
            </div>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between">
            <div className="item-info">
              <div
                className="bg-danger"
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  display: "inline-block",
                  margin: "0 5px"
                }}
              />
              <span className="text-bold-600">Total Purchase Tax</span>
            </div>
            <div className="product-result">
              <span>{this.props.data.totalPurchaseTax  ? this.props.data.totalPurchaseTax : 0}</span>
            </div>
          </ListGroupItem>
          <ListGroupItem className="d-flex justify-content-between">
            <div className="item-info">
              <div
                className="bg-warning"
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  display: "inline-block",
                  margin: "0 5px"
                }}
              />
              <span className="text-bold-600">Total Sales Tax</span>
            </div>
            <div className="product-result">
              <span>{this.props.data.totalSalesTax ? this.props.data.totalSalesTax : 0}</span>
            </div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    )
  }
}
export default Productorders
