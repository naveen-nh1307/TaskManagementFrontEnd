import api from './api';

export const teamService = {
    async getAllTeams() {
        const response = await api.get('/teams');
        return response.data;
    },

    async getTeamById(id) {
        const response = await api.get(`/teams/${id}`);
        return response.data;
    },

    async createTeam(teamData) {
        const response = await api.post('/teams', teamData);
        return response.data;
    },

    async addTeamMember(teamId, userId) {
        const response = await api.post(`/teams/${teamId}/members`, userId);
        return response.data;
    },

    async removeTeamMember(teamId, userId) {
        const response = await api.delete(`/teams/${teamId}/members/${userId}`);
        return response.data;
    },
};
