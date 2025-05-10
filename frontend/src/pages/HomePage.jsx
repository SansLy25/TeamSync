import {Link} from 'react-router-dom';
import {Users, Search, GamepadIcon, ChevronRight, ArrowRight} from 'lucide-react';
import {useAuth} from '../contexts/AuthContext';

function HomePage() {
    const {isAuthenticated} = useAuth();

    const features = [
        {
            icon: <GamepadIcon className="h-12 w-12 text-primary-500"/>,
            title: 'Найди напарников',
            description: 'Подключайся к игрокам твоего уровня и стиля игры.'
        },
        {
            icon: <Users className="h-12 w-12 text-secondary-500"/>,
            title: 'Создавай лобби',
            description: 'Организуй идеальную игровую сессию и приглашай других присоединиться.'
        },
        {
            icon: <Search className="h-12 w-12 text-accent-500"/>,
            title: 'Размещай заявки',
            description: 'Дай знать другим, что ты ищешь тиммейтов с определенными требованиями.'
        }
    ];

    const popularGames = [
        'Apex Legends',
        'Call of Duty',
        'Fortnite',
        'League of Legends',
        'Minecraft',
        'Valorant'
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <section
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary-900 via-secondary-900 to-dark-800 p-8 md:p-12 mb-10">
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Найди свою идеальную <span className="text-primary-400">команду</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-xl">
                        Объединяйся с игроками твоего уровня, расписания и целей. Подними свой игровой опыт на новый
                        уровень с правильными тиммейтами.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link to="/create-lobby" className="btn btn-primary">
                                    Создать лобби
                                </Link>
                                <Link to="/lobbies" className="btn btn-outline">
                                    Просмотр лобби
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary">
                                    Присоединиться
                                </Link>
                                <Link to="/lobbies" className="btn btn-outline">
                                    Просмотр лобби
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Декор */}
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
                    <div
                        className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-primary-500 filter blur-3xl"></div>
                    <div
                        className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-secondary-500 filter blur-3xl"></div>
                </div>
            </section>

            {/* Секция функций*/}
            <section className="mb-16">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Как работает TeamSync</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Находи тиммейтов, создавай лобби и общайся с игроками, разделяющими твои цели и интересы.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-dark-700 p-6 rounded-lg border border-dark-600 hover:border-primary-700 transition-all duration-300"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Игры</h2>
                    <Link to="/lobbies"
                          className="text-primary-400 hover:text-primary-300 flex items-center transition">
                        <span>Показать все</span>
                        <ChevronRight className="h-5 w-5 ml-1"/>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {popularGames.map((game, index) => (
                        <Link
                            key={index}
                            to={`/lobbies?game=${game}`}
                            className="bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg p-4 text-center transition-all duration-300"
                        >
                            <div
                                className="h-12 w-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <GamepadIcon className="h-6 w-6 text-white"/>
                            </div>
                            <span className="font-medium">{game}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-secondary-900 to-primary-900 rounded-xl p-8 text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Готов найти свою команду?</h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                    Присоединяйся к тысячам игроков, которые ищут таких же тиммейтов, как ты. Создай профиль и начни
                    общение прямо сейчас.
                </p>
                <Link to={isAuthenticated ? "/create-lobby" : "/register"}
                      className="btn btn-accent inline-flex items-center">
                    <span>{isAuthenticated ? "Создать лобби" : "Начать"}</span>
                    <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
            </section>

            {/* How It Works Section */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Краткое руководство</h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div
                            className="rounded-full bg-dark-700 border-4 border-primary-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Создай профиль</h3>
                        <p className="text-gray-400">
                            Зарегистрируйся и настрой свой профиль, указав игровые предпочтения и контактную информацию.
                        </p>
                    </div>

                    <div className="text-center">
                        <div
                            className="rounded-full bg-dark-700 border-4 border-secondary-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Найди или создай лобби</h3>
                        <p className="text-gray-400">
                            Просматривай существующие лобби или создавай свои со своими требованиями.
                        </p>
                    </div>

                    <div className="text-center">
                        <div
                            className="rounded-full bg-dark-700 border-4 border-accent-500 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <span className="text-xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Подключайся и играй</h3>
                        <p className="text-gray-400">
                            Присоединяйся к лобби, общайся с другими игроками и наслаждайся игрой!
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;