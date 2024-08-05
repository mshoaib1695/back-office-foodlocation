import React, { useState } from 'react'
import MovementLines from './MovementLines'
import CreateMovementLine from './CreateMovementLine'
import UpdateMovementLine from './UpdateMovementLine'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <MovementLines
                    goToCreate={() => setScreen("create")}
                    movementId={props.movementId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateMovementLine
                        goToSetup={() => setScreen("setup")}
                        movementId={props.movementId}

                    />
                        : screen == "update" && <UpdateMovementLine
                            goToSetup={() => setScreen("setup")}
                            movementId={props.movementId}
                        />
            }

        </>
    )
}
export default ProductOffer