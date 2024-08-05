import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import Chart from "react-apexcharts"
import { Settings } from "react-feather"

class Revenue extends React.Component {
  state = {
    loaded: false,
    series: [{
      name: "Sales",
      data: []
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      colors: [this.props.primary, this.props.danger],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return "SAR " + val;
        },
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Sales by Date',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: [],
      }
    },
  }

  componentWillReceiveProps(nextProps) {
    let tempState = this.state
    if (nextProps?.currentMonthDaywiseSale?.length) {
      tempState.options.xaxis.categories = nextProps.currentMonthDaywiseSale.map((item, i) => item[i] = item.saleDay)
      tempState.series[0].data = nextProps.currentMonthDaywiseSale.map((item, i) => item[i] = item.totalSales)
      tempState.loaded = true
    }
    this.setState(tempState)
  }
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales</CardTitle>
          <Settings size={20} className="cursor-pointer text-muted" />
        </CardHeader>
        <CardBody>
          <div className="d-flex justify-content-start mb-1">
          </div>
          {this.state.loaded ? <Chart
            options={this.state.options}
            series={this.state.series}
            type="line"
            height={260}
          /> : <></>}
        </CardBody>
      </Card>
    )
  }
}
export default Revenue
