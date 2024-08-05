import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap"
import Chart from "react-apexcharts"
import {
  Monitor,
  ArrowUp,
  Smartphone,
  Tablet,
  ArrowDown,
  ChevronDown
} from "react-feather"

class SessionByDevice extends React.Component {
  state = {
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: { show: false },
      comparedResult: [2, -3, 8],
      labels: ["Total Net Tax", "Total Purchase Tax", "Total Sales Tax"],
      stroke: { width: 0 },
      colors: [this.props.primary, this.props.warning, this.props.primaryLight],
      fill: {
        type: "gradient",
        gradient: {
          gradientToColors: [
            this.props.primaryLight,
            this.props.warningLight,
            this.props.dangerLight
          ]
        }
      }
    },
    series: []
  }
  componentWillReceiveProps(nextProps) {
    this.setState(
      {
         series: [
           nextProps.totalTaxDetails.totalNetTax ? nextProps.totalTaxDetails.totalNetTax : 0, 
           nextProps.totalTaxDetails.totalPurchaseTax ? nextProps.totalTaxDetails.totalPurchaseTax : 0, 
           nextProps.totalTaxDetails.totalSalesTax ?  nextProps.totalTaxDetails.totalSalesTax : 0
          ] 
        })
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
          <Chart
            options={this.state.options}
            series={this.state.series}
            type="donut"
            height={290}
          />
          <div className="chart-info d-flex justify-content-between mb-1 mt-2">
            <div className="series-info d-flex align-items-center">
              {/* <Monitor size="18" className="primary" /> */}
              <div style={{width: "10px", height: "10px", background: this.props.primary}}></div>
              <span className="text-bold-600 mx-50">Total Net Tax</span>
              <span className="align-middle"> {this.props.totalTaxDetails.totalNetTax ? this.props.totalTaxDetails.totalNetTax : 0}</span>
            </div>
            {/* <div className="series-result">
              <span className="align-middle">2%</span>
              <ArrowUp size="15" className="success" />
            </div> */}
          </div>
          <div className="chart-info d-flex justify-content-between mb-1 mt-1">
            <div className="series-info d-flex align-items-center">
              {/* <Smartphone size="18" className="warning" /> */}
              <div style={{width: "10px", height: "10px", background: this.props.warning}}></div>
              <span className="text-bold-600 mx-50">Total Purchase Tax</span>
              <span className="align-middle"> {this.props.totalTaxDetails.totalPurchaseTax}</span>
            </div>
            {/* <div className="series-result">
              <span className="align-middle">8%</span>
              <ArrowUp size="15" className="success" />
            </div> */}
          </div>
          <div className="chart-info d-flex justify-content-between mt-1">
            <div className="series-info d-flex align-items-center">
              {/* <Tablet size="18" className="danger" /> */}
              <div style={{width: "10px", height: "10px", background: this.props.primaryLight}}></div>
              <span className="text-bold-600 mx-50">Total Sales Tax</span>
              <span className="align-middle"> {this.props.totalTaxDetails.totalSalesTax}</span>
            </div>
            {/* <div className="series-result">
              <span className="align-middle">-5%</span>
              <ArrowDown size="15" className="danger" />
            </div> */}
          </div>
        </CardBody>
      </Card>
    )
  }
}
export default SessionByDevice
