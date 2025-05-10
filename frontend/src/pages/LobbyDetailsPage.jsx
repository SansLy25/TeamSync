import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {getLobbyById, joinLobby, leaveLobby} from '../services/lobbyService';
import {getUserById} from '../services/userService';
import UserAvatar from '../components/common/UserAvatar';
import {
    Clock,
    Monitor,
    Star,
    Users,
    Target,
    Calendar,
    MessageCircle,
    ArrowLeft,
    UserPlus,
    UserMinus,
    User,
    AlertTriangle, AtSign, DiscIcon as BrandDiscord, PoundSterling as BrandSteam
} from 'lucide-react';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';

function LobbyDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentUser, isAuthenticated} = useAuth();
    const [lobby, setLobby] = useState(null);
    const [creator, setCreator] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        loadLobbyDetails();
    }, [id]);

    const loadLobbyDetails = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const lobbyData = await getLobbyById(id);
            setLobby(lobbyData);

            // Получаем информацию о создателе
            const creatorData = await getUserById(lobbyData.creator);
            setCreator(creatorData);

            // Получаем информацию о каждом игроке в лобби
            const playerDataPromises = lobbyData.players.map(playerId =>
                getUserById(playerId)
            );

            const playerData = await Promise.all(playerDataPromises);
            setPlayers(playerData);
        } catch (err) {
            setError('Не удалось загрузить информацию о лобби');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoinLobby = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsJoining(true);

        try {
            const updatedLobby = await joinLobby(id, currentUser.id);
            setLobby(updatedLobby);

            // Добавляем текущего пользователя в список игроков
            setPlayers(prev => [...prev, currentUser]);
        } catch (err) {
            setError(err.message || 'Не удалось присоединиться к лобби');
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeaveLobby = async () => {
        setIsLeaving(true);

        try {
            const updatedLobby = await leaveLobby(id, currentUser.id);

            if (updatedLobby.message) {
                // Лобби было удалено, так как в нем не осталось игроков
                navigate('/lobbies');
                return;
            }

            setLobby(updatedLobby);

            // Удаляем текущего пользователя из списка игроков
            setPlayers(prev => prev.filter(player => player.id !== currentUser.id));
        } catch (err) {
            setError(err.message || 'Не удалось покинуть лобби');
        } finally {
            setIsLeaving(false);
        }
    };

    // Проверяем, находится ли текущий пользователь в лобби
    const isInLobby = () => {
        return currentUser && lobby?.players.includes(currentUser.id);
    };

    // Проверяем, является ли текущий пользователь создателем
    const isCreator = () => {
        return currentUser && lobby?.creator === currentUser.id;
    };

    // Проверяем, заполнено ли лобби
    const isLobbyFull = () => {
        return lobby?.filledSlots >= lobby?.slots;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-error-900 text-error-200 p-6 rounded-lg mb-6">
                    <div className="flex items-center mb-4">
                        <AlertTriangle className="h-6 w-6 mr-2"/>
                        <h2 className="text-xl font-bold">Ошибка</h2>
                    </div>
                    <p>{error}</p>
                    <div className="mt-6">
                        <Link to="/lobbies" className="btn btn-outline">
                            <ArrowLeft className="h-5 w-5 mr-2"/>
                            Назад к списку лобби
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!lobby) {
        return null;
    }

    // Форматируем запланированное время
    const scheduledDate = new Date(lobby.scheduledTime);
    const formattedDate = format(scheduledDate, 'd MMMM yyyy', {locale: ru});
    const formattedTime = format(scheduledDate, 'H:mm', {locale: ru});

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
                <Link to="/lobbies"
                      className="inline-flex items-center text-gray-400 hover:text-primary-400 transition">
                    <ArrowLeft className="h-4 w-4 mr-1"/>
                    <span>Назад</span>
                </Link>
            </div>

            <div className="bg-dark-700 rounded-lg shadow-lg overflow-hidden border border-dark-600">

                <div className="h-40 bg-gradient-to-r from-primary-900 to-secondary-900 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-white px-4 text-center">{lobby.game}</h1>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{lobby.name}</h2>

                    {/* Статус */}
                    <div className="mb-6">
            <span className={`badge ${isLobbyFull() ? 'badge-error' : 'badge-success'} text-sm`}>
              {isLobbyFull() ? 'Заполнено' : 'Открыто'}
            </span>
                        <span className="badge badge-secondary ml-2 text-sm">{lobby.game}</span>
                        <span className="badge badge-primary ml-2 text-sm">{lobby.platform}</span>
                    </div>

                    {/* Информация о создателе */}
                    <div className="flex items-center mb-6 p-3 bg-dark-600 rounded-lg">
                        <UserAvatar src={creator?.avatar} size="md"/>
                        <div className="ml-3">
                            <p className="font-medium">{creator?.username || 'Неизвестный пользователь'}</p>
                            <p className="text-sm text-gray-400">Создатель</p>
                        </div>
                    </div>

                    {/* Основная информация о лобби */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center p-3 bg-dark-800 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-400">Дата</p>
                                <p className="font-medium">{formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-dark-800 rounded-lg">
                            <Clock className="h-5 w-5 text-primary-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-400">Время</p>
                                <p className="font-medium">{formattedTime}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-dark-800 rounded-lg">
                            <Monitor className="h-5 w-5 text-primary-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-400">Платформа</p>
                                <p className="font-medium">{lobby.platform}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-dark-800 rounded-lg">
                            <Star className="h-5 w-5 text-primary-400 mr-3"/>
                            <div>
                                <p className="text-sm text-gray-400">Уровень навыка</p>
                                <div className="flex items-center">
                                    <p className="font-medium mr-2">{lobby.skillLevel}/10</p>
                                    <div className="flex">
                                        {[...Array(10)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 h-3 mx-px rounded-sm ${
                                                    i < lobby.skillLevel ? 'bg-primary-500' : 'bg-dark-500'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Цель */}
                    <div className="mb-6">
                        <div className="flex items-center mb-2">
                            <Target className="h-5 w-5 text-primary-400 mr-2"/>
                            <h3 className="text-lg font-semibold">Цель</h3>
                        </div>
                        <p className="text-gray-300 pl-7">{lobby.goal}</p>
                    </div>

                    {/* Описание */}
                    {lobby.description && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Описание</h3>
                            <p className="text-gray-300 whitespace-pre-line">{lobby.description}</p>
                        </div>
                    )}

                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-semibold border-dark-500">Контакты</h2>
                        <div className="flex flex-column gap-16">
                            <div>
                                <label htmlFor="contacts.telegram" className="label">Telegram</label>
                                {creator.contacts?.telegram ? creator.contacts?.telegram : "Не указан"}
                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400"/>
                            </div>

                            <div>
                                <label htmlFor="contacts.discord" className="label">Discord</label>
                                {creator.contacts?.discord ? creator.contacts?.discord : "Не указан"}
                                <BrandDiscord
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400"/>
                            </div>

                            <div>
                                <label htmlFor="contacts.steam" className="label">Steam</label>
                                {creator.contacts?.steam ? creator.contacts?.steam : "Не указан"}
                                <BrandSteam
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-400"/>
                            </div>
                        </div>
                    </div>

                    {/* Секция игроков */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-primary-400 mr-2"/>
                                <h3 className="text-lg font-semibold">Игроки</h3>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-primary-400">{lobby.filledSlots}</span>
                                <span className="text-gray-400">/{lobby.slots}</span>
                            </div>
                        </div>

                        {/* Визуализация слотов игроков */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {players.map(player => (
                                <div key={player.id} className="bg-dark-600 p-3 rounded-lg flex flex-col items-center">
                                    <UserAvatar src={player.avatar} size="md"/>
                                    <p className="mt-2 font-medium text-sm truncate w-full text-center">
                                        {player.username}
                                    </p>
                                    {player.id === lobby.creator && (
                                        <span className="text-xs text-primary-400 mt-1">Создатель</span>
                                    )}
                                </div>
                            ))}

                            {/* Пустые слоты */}
                            {[...Array(lobby.slots - lobby.filledSlots)].map((_, i) => (
                                <div key={`empty-${i}`}
                                     className="bg-dark-800 p-3 rounded-lg border border-dashed border-dark-500 flex flex-col items-center justify-center min-h-[96px]">
                                    <User className="h-8 w-8 text-gray-600"/>
                                    <p className="mt-2 text-sm text-gray-500">Свободный слот</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {isAuthenticated ? (
                            isInLobby() ? (
                                isCreator() ? (
                                    <button
                                        className="btn btn-ghost text-error-400"
                                        disabled={true}
                                    >
                                        <AlertTriangle className="h-5 w-5 mr-2"/>
                                        Вы создатель
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-outline text-error-400 border-error-400 hover:bg-error-400 hover:text-white"
                                        onClick={handleLeaveLobby}
                                        disabled={isLeaving}
                                    >
                                        {isLeaving ? (
                                            <div className="flex items-center">
                                                <div
                                                    className="w-5 h-5 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2"></div>
                                                <span>Выходим...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <UserMinus className="h-5 w-5 mr-2"/>
                                                Покинуть лобби
                                            </>
                                        )}
                                    </button>
                                )
                            ) : (
                                // Кнопка присоединения, если пользователь не в лобби
                                <button
                                    className="btn btn-primary"
                                    onClick={handleJoinLobby}
                                    disabled={isLobbyFull() || isJoining}
                                >
                                    {isJoining ? (
                                        <div className="flex items-center">
                                            <div
                                                className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                            <span>Присоединяемся...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UserPlus className="h-5 w-5 mr-2"/>
                                            {isLobbyFull() ? 'Лобби заполнено' : 'Присоединиться'}
                                        </>
                                    )}
                                </button>
                            )
                        ) : (
                            // Кнопка входа, если пользователь не аутентифицирован
                            <Link to="/login" className="btn btn-primary">
                                <User className="h-5 w-5 mr-2"/>
                                Войдите, чтобы присоединиться
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LobbyDetailsPage;