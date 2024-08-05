import React from "react"
import {
  Collapse,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
} from "reactstrap"
import classnames from "classnames"
import { ChevronDown } from "react-feather"
import PurchasedInvoiceLines from '../PurchasedInvoiceLine/index'


class Accordion extends React.Component {
  state = {
    activeTab: "1",
    collapseID: "",
    status: "Closed"
  }

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab })
    }
  }

  toggleCollapse = collapseID => {
    this.setState(prevState => ({
      collapseID: prevState.collapseID !== collapseID ? collapseID : ""
    }))
  }
  onEntered = id => {
    if (id === this.state.collapseID) this.setState({ status: "Opened" })
  }
  onEntering = id => {
    if (id === this.state.collapseID) this.setState({ status: "Opening..." })
  }

  onExited = id => {
    if (id === this.state.collapseID) this.setState({ status: "Closed" })
  }

  onExiting = id => {
    if (id === this.state.collapseID) this.setState({ status: "Closing..." })
  }

  render() {
    const collapseItems = [
      {
        id: 1,
        title: "Purchased Invoice Line",
        content: [<PurchasedInvoiceLines invoice={this.props.invoice} />]
      },
    ]

    const accordionItems = collapseItems.map(collapseItem => {
      return (
        <Card
          key={collapseItem.id}
          className={classnames({
            "collapse-collapsed":
              this.state.status === "Closed" &&
              this.state.collapseID === collapseItem.id,
            "collapse-shown":
              this.state.status === "Opened" &&
              this.state.collapseID === collapseItem.id,
            closing:
              this.state.status === "Closing..." &&
              this.state.collapseID === collapseItem.id,
            opening:
              this.state.status === "Opening..." &&
              this.state.collapseID === collapseItem.id
          })}
        >
          <CardHeader
            onClick={() => this.toggleCollapse(collapseItem.id)}
          >
            <CardTitle className="lead collapse-title collapsed">
              {collapseItem.title}
            </CardTitle>
            <ChevronDown size={15} className="collapse-icon" />
          </CardHeader>
          <Collapse
            isOpen={collapseItem.id === this.state.collapseID}
            onEntering={() => this.onEntering(collapseItem.id)}
            onEntered={() => this.onEntered(collapseItem.id)}
            onExiting={() => this.onExiting(collapseItem.id)}
            onExited={() => this.onExited(collapseItem.id)}
          >
            <CardBody >{collapseItem.content}</CardBody>
          </Collapse>
        </Card>
      )
    })
    return (
      <React.Fragment>
        <Card>
          <CardBody>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="vx-collapse collapse-bordered accordion-shadow">
                  {accordionItems}
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </React.Fragment>
    )
  }
}
export default Accordion
