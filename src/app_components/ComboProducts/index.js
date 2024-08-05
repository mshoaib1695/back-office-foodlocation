import React, { useState } from 'react'
import ComboProducts from './ComboProducts'
import CreateComboProduct from './CreateComboProduct'
import UpdateComboProduct from './UpdateComboProduct'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ComboProducts
                    goToCreate={() => setScreen("create")}
                    comboOptionId={props.comboOptionId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateComboProduct
                        goToSetup={() => setScreen("setup")}
                        comboOptionId={props.comboOptionId}

                    />
                        : screen == "update" && <UpdateComboProduct
                            goToSetup={() => setScreen("setup")}
                            comboOptionId={props.comboOptionId}
                        />
            }

        </>
    )
}
export default ProductOffer