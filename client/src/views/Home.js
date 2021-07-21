export default function Home() {
   const count = 0;

   if(count>0) return myPuzzles();
   else return start();
}

function start() {

   return (
      <div className="home__start">
         <p className="home__prompt">You don’t have any puzzles yet!</p>
         <button type="button" className="button button_style-outline">Create a puzzle</button>
      </div>
   )

}

function myPuzzles() {
   return (
      <p>There are puzzles!</p>
   )
}
