import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import classnames from 'classnames';

import formatDate from '../util/formatDate';

import Loading from '../components/Loading';
import CreatePrompt from '../components/CreatePrompt';

import { ReactComponent as Easy } from '../img/easy.svg';
import { ReactComponent as Medium } from '../img/medium.svg';
import { ReactComponent as Hard } from '../img/hard.svg';
import { ReactComponent as Expert } from '../img/expert.svg';
import { ReactComponent as InProgress } from '../img/inprogress.svg';
import { ReactComponent as Completed } from '../img/completed.svg';

import { ReactComponent as Add } from '../img/add.svg';

class Browse extends Component {

   constructor(props) {
      super(props);

      this.state = {
         data: null,
         loading: true,
         added: false
      }
   }

   processPuzzles = async (puzzles) => {

      const { user, isAuthenticated } = this.props.auth;

      if(isAuthenticated) {
         const result = await axios.get('/users/id/'+user.id)
            .then( lookup => lookup.data.result)
            .catch( err => console.log(err));

         if(result) {
            let puzzlesList = [];
            const userPuzzles = cloneDeep(result.puzzles);
   
            for(const puz in puzzles) {
   
               let thisPuzzle = puzzles[puz];
   
               const userVersion = userPuzzles.findIndex(puz => puz.id === thisPuzzle._id);
   
               if(userVersion !== -1) {
                  thisPuzzle.isCompleted = userPuzzles[userVersion].completed;
               }
   
               puzzlesList.push(thisPuzzle);
                           
            }
   
            return puzzlesList;
         }
         else {
            return puzzles;
         }

      }
      else {
         return puzzles;
      }
      
   }

   comparePuzzles = async (puzzles) => {
      const puzzlesList = await this.processPuzzles(puzzles);

      this.setState({
         data: puzzlesList,
         loading: false,
         added: this.getAddedPuzzle()
      });
   }

   getAddedPuzzle() {
      const { location } = this.props;
      return new URLSearchParams(location.search).get('added') || false;
   }

   componentDidMount() {

      axios.get('/puzzles/')
         .then(res => {
            const puzzles = res.data;

            if(puzzles.length > 0) {
               this.comparePuzzles(puzzles);
            }
            else {
               this.setState({
                  loading: false,
                  added: this.getAddedPuzzle()
               })
            }
         }) 
         .catch(err => console.log(err));
   }

   render() {

      const { data, loading, added } = this.state;

      if(loading) {
         return Loading();
      }
      else {
         if(data) return displayPuzzles(data, added);
         else return <CreatePrompt />;
      }
   }
}

function displayPuzzles(data, added) {

   const easy = data.filter(puzzle => puzzle.difficulty === 'easy').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const medium = data.filter(puzzle => puzzle.difficulty === 'medium').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const hard = data.filter(puzzle => puzzle.difficulty === 'hard').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const expert = data.filter(puzzle => puzzle.difficulty === 'expert').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));

   return (
      <div className="page">
         <h1 className="page-title">Browse Puzzles</h1>

         {added && 
         <div className="alert alert_color-success alert_layout-icon page__justify-start">
            <Add role="img" aria-label="check mark" width="26" height="26" className="alert__icon" />
            <p>You added a puzzle!</p>
         </div>
         }

         {easy.length > 0 &&
         <section className="section">
            <div className="section-title-icon">
               <Easy role="img" aria-label="these are easy puzzles" width="26" height="26" className="section-title-icon__icon" />
               <h2 className="section-title">Easy</h2>
            </div>
            { listPuzzles(easy) }
         </section>
         }

         {medium.length > 0 &&
         <section className="section">
            <div className="section-title-icon">
               <Medium role="img" aria-label="these are medium puzzles" width="26" height="26" className="section-title-icon__icon" />
               <h2 className="section-title">Medium</h2>
            </div>
            { listPuzzles(medium) }
         </section>
         }

         {hard.length > 0 &&
         <section className="section">
            <div className="section-title-icon">
               <Hard role="img" aria-label="these are hard puzzles" width="26" height="26" className="section-title-icon__icon" />
               <h2 className="section-title">Hard</h2>
            </div>
            
            { listPuzzles(hard) }
         </section>
         }

         {expert.length > 0 &&
         <section className="section">
            <div className="section-title-icon">
               <Expert role="img" aria-label="these are expert puzzles" width="26" height="26" className="section-title-icon__icon" />
               <h2 className="section-title">Expert</h2>
            </div>
            
            { listPuzzles(expert) }
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
   let IconName = '';
   let userLabelModifier = '';

   if('isCompleted' in puzzle && puzzle.isCompleted) {
      IconName = Completed;
      userLabelModifier = ' and has already been completed';
   }
   else if ('isCompleted' in puzzle && !puzzle.isCompleted) {
      IconName = InProgress;
      userLabelModifier = ' and is already in progress';
   }
   else {
      switch (puzzle.difficulty) {
         case 'easy':
            IconName = Easy; break;
         case 'medium':
            IconName = Medium; break;
         case 'hard':
            IconName = Hard; break;
         case 'expert':
            IconName = Expert; break;
         default: break;
      }
   }

   return (
      <li key={puzzle._id} className="puzzle-list__item">
         <IconName role="img" aria-label={`This puzzle has a difficulty of ${puzzle.difficulty}` + userLabelModifier} width="52" height="52" 
            className={classnames('puzzle-list__icon',
            {'puzzle-list__icon--completed': 'isCompleted' in puzzle && puzzle.isCompleted},
            {'puzzle-list__icon--inprogress': 'isCompleted' in puzzle && !puzzle.isCompleted},
            {'puzzle-list__icon--default': !('isCompleted' in puzzle)} )}
         />
         <Link to={`/puzzle/${puzzle._id}`} className="link link_style-text">{puzzle.name}</Link>
         <span className="puzzle-list__date">Added on <span className="text_bold">{formatDate(puzzle.date_created, 'MM/DD/YYYY')}</span></span>
      </li>
   )
}

Browse.propTypes = {
   auth: PropTypes.object.isRequired,
   location: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Browse));