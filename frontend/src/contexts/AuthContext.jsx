import {createContext, useState, useContext, useEffect} from 'react';
import {convertToUserData, getUserByCredentials, registerUser} from '../services/userService';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);


    const login = async (username, password) => {
        try {
            const user = convertToUserData(await getUserByCredentials(username, password));
            if (user) {
                setCurrentUser(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                return {success: true, user};
            }
            return {success: false, error: 'Неправильное имя пользователя или пароль'};
        } catch (error) {
            return {success: false, error: error.message};
        }
    };

    // Регистрация
    const register = async (userData) => {
        try {
            const newUser = convertToUserData(await registerUser(userData));
            setCurrentUser(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            return {success: true, user: newUser};
        } catch (error) {
            return {success: false, error: error.message};
        }
    };

    // Выход
    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
    };

    const value = {
        currentUser,
        login,
        register,
        logout,
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}