import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Alert, Card, Button, Form } from 'react-bootstrap';
import MainContainer from '../sharedComponents/mainContainer';

import { apiRoute } from '../apiConnect';

class Register extends Component {
   state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      errorCode: 0,
      createdAccount: false
   }

   handleFirstName = (e) => { this.setState({ first_name: e.target.value }) }
   handleLastName = (e) => { this.setState({ last_name: e.target.value }) }
   handleEmail = (e) => { this.setState({ email: e.target.value }) }
   handlePassword = (e) => { this.setState({ password: e.target.value }) }

   createUser = async (e) => {
      const url = `${apiRoute}/users/register`,
         formCheck = document.getElementById('registerForm').checkValidity();

      if (!!formCheck) {
         e.preventDefault();

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

            if (data.errorCode === 5) {
               this.setState({
                  createdAccount: data.createdAccount,
                  errorCode: data.errorCode
               });
            } else {
               this.setState({ errorCode: data.errorCode })
            }
         } catch (err) {
            this.setState({ errorCode: 6 });
         }
      }
   }

   render() {
      const { createdAccount, errorCode } = this.state;
      return (
         <MainContainer>
            <Card className="loginSignUpContainer mt-5" >
               <Card.Header as="h5">Register as a Zombie Killer</Card.Header>
               <Card.Body>
                  <Form id="registerForm">
                     <Form.Group controlId="formFirstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" name="f_name" className="form-control" placeholder="First Name" onChange={(e) => this.handleFirstName(e)} required />
                     </Form.Group>
                     <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" name="l_name" className="form-control" placeholder="Last Name" onChange={(e) => this.handleLastName(e)} required />
                     </Form.Group>
                     {/* <Form.Group controlId="formEmail"> */}
                     <Form.Label>Email address</Form.Label>
                     <Form.Control type="email" minLength="1" name="email" className="form-control" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => this.handleEmail(e)} required />
                     <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                     {/* </Form.Group> */}
                     <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" autoComplete="on" name="password" className="form-control" placeholder="Password" onChange={(e) => this.handlePassword(e)} required />
                     </Form.Group>
                     <Button className="mb-3" type="submit" variant={'danger'} onClick={(e) => this.createUser(e)}>Submit</Button>
                  </Form>
                  {errorCode === 3 ?
                     <Alert className="alert alert-dismissible alert-danger users-alert">
                        <strong>Oh $h%+!</strong> This user is already fighting the undead.
                        </Alert>
                     : (errorCode === 4 || errorCode === 6)
                        ?
                        <Alert className="alert alert-dismissible alert-danger users-alert">
                           <strong>Uh Oh, we are currently having issues.</strong> Please send let us know you have the following <b>Error Code: {errorCode}</b>
                        </Alert>
                        : ``}
                  <p className="mt-4">Already have an account? <Link to="/login"><b>Login Here</b></Link></p>
                  {(!!createdAccount) ? <Redirect to={{
                     pathname: '/login',
                     errorCode
                  }} /> : ''}
               </Card.Body>
            </Card >
         </MainContainer>
      )
   }
}

export default Register;