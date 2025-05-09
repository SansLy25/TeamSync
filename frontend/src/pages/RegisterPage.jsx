import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {
    Eye,
    EyeOff,
    User,
    Lock,
    Info,
    AtSign,
    DiscIcon as BrandDiscord,
    PoundSterling as BrandSteam
} from 'lucide-react';

function RegisterPage() {
    const navigate = useNavigate();
    const {register} = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
        bio: '',
        avatar: '',
        contacts: {
            telegram: '',
            steam: '',
            discord: '',
        }
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Обработчик изменения полей формы
    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    function isValidUrl(string) {
        if (!string) {
            return true;
        }
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    }


    const validateForm = () => {
        const newErrors = {};
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\]\[@$!%*#?&,./^\-={}:;"'<>~`|\\])[A-Za-z\d\]\[@$!%*#?&,./^\-={}:;"'<>~`|\\]{8,}$/;

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Имя пользователя должно быть не менее 3 символов';
        }

        if (!formData.bio.trim()) {
            newErrors.bio = 'О себе обязательно';
        } else if (formData.bio.length < 30) {
            newErrors.bio = 'Должно быть длиннее 30 символов';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Пароль должен быть не менее 8 символов';
        } else if (!passwordPattern.test(formData.password)) {
            newErrors.password = 'Пароль должен содержать буквы, цифры и специальные символы (@$!%*#?&,./)';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.gender) {
            newErrors.gender = 'Пожалуйста, выберите пол';
        }

        if (!isValidUrl(formData.avatar)) {
            newErrors.avatar = "Невалидный URL для аватара"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Удаляем confirmPassword перед отправкой
            const {confirmPassword, ...registrationData} = formData;

            const result = await register(registrationData);

            if (result.success) {
                navigate('/');
            } else {
                setErrors({form: result.error});
            }
        } catch (error) {
            setErrors({form: 'Ошибка регистрации. Пожалуйста, попробуйте снова.'});
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-dark-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-center">Создать аккаунт</h1>

            {errors.form && (
                <div className="bg-error-900 text-error-200 p-3 rounded-md mb-4">
                    {errors.form}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Секция основной информации */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Информация об аккаунте</h2>

                    <div>
                        <label htmlFor="username" className="label">Имя пользователя</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`input pl-10 ${errors.username ? 'border-error-500' : ''}`}
                                placeholder="Введите имя пользователя"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                        {errors.username && <p className="text-error-400 text-sm mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="label">Пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input pl-10 ${errors.password ? 'border-error-500' : ''}`}
                                placeholder="Создайте пароль"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div>
                        {errors.password && <p className="text-error-400 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="label">Подтвердите пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`input pl-10 ${errors.confirmPassword ? 'border-error-500' : ''}`}
                                placeholder="Подтвердите ваш пароль"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                        {errors.confirmPassword &&
                            <p className="text-error-400 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                </div>

                {/* Секция профиля */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Информация о профиле</h2>

                    <div>
                        <label htmlFor="gender" className="label">Пол</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className={`select ${errors.gender ? 'border-error-500' : ''}`}
                        >
                            <option value="">Выберите пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                        {errors.gender && <p className="text-error-400 text-sm mt-1 kl-21 marg-23">{errors.gender}</p>}
                    </div>

                    <div>
                        <label htmlFor="bio" className="label">О себе</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="3"
                            className={`input ${errors.bio ? 'border-error-500' : ''}`}
                            placeholder="Расскажите о себе как о геймере..."
                        ></textarea>
                        {errors.bio && <p className="text-error-400 text-sm mt-1 kl-21 marg-23">{errors.bio}</p>}
                    </div>

                    <div>
                        <label htmlFor="avatar" className="label">URL аватара (необязательно)</label>
                        <div className="relative">
                            <input
                                type="url"
                                id="avatar"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="https://example.com/your-image.jpg"
                            />
                            <Info className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">Укажите ссылку на изображение для аватара</p>
                        {errors.avatar &&
                            <p className="text-error-400 text-sm mt-1">{errors.avatar}</p>}
                    </div>
                </div>

                {/* Секция контактов */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b border-dark-500 pb-2">Контактная информация
                        (необязательно)</h2>

                    <div>
                        <label htmlFor="contacts.telegram" className="label">Telegram</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="contacts.telegram"
                                name="contacts.telegram"
                                value={formData.contacts.telegram}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="@username"
                            />
                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contacts.discord" className="label">Discord</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="contacts.discord"
                                name="contacts.discord"
                                value={formData.contacts.discord}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="username#0000"
                            />
                            <BrandDiscord className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contacts.steam" className="label">Steam</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="contacts.steam"
                                name="contacts.steam"
                                value={formData.contacts.steam}
                                onChange={handleChange}
                                className="input pl-10"
                                placeholder="Steam ID или имя пользователя"
                            />
                            <BrandSteam className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div
                                    className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                <span>Создание аккаунта...</span>
                            </div>
                        ) : (
                            'Создать аккаунт'
                        )}
                    </button>
                </div>

                <div className="text-center text-gray-400">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300">
                        Войти
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterPage;