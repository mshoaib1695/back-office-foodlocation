import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { api_url as API_URL } from '../../assets/constants/api_url'

function ProducstsCard() {
    const client = useSelector(state => state.auth.login.client)
    const products = useSelector(state => state.pos.posProducts)
    const [posProductsForMap, setPosProductsForMap] = useState([])
    useEffect(() => {
        if (products && products.length > 0) {
            setPosProductsForMap(products)
        }
    }, [products])
    return (
        <Card id='products-pos' 
            className={posProductsForMap.length > 0 ? "notemptyProductsLis" :  "emptyProductsLis"}>
            <CardBody>
                {posProductsForMap.length > 0 ?
                    <div id="product-flexbox">
                        {posProductsForMap.map((item, i) => (
                            <div key={i} className="product-single-card">
                                <img src={
                                     `${API_URL}getProductImage?clientName=
                                     ${client.name}&imageName=${item.imageName}&imageContent=${item.imageContent
                                        }`
                                }/>
                                <p>{item.name}</p>
                            </div>
                        ))
                        }
                    </div>
                    : <p>No Product Found</p>
                }
            </CardBody>
        </Card>
    )
}
export default ProducstsCard