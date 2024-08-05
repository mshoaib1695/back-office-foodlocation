import React, { useEffect } from 'react'
import { history } from '../../history'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    Row,
    Col,
    FormGroup,
    Form,
    Input,
    Button,
    Label,
    CustomInput
} from "reactstrap"
import fgImg from "../../assets/img/pages/forgot-password.png"
import "../../assets/scss/pages/authentication.scss"
import { useSelector } from "react-redux"
import { clients_list } from '../../API_Helpers/auth'
import { changeClient } from '../../redux/actions/auth/loginActions'
import { useDispatch } from 'react-redux'
import message from '../../API_Helpers/toast'

function SelectClient() {
    const [clientsList, setClientsList] = React.useState([])
    const isSuperClient = useSelector(state => state.auth.login && state.auth.login.client && state.auth.login.client.client)
    const user = useSelector(state => state.auth.login && state.auth.login.user)
    const dispatch = useDispatch()

    const clientSelectHandler = (id) => {
        dispatch({ type: "CHANGE_CLIENT", payload: id })
        history.push('/dashboard')
    }
    useEffect(() => {
        if (isSuperClient != "0") {
            return history.push("/dashboard")
        }
    }, [])
    useEffect(() => {
        clients_list({
            tokenType: user.tokenType,
            accessToken: user.accessToken,
        })
            .then(res => { message(res)

                setClientsList(res.data)
            })
    }, [])
    return (
        <Row className="m-0 justify-content-center">
            <Col
                sm="8"
                xl="7"
                lg="10"
                md="8"
                className="d-flex justify-content-center"
            >
                <Card className="bg-authentication rounded-0 mb-0 w-100">
                    <Row className="m-0">
                        <Col
                            lg="6"
                            className="d-lg-block d-none text-center align-self-center"
                        >
                            <img src={fgImg} alt="fgImg" />
                        </Col>
                        <Col lg="6" md="12" className="p-0">
                            <Card className="rounded-0 mb-0 px-2 py-1">
                                <CardHeader className="pb-1">
                                    <CardTitle>
                                        <h4 className="mb-0">Injaz Point Of Sale</h4>
                                    </CardTitle>
                                </CardHeader>
                                <p className="px-2 auth-title">
                                    Please Select Client.
                                </p>
                                <CardBody className="pt-1 pb-0">
                                    <Form>
                                        <FormGroup>
                                            <Label> Clinet Name </Label>
                                            <CustomInput onChange={(event) => event.target.value != null && clientSelectHandler(event.target.value)} type="select" name="select" id="client">
                                                <option key={'null'} value={null}>{"PLease Select Client"}</option>
                                                {
                                                    clientsList.map(client => (
                                                        <option key={client.id} value={client.id}>{client.name}</option>
                                                    ))
                                                }
                                            </CustomInput>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row >
    )
}
export default SelectClient
