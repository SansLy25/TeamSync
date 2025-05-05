import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, GamepadIcon, Home, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-800 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Лого */}
          <Link to="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-white">TeamSync</span>
          </Link>

          {/* ПК навигация */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 hover:text-primary-400 transition ${
                location.pathname === '/' ? 'text-primary-400' : 'text-gray-300'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Главная</span>
            </Link>
            <Link 
              to="/lobbies" 
              className={`flex items-center space-x-1 hover:text-primary-400 transition ${
                location.pathname === '/lobbies' ? 'text-primary-400' : 'text-gray-300'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Лобби</span>
            </Link>
            <Link 
              to="/requests" 
              className={`flex items-center space-x-1 hover:text-primary-400 transition ${
                location.pathname === '/requests' ? 'text-primary-400' : 'text-gray-300'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>Заявки</span>
            </Link>
          </nav>

          {/* Меню пользователя или профиль */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="btn btn-ghost">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{currentUser.username}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-ghost text-gray-300">
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn btn-ghost">Войти</Link>
                <Link to="/register" className="btn btn-primary">Регистрация</Link>
              </div>
            )}
          </div>

          {/* Кнопка мобильного меню */}
          <button
            className="md:hidden text-gray-300 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Мобильное меню */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-dark-700 rounded-lg p-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  location.pathname === '/' ? 'bg-dark-600 text-primary-400' : 'text-gray-300'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Главная</span>
              </Link>
              <Link 
                to="/lobbies" 
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  location.pathname === '/lobbies' ? 'bg-dark-600 text-primary-400' : 'text-gray-300'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Лобби</span>
              </Link>
              <Link 
                to="/requests" 
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  location.pathname === '/requests' ? 'bg-dark-600 text-primary-400' : 'text-gray-300'
                }`}
              >
                <Search className="h-5 w-5" />
                <span>Заявки</span>
              </Link>
              
              <div className="border-t border-dark-500 pt-2">
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 p-2 rounded-md text-gray-300"
                    >
                      <User className="h-5 w-5" />
                      <span>Профиль</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center space-x-2 p-2 rounded-md text-gray-300 w-full text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Выйти</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link to="/login" className="btn btn-ghost justify-start">Войти</Link>
                    <Link to="/register" className="btn btn-primary justify-start">Регистрация</Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;