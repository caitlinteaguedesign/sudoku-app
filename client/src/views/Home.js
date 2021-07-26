import {Link} from 'react-router-dom';

function Home() {
   const count = 0;

   if(count>0) return myPuzzles();
   else return start();
}

function start() {
   return (
      <div className="home__start">
         <p className="home__prompt">You don’t have any puzzles yet!</p>
         <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
      </div>
   )
}

function myPuzzles() {
   return (
      <p>There are puzzles!</p>
   )
}

export default Home;