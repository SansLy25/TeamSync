import {format, addHours} from 'date-fns';
import apiClient from "./httpClient.js";


function convertToLobbyData(lobbyApiData) {
    return {
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
}

export const getMyLobbies = async () => {
    try {
        return (await apiClient.get("/api/lobbies/my")).lobbies?.map((lobby) => convertToLobbyData(lobby))
    } catch (error) {
        throw new Error("Что то пошло не так")
    }

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


export const createLobby = async (lobbyData) => {
    try {
        return convertToLobbyData(await apiClient.post('/api/lobbies', lobbyData))
    } catch (error) {
        if (error.response.status === 400) {
            throw new Error("Невалидные данные формы, проверьте поля")
        } else if (error.response.status === 401) {
            throw new Error("Авторизуйте перед созданием")
        }
        throw new Error("Что то пошло не так")
    }
};

// Удаление Лобби
export const deleteLobby = async (id) => {
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