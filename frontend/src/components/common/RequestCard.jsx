import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

function RequestCard({ request }) {
  const { id, creator, game, description, createdAt, creatorUsername } = request;

  const formattedDate = format(new Date(createdAt), 'MMM dd, yyyy');
  
  return (
    <div className="card hover:scale-[1.01] transition-all duration-300">
      <div className="p-4">
        <div className="mb-3">
          <span className="badge badge-secondary">{game}</span>
        </div>

        <div className="mb-4">
          <p className="text-gray-300 line-clamp-3">{description}</p>
        </div>
        
        {/* Доп инфа */}
        <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{creatorUsername}</span>
          </div>
        </div>
        
        {/* Активные кнопки */}
        <Link
          to={`/requests/${id}`}
          className="btn btn-secondary w-full"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default RequestCard;