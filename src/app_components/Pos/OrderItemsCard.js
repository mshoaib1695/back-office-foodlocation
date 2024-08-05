import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Row,
    Col,
    FormGroup,
    Label,
    CustomInput,
    Input
} from "reactstrap"
function OrderItemsCard() {
    return (
        <Card>
            <CardBody>
                <div id="orderListId">
                    <div>
                        <div>
                            <span id="orderstatus"></span>
                            <span>Double fire grill Chicken</span>
                            <span>1 X SAR 24</span>
                            <span>SAR 24</span>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    )
}
export default OrderItemsCard