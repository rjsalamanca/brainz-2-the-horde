import React, { Component } from 'react';
import io from 'socket.io-client';
import { TopScoresH1, Top3Li, RecentScoresH1, StyledDiv, StyledLi, StyledTitled, TimeTitled, StyledUl, TimeLi, PlayAgain, GameStats } from '../styled-components/scoresPageStyles';

import GameOverImg from '../images/gameover-once.gif';
import MainContainer from '../sharedComponents/mainContainer';
import "../Animate.css";

import { PORT } from "../apiConnect";

const moment = require('moment');

// open network preferences and grab ip and change it to yours
const ip = "";

moment.updateLocale('en', {
   relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: function (number, withoutSuffix, key, isFuture) {
         return (number < 10 ? '0' : '') + number + ' sec';
      },
      m: "01 min",
      mm: function (number, withoutSuffix, key, isFuture) {
         return (number < 10 ? '0' : '') + number + ' min';
      },
      h: "01 hrs",
      hh: "0%d hrs",
      d: "01 day",
      dd: "0%d day",
      M: "01 mon",
      MM: "0%d mon",
      y: "1 yrs",
      yy: "%d yrs"
   }
});

class Scores extends Component {
   state = {
      endpoint: `${ip}:${PORT}`,
      highscores: false,
      recentscores: false,
      rank: [],
      ranking: '',
      isFetching: false
   }

   componentDidUpdate = async () => {
      //console.log('component did update')
      const recent1 = document.getElementsByClassName('recent1');
      const recent2 = document.getElementsByClassName('recent2');
      const recent3 = document.getElementsByClassName('recent3');
      const recent4 = document.getElementsByClassName('recent4');
      const top3 = document.getElementsByClassName('top3');

      if (!!this.state.isFetching) {
         for (let i = 0; i < 3; i++) {
            recent1[i].classList.add('blinking');
            recent2[i].classList.add('blinking');
            recent3[i].classList.add('blinking');
            recent4[i].classList.add('blinking');
            top3[i].classList.add('top3-blinking');
         }
         setTimeout(() => {
            //console.log('setting timeout')
            for (let i = 0; i < 3; i++) {
               if (recent1[0] !== undefined) {
                  //console.log('defined')
                  recent1[i].classList.remove('blinking');
                  recent2[i].classList.remove('blinking');
                  recent3[i].classList.remove('blinking');
                  recent4[i].classList.remove('blinking');
                  top3[i].classList.remove('top3-blinking');
               }
            }
         }, 1000);
      }
   }

   componentDidMount = async () => {
      //console.log('component did mount');

      // Load the scores initially before the setInterval is called in socket
      const initialScores = await this.loadInitialHighScores();
      const recentScores = await this.loadInitialRecentScores();
      this.setState({
         highscores: initialScores,
         recentscores: recentScores
      });

      const { endpoint } = this.state;
      const socket = io(endpoint, { transports: ['websocket'], upgrade: false });

      socket.on('highScores', data => {
         // Setting initial scores
         //console.log('data', data)
         this.setState({ highscores: data })

         this.componentWillUnmount = () => {
            //console.log('this is test to see if it works')
            socket.disconnect();
            //this.setState({ isFetching: false });
         }

         // For initial when there are less than 10 entries for top scores
         if (data.length > this.state.highscores.length) {
            this.setState({ highscores: data })
            //console.log('changed, put changing animation here')
         } else {
            //console.log('still the same, do nothing')
         }
      })

      socket.on('recentScores', data => {
         this.setState({
            recentscores: data,
            isFetching: true
         })

         this.componentWillUnmount = () => {
            //console.log('this is test to see if it works')
            socket.disconnect();
            this.setState({ isFetching: false });
         }

         // For initial when there are less than 3 entries for recent scores
         if (data.length > this.state.recentscores.length) {
            this.setState({ recentscores: data })
         }

      })

      // If score is available, run generateSendData
      if (this.props.location.score !== undefined) {
         //console.log('not defined')
         this.generateSendData();
      }
   }

   generateSendData = async () => {
      const { score } = this.props.location;
      const { endpoint } = this.state;
      const socket = io(endpoint);

      const hasScore = this.props.location.hasOwnProperty('score');
      let data;
      let time = moment().format('L, hh:mm:ss a');
      if (!!hasScore) {
         if (!!this.props.user.isLoggedIn) {
            //console.log('inner if working');
            data = { 'wave': score.wave, 'kills': score.kills, 'user_id': this.props.user.id, 'game_mode_id': 1, 'timestamp': time };
            //console.log('data to send', data)
            socket.emit('game-results', data)
         } else {
            //console.log('inner else working');
            const data = { 'wave': score.wave, 'kills': score.kills, 'user_id': 1, 'game_mode_id': 1, 'timestamp': time };
            //console.log('data to send', data);
            socket.emit('game-results', data)
         }
      } else {
         //console.log('no property score')
      }

      //Set timeout so loadrank runs after the score has been updated in the database
      setTimeout(async () => {
         const rank = await this.loadRank();
         this.setState({ rank: rank });

         for (let i = 0; i < this.state.rank.length; i++) {
            if (this.state.rank[i].timestamp === time) {
               //console.log('bingo this is the one', i)
               this.setState({ ranking: i })
            }
         }
      }, 2000)
   }

   loadInitialHighScores = async () => {
      const url = `http://${ip}:${PORT}/highscores`;
      const response = await fetch(url);
      const data = response.json();
      return data;
   }

