import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllRequests, filterRequests } from '../services/requestService';
import RequestCard from '../components/common/RequestCard';
import RequestFilters from '../components/filters/RequestFilters';
import { Plus, RefreshCw } from 'lucide-react';

function RequestsPage() {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAllRequests();
      setRequests(data);
      setFilteredRequests(data);
    } catch (err) {
      setError('Не получилось загрузить заявки, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilters = async (filters) => {
    setIsLoading(true);
    setActiveFilters(filters);
    
    try {
      const filtered = await filterRequests(filters);
      setFilteredRequests(filtered);
    } catch (err) {
      setError('Не получилось загрузить заявки, попробуйте еще раз.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Считаем запросы
  const countActiveFilters = () => {
    return Object.values(activeFilters).filter(value => 
      value !== '' && value !== undefined
    ).length;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Заявки</h1>
          <p className="text-gray-400">Найдите игроков, которые ищут тиммейтов</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          {isAuthenticated && (
            <Link to="/create-request" className="btn btn-secondary">
              <Plus className="h-5 w-5 mr-2" />
              Создать заявку
            </Link>
          )}
          
          <button 
            onClick={loadRequests} 
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
        {/* Фильтры */}
        <div className="lg:col-span-1">
          <RequestFilters onApplyFilters={handleApplyFilters} />
          
          {countActiveFilters() > 0 && (
            <div className="mt-4 bg-dark-700 p-4 rounded-lg border border-dark-600">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Активные фильтры</h3>
                <span className="bg-secondary-600 text-white text-xs px-2 py-1 rounded-full">
                  {countActiveFilters()}
                </span>
              </div>
              <ul className="text-sm text-gray-300">
                {activeFilters.game && (
                  <li className="mb-1">Игра: {activeFilters.game}</li>
                )}
                {activeFilters.searchText && (
                  <li className="mb-1">Поиск: "{activeFilters.searchText}"</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        {/* Сетка запросов */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500"></div>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRequests.map(request => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-700 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Заявок не найдено</h3>
              <p className="text-gray-400 mb-6">
                Ни один запрос не соответствует вашим текущим фильтрам или нет активных запросов.
              </p>
              <button onClick={loadRequests} className="btn btn-secondary">
                <RefreshCw className="h-5 w-5 mr-2" />
                обновить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;