import React, { useState } from 'react'
import PurchasedInvoiceLines from './PurchasedInvoiceLines'
import UpdatePurchasedInvoiceLine from './UpdatePurchasedInvoiceLine'
import CreatePurchasedInvoiceLine from './CreatePurchasedInvoiceLine'

function ProductIngredient(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <PurchasedInvoiceLines
                    goToCreate={() => setScreen("create")}
                    invoice={props.invoice}
                    warehouse={props.warehouse}
                    getInvoice={() => props.getInvoice()}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreatePurchasedInvoiceLine
                        goToSetup={() => setScreen("setup")}
                        invoice={props.invoice}
                        warehouse={props.warehouse}

                    />
                        : screen == "update" && <UpdatePurchasedInvoiceLine
                            goToSetup={() => setScreen("setup")}
                            invoice={props.invoice}
                            warehouse={props.warehouse}
                        />
            }

        </>
    )
}
export default ProductIngredient