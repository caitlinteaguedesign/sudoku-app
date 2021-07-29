import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import formatDate from '../util/formatDate';

import Loading from '../components/Loading';

export default class Browse extends Component {

   constructor(props) {
      super(props);

      this.state = {
         data: null,
         loading: true
      }
   }

   componentDidMount() {
      axios.get('/puzzles/')
      .then(res => {
         this.setState({
            data: res.data,
            loading: false
         })
      }) 
      .catch(err => console.log(err));
   }

   render() {

      const { data, loading } = this.state;

      if(loading) {
         return Loading();
      }
      else {
         if(data) return displayPuzzles(data);
         else return noPuzzles();
      }
   }
}

function displayPuzzles(data) {

   const easy = data.filter(puzzle => puzzle.difficulty === 'easy');
   const medium = data.filter(puzzle => puzzle.difficulty === 'medium');
   const hard = data.filter(puzzle => puzzle.difficulty === 'hard');
   const insane = data.filter(puzzle => puzzle.difficulty === 'insane');

   return (
      <div className="page">
         <h1 className="page-title">Browse Puzzles</h1>

         {easy.length > 0 &&
         <section className="section">
            <h2 className="section-title">Easy</h2>
            { listPuzzles(easy) }
         </section>
         }

         {medium.length > 0 &&
         <section className="section">
            <h2 className="section-title">Medium</h2>
            { listPuzzles(medium) }
         </section>
         }

         {hard.length > 0 &&
         <section className="section">
            <h2 className="section-title">Hard</h2>
            { listPuzzles(hard) }
         </section>
         }

         {insane.length > 0 &&
         <section className="section">
            <h2 className="section-title">Insane</h2>
            { listPuzzles(insane) }
         </section>
         }
      </div>
   )
}

function listPuzzles(puzzles) {
   return (
      <ul className="puzzle-list">
         {puzzles.map( (obj) => singlePuzzle(obj) )}
      </ul>
   )
}

function singlePuzzle(puzzle) {
   return (
      <li key={puzzle._id} className="puzzle-list__item">
         <Link to={`/puzzle/${puzzle._id}`} className="link link_style-text">{puzzle.name}</Link>
         <span className="text_uppercase">Added on <span className="text_bold">{formatDate(puzzle.date_created, 'M/D/YYYY')}</span></span>
      </li>
   )
}

function noPuzzles() {
   return (
      <div className="start">
         <h1 className="start__prompt">There aren't any puzzles yet!</h1>
         <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
      </div>
   )
}