// Имитируем запросы
import apiClient from "./httpClient.js";

let requests = [
    {
        id: '1',
        creator: '1',
        game: 'League of Legends',
        description: 'Looking for a support main to duo with. Gold rank, play mostly evenings.',
        createdAt: new Date().toISOString(),
        preferences: 'Mic required, non-toxic players only'
    },
    {
        id: '2',
        creator: '2',
        game: 'Minecraft',
        description: 'Starting a new survival server, looking for creative builders to join our community.',
        createdAt: new Date().toISOString(),
        preferences: 'Any experience level welcome, must be 18+'
    },
    {
        id: '3',
        creator: '3',
        game: 'Fortnite',
        description: 'Need a squad for Arena mode. I am trying to reach Champion division.',
        createdAt: new Date().toISOString(),
        preferences: 'Looking for players who can build well and have good game sense'
    }
];

function convertToRequestData(requestApiData) {
    return {
        id: requestApiData.id,
        creator: requestApiData.author.id,
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
export const createRequest = (requestData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRequest = {
                id: String(requests.length + 1),
                ...requestData,
                createdAt: new Date().toISOString()
            };

            requests.push(newRequest);
            resolve(newRequest);
        }, 500);
    });
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

export const getRequestsByCreator = (creatorId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const creatorRequests = requests.filter(req => req.creator === creatorId);
            resolve(creatorRequests);
        }, 300);
    });
};