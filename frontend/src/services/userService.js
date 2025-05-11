// Имитируем бэк
import apiClient from "./httpClient.js";


// Авторизация
export const getUserByCredentials = async (username, password) => {
    try {
        return await apiClient.post('/api/users/login',
            {
                password: password, username: username
            }
        )
    } catch (error) {
        if (error.response) {

            if (error.response.status === 401 || error.response.status === 400) {
                throw {
                    message: "Неверный пароль или имя пользователя"
                }
            }
        }
        throw error;
    }

};


export function convertToApiUserData(userData) {
    return {
        password: userData?.password,
        username: userData?.username,
        avatar: userData?.avatar,
        gender: userData?.gender,
        telegram_contact: userData?.contacts?.telegram,
        discord_contact: userData?.contacts?.discord,
        steam_contact: userData?.contacts?.steam,
        bio: userData?.bio,
        id: userData?.id
    };
}

export function convertToUserData(apiUserData) {
    return {
        password: apiUserData?.password,
        username: apiUserData?.username,
        avatar: apiUserData?.avatar,
        gender: apiUserData?.gender,
        contacts: {
            telegram: apiUserData?.telegram_contact,
            discord: apiUserData?.discord_contact,
            steam: apiUserData?.steam_contact
        },
        bio: apiUserData?.bio,
        id: apiUserData?.id,
        token: apiUserData?.token,
    };
}

const emptyStringToNull = (obj) => {
    for (let key in obj) {
        if (obj[key] === '') {
            obj[key] = null;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            emptyStringToNull(obj[key]);
        }
    }
    return obj;
};

export const registerUser = async (userData) => {
    userData = emptyStringToNull(userData);

    let apiUserData = convertToApiUserData(userData)

    try {
        return await apiClient.post('/api/users/signup', apiUserData)
    } catch (error) {
        if (error.response) {

            if (error.response.status === 409) {
                throw new Error('Пользователь с таким именем уже существует');
            } else if (error.response.status === 400) {

                const validationErrors = error.response.data.errors || {};
                throw {
                    name: 'ValidationError',
                    message: 'Ошибка валидации данных, проверьте валидность',
                    errors: validationErrors
                };
            }
        }
        throw error;
    }
}

// Получаем по id
export const getUserById = async (userId) => {
    try {
        return convertToUserData(await apiClient.get(`/api/users/${userId}`))

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error("Пользователя с таким id не существует")
            }
        }

        throw error
    }

};

//Обновление профиля
export const updateUserProfile = (userId, updatedData) => {
};
