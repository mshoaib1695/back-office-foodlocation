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
import ProductAdditionals from '../ProductAdditionals/index'
import ProductIngredients from '../ProductIngredients/index'
import ProductOffers from '../ProductOffers/index'
import ProductPrice from '../ProductPrice/index'
import ProductGroupItems from '../ProductGroupItems/index'

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
        title: "Product Price",
        content: [<ProductPrice menuId={this.props.menuId} />]
      },
      {
        id: 2,
        title: "Product Ingredients",
        content: [<ProductIngredients menuId={this.props.menuId} />]

      },
      {
        id: 3,
        title: "Product Additionals",
        content: [<ProductAdditionals menuId={this.props.menuId} />]
      },
      {
        id: 4,
        title: "Product Offers",
        content: [<ProductOffers menuId={this.props.menuId} />]
      },
      {
        id: 5,
        title: "Product Group Items",
        content: [<ProductGroupItems menuId={this.props.menuId} />]
      }
    ]

    const accordionItems = collapseItems.map(collapseItem => {
      return (
        (
          !this.props.isGroupProduct && collapseItem.id == 5) ? "" :
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
