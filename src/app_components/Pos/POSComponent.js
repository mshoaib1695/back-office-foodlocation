import React from 'react'
import OrderItemsCard from './OrderItemsCard'
import CategoriesCard from './CategoriesCard'
import PosTopBar from './PosTopBar'
import ProducstsCard from './ProducstsCard'
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
import './style.css'
import PosPriceBottomDiv from './PosPriceBottomDiv'

function Pos() {
    return (
        <div id="pos-main-div">
            <Row>
                <Col md={12} sm={12}>
                    <PosTopBar />
                </Col>
            </Row>
            <Row>
                <Col md={8} sm={12}>
                    <Row>
                        <Col md={12} sm={12}>
                            <ProducstsCard />
                        </Col>
                        <Col md={12} sm={12}>
                            <CategoriesCard />
                        </Col>
                    </Row>
                </Col>
                <Col span={4}>
                    <OrderItemsCard />
                    <PosPriceBottomDiv />
                </Col>
            </Row>
        </div>
    )
}
export default Pos