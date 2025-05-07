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

const platforms = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile',
  'Cross-platform'
];

function LobbyFilters({ onApplyFilters }) {
  const [filters, setFilters] = useState({
    game: '',
    platform: '',
    minSkill: '',
    maxSkill: '',
    hasSlots: true
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleGameSelect = (game) => {
    setFilters(prev => ({ ...prev, game }));
  };
  
  const handlePlatformSelect = (platform) => {
    setFilters(prev => ({ ...prev, platform }));
  };
  
  const handleReset = () => {
    setFilters({
      game: '',
      platform: '',
      minSkill: '',
      maxSkill: '',
      hasSlots: true
    });
    onApplyFilters({
      game: '',
      platform: '',
      minSkill: '',
      maxSkill: '',
      hasSlots: true
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
      <div className="md:hidden p-4 flex justify-between items-center">
        <button 
          className="btn btn-ghost"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </button>
        
        {Object.values(filters).some(val => val !== '' && val !== false) && (
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

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Популярные игры</h3>
            <div className="flex flex-wrap gap-2">
              {popularGames.map(game => (
                <button
                  key={game}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-full ${
                    filters.game === game
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  }`}
                  onClick={() => handleGameSelect(game)}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>
          
          {/* Платформа */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Платформа</h3>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(platform => (
                <button
                  key={platform}
                  type="button"
                  className={`px-2 py-1 text-xs rounded-md ${
                    filters.platform === platform
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
                  }`}
                  onClick={() => handlePlatformSelect(platform)}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Навык игры (1-10)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minSkill" className="label">Мин</label>
                <input
                  type="number"
                  id="minSkill"
                  name="minSkill"
                  min="1"
                  max="10"
                  value={filters.minSkill}
                  onChange={handleChange}
                  className="input"
                  placeholder="1"
                />
              </div>
              <div>
                <label htmlFor="maxSkill" className="label">Макс</label>
                <input
                  type="number"
                  id="maxSkill"
                  name="maxSkill"
                  min="1"
                  max="10"
                  value={filters.maxSkill}
                  onChange={handleChange}
                  className="input"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="hasSlots"
              name="hasSlots"
              checked={filters.hasSlots}
              onChange={handleChange}
              className="checkbox"
            />
            <label htmlFor="hasSlots" className="ml-2 text-sm text-gray-300">
              Показать только лобби с открытыми слотами
            </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary flex-1">
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

export default LobbyFilters;