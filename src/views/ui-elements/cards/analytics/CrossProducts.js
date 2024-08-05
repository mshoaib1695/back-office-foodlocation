import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import Chart from "react-apexcharts"

class ClientRetention extends React.Component {
  state = {
    loaded: false,
    series: [{
      name: 'Sales',
      data: []
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      colors: [this.props.primary, this.props.danger],
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: [],
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return "SAR " + val;
          }
        }

      },
      title: {
        text: 'Products Sales',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    },
  }

  componentWillReceiveProps(nextProps) {
    let tempState = this.state
    if (nextProps?.topSalesProductofMonth?.length && nextProps?.topSalesProductofMonth?.length) {
      tempState.options.xaxis.categories = nextProps.topSalesProductofMonth.map((item, i) => item[i] = item.productName)
      let dataTemp = nextProps.topSalesProductofMonth.map((item, i) => item[i] = item.salePrice)
      tempState.series[0].data = dataTemp
      tempState.loaded = true
      this.setState(tempState)
    }
  }


  render() {

    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Sales By Amount</CardTitle>
        </CardHeader>
        <CardBody>
          {
            this.state.loaded ?
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                height={290}
                id="client-retention-chart"
              />
              : <></>
          }
        </CardBody>
      </Card>
    )
  }
}
export default ClientRetention
