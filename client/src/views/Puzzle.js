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
            })
         }) 
         .catch(err => console.log(err));

      

   }

   render() {
      
      const { board, player, loading } = this.state;

      if(loading) return Loading();
      else return viewPuzzle(board, player);
   }
   
   
}

function viewPuzzle(board, player) {
   return (
      <div className="page">
         <div className="title-group">
            <h1 className="page-title">{board.name}</h1>
            <span className="title-group__small">{`${board.difficulty} | ${formatDate(board.date_created, 'Mon D, YYYY')}`}</span>
         </div>

         <Board start={board.start} player={player}  />
      </div>
   )
}

export default withRouter(Puzzle);