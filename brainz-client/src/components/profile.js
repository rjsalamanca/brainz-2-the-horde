import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import io from 'socket.io-client';

import MainContainer from "../sharedComponents/mainContainer"
import "../App.css";
import { StyledLi, StyledH1, StyledH4 } from '../styled-components/profilePageStyles';

import { ip, PORT } from '../apiConnect';

class Profile extends Component {
   state = {
      endpoint: `${ip}:${PORT}`,
      loginMessage: "",
      myScores: []
   }

   async componentDidMount() {
      const myScores = await this.loadMyScores();
      this.setState({
         myScores: myScores
      });
      if (!!this.props.user.isLoggedIn) {
         this.getProfile();
      }
   }

   loadMyScores = async () => {
      const url = `http://${ip}:${PORT}/my-scores/${this.props.user.id}`;
      const response = await fetch(url);
      const data = response.json();
      return data;
   }

   getProfile = async () => {
      const url = `http://${ip}:${PORT}/users/`;

      const { endpoint } = this.state;
      const socket = io(endpoint);

      try {
         const response = await fetch(url, {
            method: "POST",
            headers: {
               "Accept": "application/json",
               "Content-Type": "application/json"
            },
            body: JSON.stringify(this.props.user)
         })

         //socket.emit('send-id', this.props.user.id);
         socket.disconnect();

         const data = await response.json();
         const { loginMessage } = data;

         this.setState({
            loginMessage
         })
      } catch (err) {

         console.log(err)
      }
   }

   displayProfile = () => {
      const { user } = this.props;
      const { myScores } = this.state;

      switch (user.isLoggedIn) {
         case true:
            return (
               <MainContainer>
                  <StyledH4 className="quotes">{this.state.loginMessage}</StyledH4>
                  <StyledH1 className="scoresHeader">Your Scores</StyledH1>
                  {myScores.length === 0 ?
                     <h4 style={{ textAlign: 'center', marginTop: '2rem' }}>You currently have no scores.</h4>
                     :
                     <ul>
                        {myScores.map((data, index) => {
                           return (
                              <StyledLi key={`data${index}`}>
                                 Wave: {data.wave} Kills: {data.kills}
                              </StyledLi>
                           )
                        })}
                     </ul>
                  }
               </MainContainer>
            )
         default:
            return <Redirect to="/" />
      }
   }

   render() {
      return (
         this.displayProfile()
      )
   }
}

export default Profile;