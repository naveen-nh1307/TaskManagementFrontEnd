import api from './api';

export const taskService = {
    async getAllTasks() {
        const response = await api.get('/tasks');
        return response.data;
    },

    async getTaskById(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    async getMyTasks() {
        const response = await api.get('/tasks/my-tasks');
        return response.data;
    },

    async createTask(taskData) {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    async updateTaskStatus(id, status) {
        const response = await api.patch(`/tasks/${id}/status`, { status });
        return response.data;
    },

    async deleteTask(id) {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },

    async getTaskComments(id) {
        const response = await api.get(`/tasks/${id}/comments`);
        return response.data;
    },

    async addComment(id, content) {
        const response = await api.post(`/tasks/${id}/comments`, { content });
        return response.data;
    },

    async updateComment(commentId, content) {
        const response = await api.put(`/tasks/comments/${commentId}`, { content });
        return response.data;
    },

    async deleteComment(commentId) {
        await api.delete(`/tasks/comments/${commentId}`);
        return true;
    },
};
