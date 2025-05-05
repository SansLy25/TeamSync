import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка на заполнение полей
    if (!credentials.username.trim() || !credentials.password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(credentials.username, credentials.password);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Неправильные имя пользователя или пароль');
      }
    } catch (err) {
      setError('Произошла ошибка при входе. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для демонстрационного входа
  const handleDemoLogin = async () => {
    setIsLoading(true);

    try {
      const result = await login('john_gamer', 'password123');

      if (result.success) {
        navigate('/');
      } else {
        setError('Демо-вход не удался. Попробуйте войти вручную.');
      }
    } catch (err) {
      setError('Произошла ошибка при входе в демо-версию.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="max-w-md mx-auto bg-dark-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-center">Войдите в аккаунт</h1>

        {error && (
            <div className="bg-error-900 text-error-200 p-3 rounded-md mb-4">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="label">Имя пользователя</label>
            <div className="relative">
              <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Введите имя пользователя"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="label">Пароль</label>
            <div className="relative">
              <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="Введите пароль"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
          >
            {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  <span>Входим...</span>
                </div>
            ) : (
                'Вход'
            )}
          </button>

          <div className="text-center text-gray-400">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
  );
}

export default LoginPage;