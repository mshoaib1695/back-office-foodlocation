import React, { useState } from 'react'
import ProductProductAdditional from './ProductProductAdditional'
import UpdateProductAdditional from './UpdateProductAdditional'
import CreateProductAdditional from './CreateProductAdditional'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductProductAdditional
                    goToCreate={() => setScreen("create")}
                    menuId={props.menuId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductAdditional
                        goToSetup={() => setScreen("setup")}
                        menuId={props.menuId}

                    />
                        : screen == "update" && <UpdateProductAdditional
                            goToSetup={() => setScreen("setup")}
                            menuId={props.menuId}
                        />
            }

        </>
    )
}
export default ProductOffer