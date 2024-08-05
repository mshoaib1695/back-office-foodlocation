import React, { useState } from 'react'
import ProductIngredients from './ProductIngredients'
import UpdateProductIngredient from './UpdateProductIngredient'
import CreateProductIngredient from './CreateProductIngredient'

function ProductIngredient(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductIngredients
                    goToCreate={() => setScreen("create")}
                    menuId={props.menuId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductIngredient
                        goToSetup={() => setScreen("setup")}
                        menuId={props.menuId}

                    />
                        : screen == "update" && <UpdateProductIngredient
                            goToSetup={() => setScreen("setup")}
                            menuId={props.menuId}
                        />
            }

        </>
    )
}
export default ProductIngredient