import React, { useState } from 'react'
import BranchFloors from './BranchFloors'
import CreateBranchFloor from './CreateBranchFloor'
import UpdateBranchFloor from './UpdateBranchFloor'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <BranchFloors
                    goToCreate={() => setScreen("create")}
                    branchId={props.branchId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateBranchFloor
                        goToSetup={() => setScreen("setup")}
                        branchId={props.branchId}

                    />
                        : screen == "update" && <UpdateBranchFloor
                            goToSetup={() => setScreen("setup")}
                            branchId={props.branchId}
                        />
            }

        </>
    )
}
export default ProductOffer