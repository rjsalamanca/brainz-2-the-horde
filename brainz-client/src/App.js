import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";

import logo from "./images/brainz-logo-1.png";

import Scores from "./components/scoresPage";
import LandingPage from "./components/landingPage";
import Login from "./components/login";
import Register from "./components/register";
import Logout from "./components/logout";
import Play from "./components/play";
import Profile from "./components/profile";

import "./App.css";

class App extends Component {
   state = {
      isLoggedIn: false,
      id: 0,
      first_name: "",
      last_name: "",
      email: ""
   }

   changeLoginState = (user) => {
      const { login, id, f_name, l_name, email } = user;
      this.setState({
         isLoggedIn: login,
         id,
         f_name,
         l_name,
         email
      })
   }

   render() {
      const { isLoggedIn } = this.state

      return (
         <Router>
            <Nav className="navbar navbar-expand-lg navbar-light bg-light">
               <Link className="navbar-brand" to="/">
                  <img className="logo" src={logo} alt="Brainz Logo" />
               </Link>
               <Button className="navbar-toggler bg-light" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon bg-alert"></span>
               </Button>

               <div className="collapse navbar-collapse" id="navbarColor03">
                  <Nav className="navbar-nav mr-auto">
                     <Nav.Item className="nav-item active ">
                        <Link className="nav-link" to="/">Home<span className="sr-only"></span></Link>
                     </Nav.Item>
                     <Nav.Item className="nav-item active ">
                        <Link className="nav-link" to="/scores">High Scores<span className="sr-only"></span></Link>
                     </Nav.Item>
                     <Nav.Item className="nav-item active ">
                        <Link className="nav-link" to="/play">Play<span className="sr-only"></span></Link>
                     </Nav.Item>
                  </Nav>
               </div>

               <div className="navbar-collapse collapse" id="navbarColor03" >
                  {isLoggedIn === true ?
                     <Nav className="navbar-nav ml-auto">
                        <Nav.Item className="nav-item">
                           <Link className="nav-link" to="/Profile">Profile</Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item">
                           <Link className="nav-link" to="/logout">Logout</Link>
                        </Nav.Item>
                     </Nav>
                     :
                     <Nav className="navbar-nav ml-auto">
                        <Nav.Item className="nav-item">
                           <Link className="nav-link" to="/login">Login</Link>
                        </Nav.Item>
                        <Nav.Item className="nav-item my-2 my-lg-0">
                           <Link className="nav-link" to="/register">Register</Link>
                        </Nav.Item>
                     </Nav>
                  }
               </div>
            </Nav>
            <Switch>
               <Route path="/" exact component={LandingPage} />
               <Route path="/login" exact render={(props) => <Login {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
               <Route path="/register" exact render={(props) => <Register {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
               <Route path="/logout" exact render={(props) => <Logout {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
               <Route path="/profile" exact render={(props) => <Profile {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
               <Route path="/scores" render={(props) => <Scores {...props} user={this.state} changeLoginState={this.changeLoginState} />} />
               <Route path="/play" component={Play} />
               <Route render={() => <Redirect to="/" />} />
            </Switch>
            <footer className="footer mt-auto text-muted bg-light">
               <div className="container">
                  <div className="float-right">
                     {/* <a href="#">Back to top</a> */}
                  </div>
                  <div><b>Created By:</b> Pierson Scarborough, Eli Zhang, and RJ Salamanca</div>
               </div>
            </footer>
         </Router>
      )
   }
}

export default App;
