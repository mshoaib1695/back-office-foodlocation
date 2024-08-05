import React from 'react'
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    CardHeader,
    Row,
    Col,
    FormGroup,
    Label,
    CustomInput,
    Input
} from "reactstrap"

function PosTopBar(){
    return (
        <div id="pos-top-bar">
              <Button.Ripple 
                    color="primary"
                >
                    Pos
                </Button.Ripple >
                <Button.Ripple 
                    color="primary"
                >
                    Pos
                </Button.Ripple >
                <Button.Ripple 
                    color="primary"
                >
                    Pos
                </Button.Ripple >
                <Button.Ripple 
                    color="primary"
                >
                    Pos
                </Button.Ripple >
        </div>
   )
}
export default PosTopBar