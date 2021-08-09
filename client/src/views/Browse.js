import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import formatDate from '../util/formatDate';

import Loading from '../components/Loading';
import CreatePrompt from '../components/CreatePrompt';

import { ReactComponent as Easy } from '../img/easy.svg';
import { ReactComponent as Medium } from '../img/medium.svg';
import { ReactComponent as Hard } from '../img/hard.svg';
import { ReactComponent as Insane } from '../img/insane.svg';

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
         else return <CreatePrompt />;
      }
   }
}

function displayPuzzles(data) {

   const easy = data.filter(puzzle => puzzle.difficulty === 'easy').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const medium = data.filter(puzzle => puzzle.difficulty === 'medium').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const hard = data.filter(puzzle => puzzle.difficulty === 'hard').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));
   const insane = data.filter(puzzle => puzzle.difficulty === 'insane').sort( (a,b) => new Date(b.date_created) - new Date(a.date_created));

   return (
      <div className="page">
         <h1 className="page-title">Browse Puzzles</h1>

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

         {insane.length > 0 &&
         <section className="section">
            <div className="section-title-icon">
               <Insane role="img" aria-label="these are insane puzzles" width="26" height="26" className="section-title-icon__icon" />
               <h2 className="section-title">Insane</h2>
            </div>
            
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
         <span className="text_uppercase">Added on <span className="text_bold">{formatDate(puzzle.date_created, 'M/D/YYYY')}</span></span>
      </li>
   )
}