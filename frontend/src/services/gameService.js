import apiClient from "./httpClient.js";


export const getGames = async () => {
    try {
        return (await apiClient.get('/api/games')).games
    } catch (error) {
        throw new Error("Что то пошло не так")
    }
}


export const createGame = async (name) => {
    try {
        return (await apiClient.post('/api/games', {
            name: name,
            description: "description",
            release_date: "2025-05-10",
            url_image: "string",
        }))
    } catch (error) {
        throw new Error("Что то пошло не так")
    }
}

