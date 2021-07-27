import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { unlock } from '../../../api/routes/puzzles';

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

      if(data) {

         return (
            <ul>where puzzle
            {/* {data.map( (object) => {
               return ( 
                  <li>
                     <p key={object._id}>{object.name}</p>
                     <p>{object.difficulty}</p>
                     <p>{object.date_created}</p>
                  </li>
               )
            })} */}
            </ul>
         )
      }
      else {
         return (
            <div className="start">
               <p className="start__prompt">There aren't any puzzles yet!</p>
               <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
            </div>
         )
      }
   }
}