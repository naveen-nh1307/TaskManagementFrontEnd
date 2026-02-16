import api from './api';

export const userService = {
    async getAllUsers() {
        const response = await api.get('/users');
        return response.data;
    },

    async getUserById(id) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async getManagers() {
        const response = await api.get('/users/managers');
        return response.data;
    },

    async updateUserRole(id, newRole) {
        const response = await api.put(`/users/${id}/role`, newRole);
        return response.data;
    },
};
