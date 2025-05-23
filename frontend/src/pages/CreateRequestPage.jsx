import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {createRequest} from '../services/requestService';
import {GamepadIcon, FileText} from 'lucide-react';
import {createGame, getGames} from "../services/gameService.js";


function CreateRequestPage() {
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const [formData, setFormData] = useState({
        game: '',
        otherGame: '',
        description: '',
        preferences: ''
    });
    const [errors, setErrors] = useState({});
    const [otherGame, setOtherGame] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showOtherGame, setShowOtherGame] = useState(false);
    const [gameOptions, setGameOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const games = await getGames();
                if (isMounted) {
                    setGameOptions(games);
                }
            } catch (error) {
                console.error('Ошибка загрузки игр:', error);
                if (isMounted) {
                    setGameOptions([]);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === 'game') {
            if (value === 'Другая') {
                setShowOtherGame(true);
            } else {
                setShowOtherGame(false)
            }

        }

        if (name === 'otherGame') {
            setOtherGame(value)
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.game) {
            newErrors.game = 'Игра обязательна';
        } else if (formData.game === 'Добавить свою' && !formData.otherGame.trim()) {
            newErrors.otherGame = 'Уточните игру';
        }

        if (showOtherGame && !otherGame.trim()) {
            newErrors.otherGame = 'Уточните игру'
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Требуется описание';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Описание должно быть не менее 20 символов.';
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

            const actualGame = formData.game;
            let gameId

            if (showOtherGame) {
                gameId = (await createGame(otherGame)).id;
            } else {
                gameId = gameOptions.find((game) => game.name === actualGame).id;
            }

            const requestData = {
                game_id: gameId,
                description: formData.description,
                details: formData.preferences
            };

            await createRequest(requestData);
            navigate(`/requests`);
        } catch (error) {
            setErrors({form: 'Не удалось создать заявку. Попробуйте еще раз.'});
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-dark-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-center">Создание заявки</h1>

            {errors.form && (
                <div className="bg-error-900 text-error-200 p-3 rounded-md mb-4">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="game" className="label">Игра</label>
                        <div className="relative">
                            <select
                                id="game"
                                name="game"
                                value={formData.game}
                                onChange={handleChange}
                                className={`select pl-10 ${errors.game ? 'border-error-500' : ''}`}
                            >
                                <option value="">Выберите игру</option>
                                <option value="Другая">Добавить свою</option>
                                {gameOptions.map(game => (
                                    <option key={game.id} value={game.name}>{game.name}</option>
                                ))}
                            </select>
                            <GamepadIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                        {errors.game && <p className="text-error-400 text-sm mt-1">{errors.game}</p>}
                    </div>

                    {showOtherGame && (
                        <div>
                            <label htmlFor="otherGame" className="label">Укажите игру</label>
                            <input
                                type="text"
                                id="otherGame"
                                name="otherGame"
                                value={formData.otherGame}
                                onChange={handleChange}
                                className={`input ${errors.otherGame ? 'border-error-500' : ''}`}
                                placeholder="Введите свою игру"
                            />
                            {errors.otherGame && <p className="text-error-400 text-sm mt-1">{errors.otherGame}</p>}
                        </div>
                    )}

                    <div>
                        <label htmlFor="description" className="label">Описание</label>
                        <div className="relative">
              <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`input pl-10 ${errors.description ? 'border-error-500' : ''}`}
                  placeholder="Опишите, какого товарища по команде вы ищете, ваш стиль игры, цели и т. д."
              ></textarea>
                            <FileText className="absolute left-3 top-4 h-5 w-5 text-gray-400"/>
                        </div>
                        {errors.description && <p className="text-error-400 text-sm mt-1">{errors.description}</p>}
                        <p className="text-gray-400 text-xs mt-1">Минимум 20 символов</p>
                    </div>

                    <div>
                        <label htmlFor="preferences" className="label">Детали (необязательно)</label>
                        <textarea
                            id="preferences"
                            name="preferences"
                            value={formData.preferences}
                            onChange={handleChange}
                            rows="3"
                            className="input"
                            placeholder="Конкретные предпочтения для членов команды (например необходимый микрофон, возрастной диапазон, уровень навыков и т. д.)"
                        ></textarea>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="btn btn-secondary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                <span>Создание заявки...</span>
                            </div>
                        ) : (
                            'Создать заявку'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateRequestPage;