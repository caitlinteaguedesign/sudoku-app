import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';

import formatDate from '../util/formatDate';

import Loading from '../components/Loading';
import CreatePrompt from '../components/CreatePrompt';

class Dashboard extends Component {

   constructor(props) {
      super(props);

      this.state = {
         puzzles: [],
         loading: true
      }
   }

   componentDidMount() {
      const { user } = this.props.auth;

      axios.get('/users/id/'+user.id)
         .then( res => {
            const puzzles = res.data.result.puzzles;

            let puzzlesList = [];

            (async () => {
               for(let puz in puzzles) {
                  try {
                     const puzzleId = puzzles[puz].id;
                     const result = await axios.get('/puzzles/id/'+puzzleId)
                        .then( lookup => lookup )
                        .catch( err => console.log(err));

                     
                     const data = result.data.result;

                     const entry = {
                        _id: puzzleId,
                        name: data.name,
                        difficulty: data.difficulty,
                        date_created: data.date_created,
                        completed: puzzles[puz].completed
                     }
                     puzzlesList.push(entry);
                  }
                  catch (err) {
                     console.log(err);
                  }                  
               }
            })();

            console.log('puzzleList', puzzlesList);

            this.setState({
               puzzles: puzzlesList,
               loading: false
            })
         })
         .catch( err => {
            console.log(err);
         });
   }

   render() {
      const { loading, puzzles } = this.state;

      if(loading) return Loading();

      else {
         if(puzzles.length > 0) return listPuzzles(puzzles)
         else return <CreatePrompt />;
      }
      
   }
}

function listPuzzles(puzzles) {
   return (
      <div className="page">
         <h1 className="page-title">My Puzzles</h1>

         <ul className="puzzle-list">
            {puzzles.map( (obj) => singlePuzzle(obj) )}
         </ul>
      </div>
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

Dashboard.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Dashboard));