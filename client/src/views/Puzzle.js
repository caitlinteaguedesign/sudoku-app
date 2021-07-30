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
         data: null,
         loading: true
      }
   }

   componentDidMount() {
      const id = this.props.match.params.id;

      axios.get('/puzzles/id/'+id)
         .then(res => {
            
            this.setState({
               id: id,
               data: res.data.result,
               loading: false
            })
         }) 
         .catch(err => console.log(err));
   }

   render() {
      
      const { data, loading } = this.state;

      if(loading) return Loading();
      else return viewPuzzle(data);
   }
   
   
}

function viewPuzzle(data) {
   return (
      <div className="page">
         <div className="title-group">
            <h1 className="page-title">{data.name}</h1>
            <span className="title-group__small">{`${data.difficulty} | ${formatDate(data.date_created, 'Mon D, YYYY')}`}</span>
         </div>

         <Board data={data.start} />
      </div>
   )
}

export default withRouter(Puzzle);