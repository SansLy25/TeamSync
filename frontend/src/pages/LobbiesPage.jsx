import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllLobbies, filterLobbies } from '../services/lobbyService';
import LobbyCard from '../components/common/LobbyCard';
import LobbyFilters from '../components/filters/LobbyFilters';
import { Plus, RefreshCw } from 'lucide-react';

function LobbiesPage() {
  const { isAuthenticated } = useAuth();
  const [lobbies, setLobbies] = useState([]);
  const [filteredLobbies, setFilteredLobbies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    loadLobbies();
  }, []);

  const loadLobbies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAllLobbies();
      setLobbies(data);
      setFilteredLobbies(data);
      console.log(data)
    } catch (err) {
      setError('Не удалось загрузить лобби. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = async (filters) => {
    setIsLoading(true);
    setActiveFilters(filters);
    
    try {
      const filtered = await filterLobbies(filters);
      console.log(filtered)
      setFilteredLobbies(filtered);
    } catch (err) {
      setError('Не удалось применить фильтры. Попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Считаем активные фильтры
  const countActiveFilters = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== undefined && value !== false
    ).length;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Игровые Лобби</h1>
          <p className="text-gray-400">Найдите идеальную игровую сессию, к которой можно присоединиться</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          {isAuthenticated && (
            <Link to="/create-lobby" className="btn btn-primary">
              <Plus className="h-5 w-5 mr-2" />
              Создать Лобби
            </Link>
          )}
          
          <button 
            onClick={loadLobbies} 
            className="btn btn-ghost"
            disabled={isLoading}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-error-900 text-error-200 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Панель с фильтрами */}
        <div className="lg:col-span-1">
          <LobbyFilters onApplyFilters={handleApplyFilters} />
          
          {countActiveFilters() > 0 && (
            <div className="mt-4 bg-dark-700 p-4 rounded-lg border border-dark-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Активные фильтры</h3>
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {countActiveFilters()}
                </span>
              </div>
              <ul className="text-sm text-gray-300">
                {activeFilters.game && (
                  <li className="mb-1">Игра: {activeFilters.game}</li>
                )}
                {activeFilters.platform && (
                  <li className="mb-1">Платформа: {activeFilters.platform}</li>
                )}
                {activeFilters.minSkill && (
                  <li className="mb-1">Мин Навык: {activeFilters.minSkill}</li>
                )}
                {activeFilters.maxSkill && (
                  <li className="mb-1">Макс Навык: {activeFilters.maxSkill}</li>
                )}
                {activeFilters.hasSlots && (
                  <li className="mb-1">Только открытые</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* Сетка лобби */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredLobbies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLobbies.map(lobby => (
                <LobbyCard
                  key={lobby.id}
                  lobby={lobby}
                />
              ))}
            </div>
          ) : (
            <div className="bg-dark-700 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold mb-2">
                Лобби не найдено</h3>
              <p className="text-gray-400 mb-6">
                Ни одно лобби не соответствует вашим текущим фильтрам или активных лобби нет.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LobbiesPage;