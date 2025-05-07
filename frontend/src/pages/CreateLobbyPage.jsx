import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createLobby } from '../services/lobbyService';
import { Calendar, Clock, Users, Monitor, Star, Target, FileText } from 'lucide-react';

const gameOptions = [
  'Apex Legends',
  'Call of Duty: Warzone',
  'Counter-Strike 2',
  'Dota 2',
  'Fortnite',
  'League of Legends',
  'Minecraft',
  'Overwatch 2',
  'PUBG',
  'Rocket League',
  'Valorant',
  'Other'
];

const platformOptions = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
  'Mobile',
  'Cross-platform'
];

function CreateLobbyPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    game: '',
    otherGame: '',
    platform: '',
    slots: 2,
    scheduledDate: '',
    scheduledTime: '',
    skillLevel: 5,
    goal: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherGame, setShowOtherGame] = useState(false);

  // Create date string for today in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'game') {
      setShowOtherGame(value === 'Other');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Lobby name is required';
    }
    
    if (!formData.game) {
      newErrors.game = 'Game is required';
    } else if (formData.game === 'Other' && !formData.otherGame.trim()) {
      newErrors.otherGame = 'Please specify the game';
    }
    
    if (!formData.platform) {
      newErrors.platform = 'Platform is required';
    }
    
    if (!formData.scheduledDate) {
      newErrors.scheduledDate = 'Date is required';
    }
    
    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Time is required';
    }
    
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Combine date and time to create a datetime
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      
      // Determine the actual game (either from list or other)
      const actualGame = formData.game === 'Other' ? formData.otherGame : formData.game;
      
      const lobbyData = {
        name: formData.name,
        game: actualGame,
        platform: formData.platform,
        slots: parseInt(formData.slots),
        creator: currentUser.id,
        scheduledTime: scheduledDateTime.toISOString(),
        skillLevel: parseInt(formData.skillLevel),
        goal: formData.goal,
        description: formData.description
      };
      
      const newLobby = await createLobby(lobbyData);
      navigate(`/lobbies/${newLobby.id}`);
    } catch (error) {
      setErrors({ form: 'Failed to create lobby. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-dark-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a Gaming Lobby</h1>
      
      {errors.form && (
        <div className="bg-error-900 text-error-200 p-3 rounded-md mb-4">
          {errors.form}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Basic Information</h2>
          
          <div>
            <label htmlFor="name" className="label">Lobby Name</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input pl-10 ${errors.name ? 'border-error-500' : ''}`}
                placeholder="Give your lobby a name"
              />
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.name && <p className="text-error-400 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="game" className="label">Game</label>
              <div className="relative">
                <select
                  id="game"
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  className={`select ${errors.game ? 'border-error-500' : ''}`}
                >
                  <option value="">Select Game</option>
                  {gameOptions.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>
              {errors.game && <p className="text-error-400 text-sm mt-1">{errors.game}</p>}
            </div>
            
            {showOtherGame && (
              <div>
                <label htmlFor="otherGame" className="label">Specify Game</label>
                <input
                  type="text"
                  id="otherGame"
                  name="otherGame"
                  value={formData.otherGame}
                  onChange={handleChange}
                  className={`input ${errors.otherGame ? 'border-error-500' : ''}`}
                  placeholder="Enter game name"
                />
                {errors.otherGame && <p className="text-error-400 text-sm mt-1">{errors.otherGame}</p>}
              </div>
            )}
            
            <div>
              <label htmlFor="platform" className="label">Platform</label>
              <div className="relative">
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className={`select ${errors.platform ? 'border-error-500' : ''}`}
                >
                  <option value="">Select Platform</option>
                  {platformOptions.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              {errors.platform && <p className="text-error-400 text-sm mt-1">{errors.platform}</p>}
            </div>
            
            <div>
              <label htmlFor="slots" className="label">Number of Players (including you)</label>
              <div className="relative">
                <select
                  id="slots"
                  name="slots"
                  value={formData.slots}
                  onChange={handleChange}
                  className="select"
                >
                  {[2, 3, 4, 5, 6, 8, 10].map(num => (
                    <option key={num} value={num}>{num} players</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Schedule Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduledDate" className="label">Date</label>
              <div className="relative">
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  min={today}
                  className={`input pl-10 ${errors.scheduledDate ? 'border-error-500' : ''}`}
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.scheduledDate && <p className="text-error-400 text-sm mt-1">{errors.scheduledDate}</p>}
            </div>
            
            <div>
              <label htmlFor="scheduledTime" className="label">Time</label>
              <div className="relative">
                <input
                  type="time"
                  id="scheduledTime"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.scheduledTime ? 'border-error-500' : ''}`}
                />
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {errors.scheduledTime && <p className="text-error-400 text-sm mt-1">{errors.scheduledTime}</p>}
            </div>
          </div>
        </div>
        
        {/* Секция зависимостей */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Requirements</h2>
          
          <div>
            <label htmlFor="skillLevel" className="label">Required Skill Level (1-10)</label>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-gray-400" />
              <input
                type="range"
                id="skillLevel"
                name="skillLevel"
                min="1"
                max="10"
                value={formData.skillLevel}
                onChange={handleChange}
                className="flex-1 h-2 bg-dark-500 rounded-lg appearance-none cursor-pointer"
              />
              <span className="bg-primary-500 text-white px-2 py-1 rounded-md text-sm w-8 text-center">
                {formData.skillLevel}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="goal" className="label">Goal</label>
            <div className="relative">
              <input
                type="text"
                id="goal"
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className={`input pl-10 ${errors.goal ? 'border-error-500' : ''}`}
                placeholder="What do you want to achieve? (e.g., Rank up, Complete missions)"
              />
              <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.goal && <p className="text-error-400 text-sm mt-1">{errors.goal}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="label">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input"
              placeholder="Additional details about your lobby, requirements, etc."
            ></textarea>
          </div>
        </div>
        
        <div>
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Создание лобби...</span>
              </div>
            ) : (
              'Создать лобби'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateLobbyPage;