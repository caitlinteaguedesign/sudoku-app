import { Link } from 'react-router-dom';

export default function CreatePrompt() {
   return (
      <div className="start">
         <p className="start__prompt">{`You don't have any puzzles yet!`}</p>
         <Link to="/create" className="link link_style-outline">Create a puzzle</Link>
      </div>
   )
}