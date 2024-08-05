import React, { useState } from 'react'
import ProductProductOffers from './ProductProductOffers'
import UpdateProductOffers from './UpdateProductOffers'
import CreateProductOffer from './CreateProductOffer'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductProductOffers
                    goToCreate={() => setScreen("create")}
                    menuId={props.menuId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductOffer
                        goToSetup={() => setScreen("setup")}
                        menuId={props.menuId}

                    />
                        : screen == "update" && <UpdateProductOffers
                            goToSetup={() => setScreen("setup")}
                            menuId={props.menuId}
                        />
            }

        </>
    )
}
export default ProductOffer