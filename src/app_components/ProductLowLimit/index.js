import React, { useState } from 'react'
import ProductLowLimits from './ProductLowLimits'
import UpdateProductLowLimit from './UpdateProductLowLimit'
import CreateProductLowLimit from './CreateProductLowLimit'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ProductLowLimits
                    goToCreate={() => setScreen("create")}
                    rowMatId={props.rowMatId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateProductLowLimit
                        goToSetup={() => setScreen("setup")}
                        rowMatId={props.rowMatId}

                    />
                        : screen == "update" && <UpdateProductLowLimit
                            goToSetup={() => setScreen("setup")}
                            rowMatId={props.rowMatId}
                        />
            }

        </>
    )
}
export default ProductOffer