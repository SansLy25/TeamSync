import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {getRequestById} from '../services/requestService';
import {getUserById} from '../services/userService';
import UserAvatar from '../components/common/UserAvatar';
import {Calendar, ArrowLeft, Trash2, Share2, Mail, AlertTriangle, MessageCircle, GamepadIcon} from 'lucide-react';
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';


function RequestDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {currentUser} = useAuth();
    const [request, setRequest] = useState(null);
    const [creator, setCreator] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        loadRequestDetails();
    }, [id]);

    const loadRequestDetails = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const requestData = await getRequestById(id);
            setRequest(requestData);

            // Получаем информацию о создателе
            const creatorData = await getUserById(requestData.creator);
            setCreator(creatorData);
        } catch (err) {
            setError('Не удалось загрузить детали заявки. Возможно, запрос больше не существует.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteRequest = async () => {
        setIsDeleting(true);

        try {
            navigate('/requests');
        } catch (err) {
            setError('Не удалось удалить заявку. Пожалуйста, попробуйте снова.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    // Проверяем, является ли текущий пользователь создателем
    const isCreator = () => {
        return currentUser && request?.creator === currentUser.id;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-500"></div>
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
                        <Link to="/requests" className="btn btn-outline">
                            <ArrowLeft className="h-5 w-5 mr-2"/>
                            Назад к заявкам
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!request) {
        return null;
    }

    // Форматируем дату создания
    const createdDate = new Date(request.createdAt);
    const formattedDate = format(createdDate, 'd MMMM yyyy', {locale: ru});

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6">
                <Link to="/requests"
                      className="inline-flex items-center text-gray-400 hover:text-secondary-400 transition">
                    <ArrowLeft className="h-4 w-4 mr-1"/>
                    <span>Назад к заявкам</span>
                </Link>
            </div>

            <div className="bg-dark-700 rounded-lg shadow-lg overflow-hidden border border-dark-600">
                <div className="p-6">
                    {/* Бейдж игры */}
                    <div className="flex items-center mb-6">
                        <div className="h-12 w-12 bg-secondary-900 rounded-full flex items-center justify-center mr-4">
                            <GamepadIcon className="h-6 w-6 text-secondary-400"/>
                        </div>
                        <div>
                            <span className="badge badge-secondary mb-1">{request.game}</span>
                            <h2 className="text-2xl font-bold">Заявка</h2>
                        </div>
                    </div>

                    {/* Информация о создателе */}
                    <div className="flex items-center mb-6 p-3 bg-dark-600 rounded-lg">
                        <UserAvatar src={creator?.avatar} size="md"/>
                        <div className="ml-3">
                            <p className="font-medium">{creator?.username || 'Неизвестный пользователь'}</p>
                            <p className="text-sm text-gray-400">Создатель заявки</p>
                        </div>

                    </div>

                    {/* Описание заявки */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Описание</h3>
                        <p className="text-gray-300 whitespace-pre-line">{request.description}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-semibold border-dark-500">Контакты</h2>
                        <div className="flex flex-column gap-16">
                            <div>
                                <label htmlFor="contacts.telegram" className="label">Telegram</label>
                                {creator.contacts?.telegram ? creator.contacts?.telegram : "Не указан"}
                            </div>

                            <div>
                                <label htmlFor="contacts.discord" className="label">Discord</label>
                                {creator.contacts?.discord ? creator.contacts?.discord : "Не указан"}
                            </div>

                            <div>
                                <label htmlFor="contacts.steam" className="label">Steam</label>
                                {creator.contacts?.steam ? creator.contacts?.steam : "Не указан"}
                            </div>
                        </div>
                    </div>

                    {/* Предпочтения */}
                    {request.preferences && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Предпочтения</h3>
                            <div className="bg-dark-800 p-4 rounded-lg">
                                <p className="text-gray-300">{request.preferences}</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default RequestDetailsPage;