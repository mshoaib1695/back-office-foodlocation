import React, { useState } from 'react'
import POSComponent from './POSComponent'
// import POSTables from './POSTables'

function Pos() {
    const [isPosOpen, setIsPosOpen] = useState(true)
    return (
        <div id="pos-container">
            {
                isPosOpen ?
                    <POSComponent />
                    :
                    <POSComponent />
                    // <POSTables />
            }
        </div>
    )
}
export default Pos