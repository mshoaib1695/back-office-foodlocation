import React, { useState } from 'react'
import ComboOptions from './ComboOptions'
import CreateComboOption from './CreateComboOption'
import UpdateComboOptions from './UpdateComboOptions'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <ComboOptions
                    goToCreate={() => setScreen("create")}
                    comboId={props.comboId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateComboOption
                        goToSetup={() => setScreen("setup")}
                        comboId={props.comboId}

                    />
                        : screen == "update" && <UpdateComboOptions
                            goToSetup={() => setScreen("setup")}
                            comboId={props.comboId}
                        />
            }

        </>
    )
}
export default ProductOffer