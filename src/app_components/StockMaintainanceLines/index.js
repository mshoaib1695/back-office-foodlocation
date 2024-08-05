import React, { useState } from 'react'
import StockMaintainanceLines from './StockMaintainanceLines'
import CreateStockMaintainanceLine from './CreateStockMaintainanceLine'
import UpdateStockMaintainanceLine from './UpdateStockMaintainanceLine'

function ProductOffer(props) {
    const [screen, setScreen] = useState("setup")
    return (
        <>
            {
                screen == "setup" ? <StockMaintainanceLines
                    goToCreate={() => setScreen("create")}
                    stockmaintainanceId={props.stockmaintainanceId}
                    goToUpdate={() => setScreen("update")}
                />
                    : screen == "create" ? <CreateStockMaintainanceLine
                        goToSetup={() => setScreen("setup")}
                        stockmaintainanceId={props.stockmaintainanceId}

                    />
                        : screen == "update" && <UpdateStockMaintainanceLine
                            goToSetup={() => setScreen("setup")}
                            stockmaintainanceId={props.stockmaintainanceId}
                        />
            }

        </>
    )
}
export default ProductOffer