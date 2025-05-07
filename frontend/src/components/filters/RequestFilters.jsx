import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const popularGames = [
  'Apex Legends',
  'Call of Duty',
  'Counter-Strike',
  'Dota 2',
  'Fortnite',
  'League of Legends',
  'Minecraft',
  'Valorant'
];

function RequestFilters({ onApplyFilters }) {
  const [filters, setFilters] = useState({
    game: '',
    searchText: ''
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGameSelect = (game) => {
    setFilters(prev => ({ ...prev, game }));
  };
  
  const handleReset = () => {
    setFilters({
      game: '',
      searchText: ''
    });
    onApplyFilters({
      game: '',
      searchText: ''
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };
  
  return (
    <div className="bg-dark-700 rounded-lg shadow-md border border-dark-600">
      {/* Мобильные фильтры */}
      <div className="md:hidden p-4 flex justify-between items-center">
        <button 
          className="btn btn-ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-5 w-5 mr-2" />
          <span>Фильтры</span>
        </button>
        
        {Object.values(filters).some(val => val !== '') && (
          <button 
            className="btn btn-ghost text-error-400"
            onClick={handleReset}
          >
            <X className="h-5 w-5 mr-1" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4`}>
        <form onSubmit={handleSubmit}>
          {/* Поиск */}
          <div className="mb-4">
            <label htmlFor="searchText" className="label">Поиск</label>
            <div className="relative">
              <input
                type="text"
                id="searchText"
                name="searchText"
                value={filters.searchText}
                onChange={handleChange}
                placeholder="Поиск в описании..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Игра */}
          <div className="mb-4">
            <label htmlFor="game" className="label">Игра</label>
            <div className="relative">
              <input
                type="text"
                id="game"
                name="game"
                value={filters.game}
                onChange={handleChange}
                placeholder="Поиск по игре..."
                className="input pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Популярные игры */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Популярные игры</h3>
            <div className="flex flex-wrap gap-2">
              {popularGames.map(game => (
                <button
                  key={game}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-full ${
                    filters.game === game
                      ? 'bg-secondary-600 text-white'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  }`}
                  onClick={() => handleGameSelect(game)}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>
          
          {/* Фильтры */}
          <div className="flex gap-2">
            <button type="submit" className="btn btn-secondary flex-1">
              Применить
            </button>
            <button 
              type="button" 
              onClick={handleReset}
              className="btn btn-ghost"
            >
             Сбросить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestFilters;