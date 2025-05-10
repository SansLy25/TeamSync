import {format, addHours} from 'date-fns';
import apiClient from "./httpClient.js";

// Имитируем БД для лобби
let lobbies = [
    {
        id: '1',
        name: 'Apex Legends Ranked Squad',
        game: 'Apex Legends',
        platform: 'PC',
        slots: 3,
        filledSlots: 2,
        players: ['1', '3'],
        creator: '1',
        scheduledTime: addHours(new Date(), 2).toISOString(),
        skillLevel: 8,
        goal: 'Push to Diamond rank',
        description: 'Looking for one more player to complete our squad. Must have mic and previous experience in ranked.',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Casual Valorant Evening',
        game: 'Valorant',
        platform: 'PC',
        slots: 5,
        filledSlots: 3,
        players: ['2', '4', '5'],
        creator: '2',
        scheduledTime: addHours(new Date(), 4).toISOString(),
        skillLevel: 5,
        goal: 'Have fun and improve together',
        description: 'Just looking for some chill games. All skill levels welcome but be ready to communicate.',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'COD Warzone Trios',
        game: 'Call of Duty: Warzone',
        platform: 'Cross-platform',
        slots: 3,
        filledSlots: 2,
        players: ['1', '6'],
        creator: '6',
        scheduledTime: addHours(new Date(), 1).toISOString(),
        skillLevel: 7,
        goal: 'High kill games and wins',
        description: 'Looking for an aggressive player who can hold their own in gunfights. Must have a 1.5+ KD.',
        createdAt: new Date().toISOString()
    }
];

function convertToLobbyData(lobbyApiData) {
    let datas = {
        id: lobbyApiData.id,
        name: lobbyApiData.name,
        game: lobbyApiData.game.name,
        platform: lobbyApiData.platform,
        slots: lobbyApiData.slots,
        filledSlots: lobbyApiData.filled_slots,
        players: lobbyApiData.members.map((member) => member.id),
        creator: lobbyApiData.author.id,
        scheduledTime: new Date(lobbyApiData.start_time),
        skillLevel: lobbyApiData.skill_level,
        goal: lobbyApiData.goal,
        description: lobbyApiData.description,
        createdAt: null
    }
    console.log(typeof datas.scheduledTime)
    console.log(datas)
    return datas
}


export const getAllLobbies = async () => {
    try {
        return (await apiClient.get("/api/lobbies")).lobbies?.map((lobby) => convertToLobbyData(lobby))
    } catch (error) {
        throw new Error("Что то пошло не так")
    }
};


export const getLobbyById = async (id) => {
    try {
        return convertToLobbyData(await apiClient.get(`/api/lobbies/${id}`))
    } catch (error) {
        if (error?.response?.status === 404) {
            throw new Error("Такого лобби не существует")
        }
    }
};


export const createLobby = (lobbyData) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newLobby = {
                id: String(lobbies.length + 1),
                ...lobbyData,
                filledSlots: 1, // Creator takes one slot
                players: [lobbyData.creator],
                createdAt: new Date().toISOString()
            };

            lobbies.push(newLobby);
            resolve(newLobby);
        }, 500);
    });
};

// Обновление лобби
export const updateLobby = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const lobbyIndex = lobbies.findIndex(lobby => lobby.id === id);
            if (lobbyIndex !== -1) {
                lobbies[lobbyIndex] = {
                    ...lobbies[lobbyIndex],
                    ...updatedData
                };
                resolve(lobbies[lobbyIndex]);
            } else {
                reject(new Error('Lobby not found'));
            }
        }, 300);
    });
};

// Удаление Лобби
export const deleteLobby = async (id)  => {
    try {
        await apiClient.delete(`/api/lobbies/${id}`)
    } catch (error) {
        if (error.response.status === 403) {
            throw new Error("Вы не владелец этого лобби")
        }
        throw new Error("Что то пошло не так")
    }
};

// Присоединение к лобби
export const joinLobby = async (lobbyId, userId) => {
    try {
        await apiClient.patch(`/api/lobbies/${lobbyId}/join`)
    } catch (error) {
        throw new Error("Что то пошло не так")
    }
};

export const leaveLobby = async (lobbyId, userId) => {
    try {
        await apiClient.delete(`/api/lobbies/${lobbyId}/leave`)
    } catch (error) {
        throw new Error("Что то пошло не так")
    }
};

export const filterLobbies = async (filters) => {
    let params = Object()

    try {

        if (filters.game) {
            params.search_game = filters.game
        }
        if (filters.platform) {
            params.platform = filters.platform
        }
        if (filters.minSkill) {
            params.min_skill = filters.minSkill
        }

        if (filters.maxSkill) {
            params.max_skill = filters.maxSkill
        }

        if (filters.hasSlots) {
            params.open_slots = true
        }

        return (await apiClient.get(`/api/lobbies`, {params: params})).lobbies?.map((lobby) => convertToLobbyData(lobby))

    } catch (error) {
        throw new Error("Что то пошло не так")
    }
};