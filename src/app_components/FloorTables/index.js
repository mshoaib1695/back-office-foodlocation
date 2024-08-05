import React, { useState } from 'react'
import FloorTables from './FloorTables'
import CreateFloorTable from './CreateFloorTable'
import UpdateFloorTables from './UpdateFloorTables'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <FloorTables
                    goToCreate={() => setScreen("create")}
                    floorId={props.floorId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateFloorTable
                        goToSetup={() => setScreen("setup")}
                        floorId={props.floorId}

                    />
                        : screen == "update" && <UpdateFloorTables
                            goToSetup={() => setScreen("setup")}
                            floorId={props.floorId}
                        />
            }

        </>
    )
}
export default ProductOffer