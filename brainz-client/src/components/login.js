import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";
import MainContainer from '../sharedComponents/mainContainer';

import { apiRoute } from '../apiConnect';
import '../App.css';

class Login extends Component {
   state = {
      email: "",
      password: "",
      login: false,
      errorCode: 0
   }

   componentDidMount = () => {
      if (this.props.location.errorCode !== undefined) {
         this.setState({ errorCode: this.props.location.errorCode })
      }
   }

   handleEmail = (e) => { this.setState({ email: e.target.value }) }
   handlePassword = (e) => { this.setState({ password: e.target.value }) }

   login = async () => {
      const url = `${apiRoute}/users/login`;

      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
         })

         const data = await response.json();
         const { login, errorCode } = data;

         if (!!login) {
            const { id, f_name, l_name, email } = data;
            this.props.changeLoginState({ login, id, f_name, l_name, email })
         }

         this.setState({
            login,
            errorCode
         })
      } catch (err) {
         // This error code tells us that the url is bad.
         this.setState({ errorCode: 3 });
      }
   }

   render() {
      const { login, errorCode } = this.state;
      return (
         <MainContainer>
            <Card className="loginSignUpContainer mt-5">
               <Card.Header as="h5">Login</Card.Header>
               <Card.Body>
                  <Form>
                     <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" onChange={(e) => this.handleEmail(e)} placeholder="Enter email" />
                     </Form.Group>
                     <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control autoComplete="on" type="password" onChange={(e) => this.handlePassword(e)} placeholder="Password" />
                     </Form.Group>
                     <Button className="mb-3" variant="danger" onClick={(e) => this.login()}>
                        Sign In
                        </Button>
                  </Form>
                  {errorCode === 1 ?
                     <Alert className="alert alert-dismissible alert-danger users-alert">
                        <strong>Oh $h%+!</strong> <b>User not registered</b> , please register.
                        </Alert>
                     :
                     errorCode === 2
                        ?
                        <Alert className="alert alert-dismissible alert-danger users-alert">
                           <strong>Oh $h%+!</strong> <b>Invalid Password</b> , use your brainZ and try submitting again.
                            </Alert>
                        : errorCode === 3
                           ?
                           <Alert className="alert alert-dismissible alert-danger users-alert">
                              <strong>A zombie has taken a chunk of our brain.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                           </Alert>
                           : errorCode === 5
                              ?
                              <Alert variant={'success'} className="users-alert">
                                 <strong>You've successfully created a new account!</strong> Please login with your newly created credentials.
                                    </Alert> : ''}
                  <p className="mt-4">
                     No Account? <Link to="/register"><b>Register</b></Link>
                  </p>
               </Card.Body>
               {(!!login) ? <Redirect to="/profile" /> : ""}
            </Card >
         </MainContainer>
      )
   }
}

export default Login;