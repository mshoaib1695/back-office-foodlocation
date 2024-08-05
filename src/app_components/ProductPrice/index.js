import React, { useState } from 'react'
import ProductPrices from './ProductPrices'
import UpdateProductPrice from './UpdateProductPrice'
import CreateProductPrice from './CreateProductPrice'

function ProductPrice(props) {

    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductPrices
                    goToCreate={() => setScreen("create")}
                    menuId={props.menuId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductPrice
                        goToSetup={() => setScreen("setup")}
                        menuId={props.menuId}

                    />
                        : screen == "update" && <UpdateProductPrice
                            goToSetup={() => setScreen("setup")}
                            menuId={props.menuId}
                        />
            }

        </>
    )
}
export default ProductPrice