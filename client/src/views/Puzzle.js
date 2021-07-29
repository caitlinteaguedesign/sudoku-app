import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import Loading from '../components/Loading';
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

         <section className="board">
            {data.start.map( (row, i) => boardRow(row, i) )}
         </section>
      </div>
   )
}

function boardRow(row, i) {
   return (
      <div key={`row_${i}`} className="board__row">{row.map( (cell, i) => boardCell(cell, i) )}</div>
   )
}

function boardCell(cell, i) {
   // TO DO: pass color/style classes down by cell level

   if(cell !== 0) {
      return <input key={`cell_${i}`} type="text" pattern="[1-9]" maxLength="1" className="board__cell board__cell--readonly" readOnly={true} value={cell} />
   }
   else {
      return <input key={`cell_${i}`} type="text" pattern="[1-9]" maxLength="1" className="board__cell" />
   }
   
}

export default withRouter(Puzzle);