// Имитируем запросы
import apiClient from "./httpClient.js";


function convertToRequestData(requestApiData) {
    return {
        id: requestApiData.id,
        creator: requestApiData.author.id,
        creatorUsername: requestApiData.author.username,
        game: requestApiData.game.name,
        description: requestApiData.description,
        createdAt: new Date().toISOString(),
        preferences: requestApiData.details,
    }

}

// Получаем все запросы
export const getAllRequests = async () => {
    try {
        return (await apiClient.get("/api/bids")).bids.map((e) => convertToRequestData(e))
    } catch (error) {
        throw new Error("Не удалось получить заявки")
    }

};

// Получаем заявку по id
export const getRequestById = async (id) => {
    try {
        return convertToRequestData(await apiClient.get(`/api/bids/${id}`))
    } catch (error) {
        if (error?.response?.status === 404) {
            throw new Error("Такой заявки не существует")
        }
    }
};

// Создаем новую заявку
export const createRequest = async (requestData) => {
    try {
        return await apiClient.post('/api/bids', requestData)
    } catch (error) {
        if (error?.response?.status === 400) {
            throw new Error("Невалидные данные формы, проверьте поля")
        } else if (error.response.status === 401) {
            throw new Error("Авторизуйте перед созданием")
        }
        throw new Error("Что то пошло не так")
    }
};


export const deleteRequest = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const requestIndex = requests.findIndex(req => req.id === id);
            if (requestIndex !== -1) {
                const deletedRequest = requests[requestIndex];
                requests = requests.filter(req => req.id !== id);
                resolve(deletedRequest);
            } else {
                reject(new Error('Заявка не найдена'));
            }
        }, 300);
    });
};

export const filterRequests = async (filters) => {
    let params = Object()

    try {
        if (filters.game) {
            params.game_search = filters.game
        }

        if (filters.searchText) {
            params.description_search = filters.searchText
        }
        return (await apiClient.get("/api/bids", {params: params})).bids.map((e) => convertToRequestData(e))
    } catch (error) {
        if (error?.response?.status === 404) {
            throw new Error("Такой заявки не существует")
        }
    }


};

export const getRequestsByCreator = async (creatorId) => {
    try {
        requests = (await apiClient.get("/api/bids")).bids
        return requests.filter((r) => r.author.id === creatorId ).map((e) => convertToRequestData(e))
    } catch (error) {
        throw new Error("Не удалось получить заявки")
    }
};