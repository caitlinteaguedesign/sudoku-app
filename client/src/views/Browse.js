import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default class Browse extends Component {

   constructor() {
      super();

      this.state = {
         data: null
      }
   }

   componentDidMount() {
      axios
      .get('/puzzles/')
      .then(res => {
         console.log(res.data)
         this.setState({
            data: res.data
         })
      }) 
      .catch(err => console.log(err));
   }

   render() {

      const { data } = this.state;

      if(data) return displayPuzzles(data);
      else return noPuzzles();
   }
}

function displayPuzzles(data) {
   return (
      <ul>
         {data.map( (obj) => singlePuzzle(obj) )}
      </ul>
   )
}

function singlePuzzle(puzzle) {
   return (
      <li key={puzzle._id}>
         <p key={puzzle._id}>{puzzle.name}</p>
         <p>{puzzle.difficulty}</p>
         <p>{puzzle.date_created}</p>
      </li>
   )
}

function noPuzzles() {
   return (
      <div className="start">
         <p className="start__prompt">There aren't any puzzles yet!</p>
         <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
      </div>
   )
}