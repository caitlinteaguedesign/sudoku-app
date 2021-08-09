import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import classnames from 'classnames';

import formatDate from '../util/formatDate';

import Loading from '../components/Loading';
import CreatePrompt from '../components/CreatePrompt';

import { ReactComponent as Easy } from '../img/easy.svg';
import { ReactComponent as Medium } from '../img/medium.svg';
import { ReactComponent as Hard } from '../img/hard.svg';
import { ReactComponent as Insane } from '../img/insane.svg';

class Dashboard extends Component {

   constructor(props) {
      super(props);

      this.state = {
         puzzles: [],
         loading: true
      }
   }

   processPuzzles = async (puzzles) => {
      let puzzlesList = [];

      for(const puz in puzzles) {
         const puzzleId = puzzles[puz].id;

         const result = await axios.get('/puzzles/id/'+puzzleId)
            .then( lookup => lookup.data.result)
            .catch( err => console.log(err));

         if(result) {
            const entry = {
               _id: puzzleId,
               name: result.name,
               difficulty: result.difficulty,
               date_created: result.date_created,
               completed: puzzles[puz].completed
            }
            puzzlesList.push(entry);     
         }
                   
      }

      return puzzlesList;
   }

   getPuzzles = async (puzzles) => {
      const puzzlesList = await this.processPuzzles(puzzles);

      this.setState({
         puzzles: puzzlesList,
         loading: false
      });
   }

   componentDidMount() {
      const { user } = this.props.auth;

      axios.get('/users/id/'+user.id)
         .then( res => {
            const puzzles = res.data.result.puzzles;

            if(puzzles.length > 0) {
               this.getPuzzles(puzzles);
            }

            else {
               this.setState({
                  loading: false
               })
            }
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

   const inprogress = puzzles.filter(puzzle => !puzzle.completed).sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const completed = puzzles.filter(puzzle => puzzle.completed).sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));

   return (
      <div className="page">
         <h1 className="page-title">My Puzzles</h1>

         {inprogress.length > 0 &&
         <section className="section">
            <h2 className="section-title">In-Progress</h2>
            <ul className="puzzle-list">
               {inprogress.map( (obj) => singlePuzzle(obj) )}
            </ul>
         </section>
         }

         {completed.length > 0 &&
         <section className="section">
            <h2 className="section-title">Completed</h2>
            <ul className="puzzle-list">
               {completed.map( (obj) => singlePuzzle(obj) )}
            </ul>
         </section>
         }
      </div>
   )
}

function singlePuzzle(puzzle) {
   let IconName = '';

   switch (puzzle.difficulty) {
      case 'easy':
         IconName = Easy; break;
      case 'medium':
         IconName = Medium; break;
      case 'hard':
         IconName = Hard; break;
      case 'insane':
         IconName = Insane; break;
      default: break;
   }

   return (
      <li key={puzzle._id} className="puzzle-list__item">
         <IconName role="img" aria-label="this is an easy puzzle" width="52" height="52" 
            className={classnames('puzzle-list__icon',
            {'puzzle-list__icon--easy': puzzle.difficulty === 'easy'},
            {'puzzle-list__icon--medium': puzzle.difficulty === 'medium'},
            {'puzzle-list__icon--hard': puzzle.difficulty === 'hard'},
            {'puzzle-list__icon--insane': puzzle.difficulty === 'insane'})}
         />
         <Link to={`/puzzle/${puzzle._id}`} className="link link_style-text">{puzzle.name}</Link>
         <span className="puzzle-list__date">Added on <span className="text_bold">{formatDate(puzzle.date_created, 'M/D/YYYY')}</span></span>
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