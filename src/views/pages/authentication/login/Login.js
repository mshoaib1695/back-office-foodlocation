import React from "react"
import {
    Button,
    Card,
    CardBody,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap"
import { User, Lock, Check, Facebook, Twitter, GitHub } from "react-feather"
import { history } from "../../../../history"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import googleSvg from "../../../../assets/img/svg/google.svg"
import imgLogo from './logo2.png'
import loginImg from "../../../../assets/img/pages/login.png"
import "../../../../assets/scss/pages/authentication.scss"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ComponentSpinner from '../../../../components/@vuexy/spinner/Loading-spinner'
import ComponentSpinner2 from '../../../../components/@vuexy/spinner/Fallback-spinner'
import { login } from '../../../../redux/actions/auth/loginActions'
import { useDispatch } from 'react-redux'

function Login(props) {
    const [loading, setLoading] = React.useState(false)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const dispatch = useDispatch()

    const loginHandler = () => {
        let values = {
            email: email,
            password: password
        }
        // setLoading(true)
        if (values.password && values.email) {
            dispatch(login({ usernameOrEmail: values.email, password: values.password }))
        } else {
            toast.error("" + JSON.stringify(values, null, 2))
            setLoading(false)
        }
    }
    return (
        loading ?
            <ComponentSpinner />
            :
            <Row className="m-0 justify-content-center">
                <Col
                    sm="8"
                    xl="7"
                    lg="10"
                    md="8"
                    className="d-flex justify-content-center"
                >
                    <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
                        <Row className="m-0">
                            <Col
                                lg="6"
                                className="d-lg-block d-none text-center align-self-center px-1 py-0"
                            >
                                <img src={loginImg} alt="loginImg" />
                            </Col>
                            <Col lg="6" md="12" className="p-0">
                                <Card className="rounded-0 mb-0 px-2">
                                    <CardBody>
                                        <h4>Login</h4>
                                        <p>Welcome To Injaz POS,<br /> Please login to your account.</p>
                                        <Form onSubmit={e => e.preventDefault()}>
                                            <FormGroup className="form-label-group position-relative has-icon-left">
                                                <Input
                                                    type="text"
                                                    placeholder="Username"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                />
                                                <div className="form-control-position">
                                                    <User size={15} />
                                                </div>
                                                <Label>Email</Label>
                                            </FormGroup>
                                            <FormGroup className="form-label-group position-relative has-icon-left">
                                                <Input
                                                    type="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                />
                                                <div className="form-control-position">
                                                    <Lock size={15} />
                                                </div>
                                                <Label>Password</Label>
                                            </FormGroup>
                                            <FormGroup className="d-flex justify-content-between align-items-center">
                                                <Checkbox
                                                    color="primary"
                                                    icon={<Check className="vx-icon" size={16} />}
                                                    label="Remember me"
                                                />

                                                <div className="float-right">

                                                    <Button.Ripple color="primary" block type="submit" onClick={() => loginHandler()}>
                                                        Login
                            </Button.Ripple>
                                                </div>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <ToastContainer />
            </Row>
    )

}
export default Login
