import { Link } from 'react-router-dom';
import { GamepadIcon, Github, Twitter, Instagram } from 'lucide-react';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-dark-900 pt-10 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    {/*Лого */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center space-x-2">
                            <GamepadIcon className="h-8 w-8 text-primary-500" />
                            <span className="text-xl font-bold text-white">TeamSync</span>
                        </Link>
                        <p className="mt-3 text-gray-400">
                            Найди идеальных тимейтов для своих игровых сессий. Получи игровой опыт с правильной командой.
                        </p>
                    </div>

                    {/* Ссылки */}
                    <div className="col-span-1">
                        <h3 className="text-lg font-bold mb-4 text-white">Навигация</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition">Главная</Link></li>
                            <li><Link to="/lobbies" className="text-gray-400 hover:text-primary-400 transition">Лобби</Link></li>
                            <li><Link to="/requests" className="text-gray-400 hover:text-primary-400 transition">Заявки</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-dark-700 mt-8 pt-6 text-center text-gray-500 text-sm">
                    <p>&copy; {currentYear} TeamSync. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;