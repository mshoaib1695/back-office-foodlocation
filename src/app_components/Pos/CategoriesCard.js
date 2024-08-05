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
import { getList } from '../../API_Helpers/api'
import { useDispatch, useSelector } from 'react-redux'
import Swiper from "react-id-swiper"
import { api_url as API_URL } from '../../assets/constants/api_url'
import "swiper/css/swiper.css"
import "../../assets/scss/plugins/extensions/swiper.scss"
import {getPosProductsByCategory} from '../../redux/actions/pos/pos'
import message from '../../API_Helpers/toast'

const params = {
    slidesPerView: 8,
    slidesPerColumn: 2,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,

    },
    // breakpoints: {
    //     1024: {
    //         slidesPerView: 8,
    //         spaceBetween: 40
    //     },
    //     768: {
    //         slidesPerView: 8,
    //         spaceBetween: 30
    //     },
    //     640: {
    //         slidesPerView: 8,
    //         spaceBetween: 20
    //     },
    //     320: {
    //         slidesPerView: 8,
    //         spaceBetween: 10
    //     }
    // }
}

function CategoriesCard() {
    const client = useSelector(state => state.auth.login.client)
    const user = useSelector(state => state.auth.login.user)
    const dispatch = useDispatch()
    const [categories, setCategories] = useState([])
    useEffect(() => {
        getCategories()
    }, [])
    const catCLickHandler = (id) => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            branch: client.branchId,
            id
        }
        dispatch(getPosProductsByCategory(payload))
    }
    const getCategories = () => {
        let payload = {
            tokenType: user.tokenType,
            accessToken: user.accessToken,
            apiname: "posCategoryListByTerminal",
            data: {
                posTerminalId: user.posTerminalId,
                lang: localStorage.getItem('lang') ? localStorage.getItem('lang') : "EN",
            },
        }
        getList(payload)
            .then(res => { message(res)

                setCategories(res.data)
            })
    }
    return (
        <Card id="categories-pos">
            <CardBody>
                {categories.length > 0 && <Swiper {...params}>
                    {
                        categories.map(item => {
                            return (
                                <div
                                    key={item.id}
                                    className="cat-div"
                                    onClick={() => catCLickHandler(item.id)}
                                >
                                    <img src={
                                        `${API_URL}getProductImage?clientName=
                                     ${client.name}&imageName=${item.imageName}&imageContent=${item.imageContent
                                        }`
                                    } alt="swiper 1" className="img-fluid" />
                                    <p className="cat-name">{item.name}</p>
                                </div>
                            )
                        })
                    }
                </Swiper>}
                {
                    categories.length == 0 && <p>No Category Found</p>
                }
            </CardBody>
        </Card>
    )
}
export default CategoriesCard