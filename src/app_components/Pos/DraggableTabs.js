import * as React from 'React';
import * as ReactDOM from 'react-dom';
import { DragDropContextProvider, DropTarget } from 'react-dnd/core';
import ReactDnDHTML5Backend from 'react-dnd-html5-backend';
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink
  } from "reactstrap"
  import {HTML5Backend} from 'react-dnd-html5-backend';

function DraggableTabs (props){
    <DragDropContextProvider backend={HTML5Backend}>
    <TabContent renderTabBar={this.renderTabBar} {...props}>
      
    </TabContent>
  </DragDropContextProvider>
}
export default DraggableTabs