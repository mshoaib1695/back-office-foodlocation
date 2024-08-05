import React, { useState } from 'react'
import BranchPaymentMethods from './BranchPaymentMethods'
import CreateBranchPaymentMethod from './CreateBranchPaymentMethod'
import UpdateBranchPaymentMethod from './UpdateBranchPaymentMethod'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <BranchPaymentMethods
                    goToCreate={() => setScreen("create")}
                    branchId={props.branchId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateBranchPaymentMethod
                        goToSetup={() => setScreen("setup")}
                        branchId={props.branchId}

                    />
                        : screen == "update" && <UpdateBranchPaymentMethod
                            goToSetup={() => setScreen("setup")}
                            branchId={props.branchId}
                        />
            }

        </>
    )
}
export default ProductOffer