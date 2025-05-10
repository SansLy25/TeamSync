import { Link } from 'react-router-dom';
import { Clock, Users, Star, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

function LobbyCard({ lobby }) {
  console.log(lobby)
  const { id, name, game, platform, slots, filledSlots, scheduledTime, skillLevel, goal } = lobby;
  console.log(scheduledTime)
  console.log(typeof scheduledTime)


  const formattedTime = format(scheduledTime, 'dd MMMM yyyy - HH:mm', { locale: ru});

  const remainingSlots = slots - filledSlots;
  
  return (
    <div className="card hover:scale-[1.01] transition-all duration-300">
      <div className="relative">

        <div className="h-32 bg-gradient-to-r from-primary-900 to-secondary-900 flex items-center justify-center">
          <h3 className="text-xl font-bold text-white">{game}</h3>
        </div>

        <div className={`absolute top-2 right-2 badge ${remainingSlots > 0 ? 'badge-success' : 'badge-error'}`}>
          {remainingSlots > 0 ? 'Open' : 'Full'}
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-2">{name}</h2>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-300">
            <Clock className="h-4 w-4 mr-2 text-primary-400" />
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Monitor className="h-4 w-4 mr-2 text-primary-400" />
            <span>{platform}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Users className="h-4 w-4 mr-2 text-primary-400" />
            <span>{filledSlots}/{slots} игроков</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-300">
            <Star className="h-4 w-4 mr-2 text-primary-400" />
            <span>Уровень игры: {skillLevel}/10</span>
          </div>
        </div>
        
        {/* Цель */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-1">Цель:</h4>
          <p className="text-sm text-white">{goal}</p>
        </div>
        
        {/* Слоты игроков */}
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(slots)].map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full flex-1 ${
                i < filledSlots ? 'bg-primary-500' : 'bg-dark-500'
              }`}
            ></div>
          ))}
        </div>
        
        {/* Кнопка действия */}
        <Link
          to={`/lobbies/${id}`}
          className="btn btn-primary w-full"
        >
          Посмотреть
        </Link>
      </div>
    </div>
  );
}

export default LobbyCard;