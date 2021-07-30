import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Loading from '../components/Loading';
import Board from '../game/Board';

import formatDate from '../util/formatDate';

class Puzzle extends Component {

   constructor(props) {
      super(props);

      this.state = {
         id: null,
         board: null,
         player: null,
         loading: true
      }
   }

   componentDidMount() {
      const id = this.props.match.params.id;

      axios.get('/puzzles/id/'+id)
         .then(res => {
            // get player state

            // if player doesn't have a board started, use the board's start
            const playerBoard = res.data.result.start;

            // if new, add to players list of puzzles
            
            this.setState({
               id: id,
               board: res.data.result,
               player: playerBoard,
               loading: false
            });

         }) 
         .catch(err => {
            console.log(err);
            this.props.history.push('/browse')
         });
   }

   handleGrid = (e, rowIndex, cellIndex) => {
      
      let value = parseInt(e.target.value);
   
      if(!Number.isInteger(value) || (value<1 || value>9)) {
         value = 0;
      }

      let updateData = [...this.state.player];
      updateData[rowIndex][cellIndex] = value;
      this.setState({
         ...this.state,
         player: updateData
      });
   }

   render() {
      
      if(this.state.loading) return Loading();
      else {
         // console.log('start', this.state.board.start);
         // console.log('player', this.state.player);
         return (
         <div className="page">
            <div className="title-group">
               <h1 className="page-title">{this.state.board.name}</h1>
               <span className="title-group__small">{`${this.state.board.difficulty} | ${formatDate(this.state.board.date_created, 'Mon D, YYYY')}`}</span>
            </div>

            <Board start={this.state.board.start} player={this.state.player} update={(e, rowIndex, cellIndex) => this.handleGrid(e, rowIndex, cellIndex)}  />
         </div>
         );
      }
   }
   
   
}

export default withRouter(Puzzle);