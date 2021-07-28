import { useParams } from 'react-router-dom';

export default function Puzzle() {
   const { id } = useParams();

   return (
      <div>
         View Puzzle <strong>{id}</strong> 
      </div>
   )
}