   loadInitialRecentScores = async () => {
      const url = `http://${ip}:${PORT}/recentscores`;
      const response = await fetch(url);
      const data = response.json();
      return data;
   }

   loadRank = async () => {
      const url = `http://${ip}:${PORT}/rank`;
      const response = await fetch(url);
      const data = response.json();
      return data;
   }

   render() {
      const { highscores, recentscores, ranking } = this.state;
      const hasScore = this.props.location.hasOwnProperty('score');
      const { user } = this.props;
      //console.log('rank data', ranking)

      return (
         <MainContainer className={`${!!hasScore ? "gameOver" : ''}`}>
            {!!hasScore ?
               <div id="gameOverContainer" className="animated fadeIn">
                  <img src={GameOverImg} alt="Game Over" />
                  <GameStats>
                     {!!user.isLoggedIn ? `Well done ${user.f_name}` : "You're an Anonymous Zombie!"}
                     <br />
                     You Died On Wave {this.props.location.score.wave} With {this.props.location.score.kills} kills
                            <br />
                     <span className="animated fadeInUp delay-3s">You Are Rank #{ranking + 1} On The Leaderboards!</span>
                  </GameStats>
                  <a href='/play'><PlayAgain>Retry</PlayAgain></a>
               </div>
               : ''}

            <div className={`${!!hasScore ? "animated fadeInUp delay-1s" : ''}`} >
               <TopScoresH1 className='scoresHeader'>TOP TEN SCORES</TopScoresH1>

               {
                  (highscores !== false) ?
                     <StyledDiv>
                        <StyledUl>
                           <StyledTitled>RANK</StyledTitled>
                           {highscores.map((data, index) => {

                              if (index < 3) {
                                 return (
                                    <Top3Li key={`data${index}`} className='top3'>
                                       {index + 1}
                                    </Top3Li>
                                 )
                              } else {
                                 return (
                                    <StyledLi key={`data${index}`} className='recent1'>
                                       {index + 1}
                                    </StyledLi>
                                 )
                              }
                           })}
                        </StyledUl>
                        <StyledUl>
                           <StyledTitled>NAME</StyledTitled>
                           {highscores.map((data, index) => {
                              if (index < 3) {
                                 return (
                                    <Top3Li key={`data${index}`} className='recent2'>
                                       {data.user_id === 1 ? "ZMB" : data.f_name.substring(0, 3)}
                                    </Top3Li>
                                 )
                              } else {
                                 return (
                                    <StyledLi key={`data${index}`} className='recent2'>
                                       {data.user_id === 1 ? "ZMB" : data.f_name.substring(0, 3)}
                                    </StyledLi>
                                 )
                              }
                           })}
                        </StyledUl>
                        <StyledUl>
                           <StyledTitled>WAVE</StyledTitled>
                           {highscores.map((data, index) => {
                              if (index < 3) {
                                 return (
                                    <Top3Li key={`data${index}`} className='recent3'>
                                       {data.wave}
                                    </Top3Li>
                                 )
                              } else {
                                 return (
                                    <StyledLi key={`data${index}`} className='recent3'>
                                       {data.wave}
                                    </StyledLi>
                                 )
                              }
                           })}
                        </StyledUl>
                        <StyledUl>
                           <StyledTitled>KILLS</StyledTitled>
                           {highscores.map((data, index) => {
                              if (index < 3) {
                                 return (
                                    <Top3Li key={`data${index}`} className='recent4'>
                                       {data.kills}
                                    </Top3Li>
                                 )
                              } else {
                                 return (
                                    <StyledLi key={`data${index}`} className='recent4'>
                                       {data.kills}
                                    </StyledLi>
                                 )
                              }
                           })}
                        </StyledUl>
                     </StyledDiv>
                     : ''
               }


               <RecentScoresH1 className='scoresHeader'>Recent Games</RecentScoresH1>
               {
                  (recentscores !== false) ?
                     <StyledDiv>
                        <StyledUl>
                           <StyledTitled>NAME</StyledTitled>
                           {recentscores.map((data, index) => {
                              return (
                                 <StyledLi key={`data${index}`} className='recent1'>
                                    {data.user_id === 1 ? "ZMB" : data.f_name.substring(0, 3)}
                                 </StyledLi>
                              )
                           })}
                        </StyledUl>
                        <StyledUl>
                           <StyledTitled>WAVE</StyledTitled>
                           {recentscores.map((data, index) => {
                              return (
                                 <StyledLi key={`data${index}`} className='recent2'>
                                    {data.wave}
                                 </StyledLi>
                              )
                           })}
                        </StyledUl>
                        <StyledUl>
                           <StyledTitled>KILLS</StyledTitled>
                           {recentscores.map((data, index) => {
                              return (
                                 <StyledLi key={`data${index}`} className='recent3'>
                                    {data.kills}
                                 </StyledLi>
                              )
                           })}
                        </StyledUl>
                        <StyledUl>
                           <TimeTitled>ELAPSED</TimeTitled>
                           {recentscores.map((data, index) => {
                              const test = moment(`${data.timestamp}`, `L, hh:mm:ss a`).fromNow();
                              return (
                                 <TimeLi key={`data${index}`} className='recent4'>
                                    {test}
                                 </TimeLi>
                              )
                           })}
                        </StyledUl>
                     </StyledDiv>
                     : ''
               }
            </div>
         </MainContainer >
      );
   }
}

export default Scores;
