import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
   // const count = 0;

   // if(count>0) return myPuzzles();
   // else return start();

   render() {
      const { user } = this.props.auth;

      return (
         <div className="home__start">
            <p className="home__prompt">{`[${user.name}] doesn't have any puzzles yet!`}</p>
            <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
         </div>
      )
   }
}

// function start() {
//    return (
//       <div className="home__start">
//          <p className="home__prompt">You don’t have any puzzles yet!</p>
//          <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
//       </div>
//    )
// }

// function myPuzzles() {
//    return (
//       <p>There are puzzles!</p>
//    )
// }

Dashboard.propTypes = {
   auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   auth: state.auth
});

export default connect(mapStateToProps)(Dashboard);