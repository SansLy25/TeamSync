import {useState, useEffect} from 'react';
import {useAuth} from '../contexts/AuthContext';
import {getUserById, updateUserProfile} from '../services/userService';
import {getLobbyById, getMyLobbies} from '../services/lobbyService';
import {getRequestsByCreator} from '../services/requestService';
import UserAvatar from '../components/common/UserAvatar';
import LobbyCard from '../components/common/LobbyCard';
import RequestCard from '../components/common/RequestCard';
import {User, Mail, Edit, AtSign, DiscIcon as BrandDiscord, PoundSterling as BrandSteam, Check} from 'lucide-react';

function ProfilePage() {
    const {currentUser} = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [joinedLobbies, setJoinedLobbies] = useState([]);
    const [userRequests, setUserRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('lobbies'); // 'lobbies' or 'requests'

    useEffect(() => {
        loadUserData();
    }, [currentUser]);

    const loadUserData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const profile = await getUserById(currentUser.id);
            setUserProfile(profile);
            const lobbiesData = await getMyLobbies();
            setJoinedLobbies(lobbiesData)
            const requests = await getRequestsByCreator(currentUser.id);
            setUserRequests(requests);
        } catch (err) {
            setError('Не удалось загрузить данные профиля. Попробуйте еще раз.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="bg-error-900 text-error-200 p-4 rounded-md">
                Не удалось загрузить данные профиля. Попробуйте обновить страницу.
            </div>
        );
    }
    let gender = userProfile.gender || 'male'
    gender = gender === "male" ? "Мужчина" : "Женщина"

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {error && (
                <div className="bg-error-900 text-error-200 p-4 rounded-md mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Карточка профиля */}
                <div className="md:col-span-1">
                    <div className="bg-dark-700 rounded-lg shadow-md border border-dark-600 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <UserAvatar src={userProfile.avatar} size="xl"/>
                                <h2 className="text-xl font-bold mt-4">{userProfile.username}</h2>
                                <p className="text-gray-400 capitalize">{gender}</p>

                                <div className="w-full mt-6">
                                    {!isEditing ? (
                                        <>
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-gray-300 mb-2">О Себе</h3>
                                                <p className="text-gray-300 break-words">{userProfile.bio || 'Не указано.'}</p>
                                            </div>

                                            {/* Контакты */}
                                            <div className="space-y-2 mt-4">
                                                <h3 className="text-sm font-medium text-gray-300 mb-2">Контакты</h3>

                                                {userProfile.contacts?.telegram && (
                                                    <div className="flex items-center text-sm">
                                                        <AtSign className="h-4 w-4 text-gray-400 mr-2"/>
                                                        <span
                                                            className="text-gray-300">{userProfile.contacts.telegram}</span>
                                                    </div>
                                                )}

                                                {userProfile.contacts?.discord && (
                                                    <div className="flex items-center text-sm">
                                                        <BrandDiscord className="h-4 w-4 text-gray-400 mr-2"/>
                                                        <span
                                                            className="text-gray-300">{userProfile.contacts.discord}</span>
                                                    </div>
                                                )}

                                                {userProfile.contacts?.steam && (
                                                    <div className="flex items-center text-sm">
                                                        <BrandSteam className="h-4 w-4 text-gray-400 mr-2"/>
                                                        <span
                                                            className="text-gray-300">{userProfile.contacts.steam}</span>
                                                    </div>
                                                )}

                                                {!userProfile.contacts?.telegram && !userProfile.contacts?.discord && !userProfile.contacts?.steam && (
                                                    <p className="text-gray-400 text-sm">Нет указана.</p>
                                                )}
                                            </div>

                                        </>
                                    ) : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Лобби и запросы */}
                <div className="md:col-span-2">
                    <div className="bg-dark-700 rounded-lg shadow-md border border-dark-600 overflow-hidden">
                        <div className="flex border-b border-dark-600">
                            <button
                                className={`flex-1 py-3 px-4 font-medium text-center ${
                                    activeTab === 'lobbies'
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('lobbies')}
                            >
                                Мои активные лобби
                            </button>
                            <button
                                className={`flex-1 py-3 px-4 font-medium text-center ${
                                    activeTab === 'requests'
                                        ? 'text-primary-400 border-b-2 border-primary-400'
                                        : 'text-gray-400 hover:text-gray-300'
                                }`}
                                onClick={() => setActiveTab('requests')}
                            >
                                Мои запросы
                            </button>
                        </div>

                        <div className="p-4">
                            {activeTab === 'lobbies' ? (
                                joinedLobbies.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {joinedLobbies.map(lobby => (
                                            <LobbyCard key={lobby.id} lobby={lobby}/>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <User className="h-12 w-12 mx-auto text-gray-500 mb-3"/>
                                        <h3 className="text-lg font-medium mb-2">Вы не присоеденены ни к одному
                                            лобби</h3>
                                        <a href="/lobbies" className="btn btn-primary">Посмотреть Лобби</a>
                                    </div>
                                )
                            ) : (
                                userRequests.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {userRequests.map(request => (
                                            <RequestCard key={request.id} request={request}/>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Mail className="h-12 w-12 mx-auto text-gray-500 mb-3"/>
                                        <h3 className="text-lg font-medium mb-2">Запросы не созданы</h3>
                                        <p className="text-gray-400 mb-4">Вы еще не создали ни одного запроса.</p>
                                        <a href="/create-request" className="btn btn-primary"> Создать запрос</a>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;