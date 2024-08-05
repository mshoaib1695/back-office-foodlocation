import React, { useState } from 'react'
import ProductGroupItems from './ProductGroupItems'
import UpdateProductGroupItem from './UpdateProductGroupItem'
import CreateProductGroupItem from './CreateProductGroupItem'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductGroupItems
                    goToCreate={() => setScreen("create")}
                    menuId={props.menuId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductGroupItem
                        goToSetup={() => setScreen("setup")}
                        menuId={props.menuId}

                    />
                        : screen == "update" && <UpdateProductGroupItem
                            goToSetup={() => setScreen("setup")}
                            menuId={props.menuId}
                        />
            }

        </>
    )
}
export default ProductOffer