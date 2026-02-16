export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
};

export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High':
            return '#ef4444';
        case 'Medium':
            return '#f59e0b';
        case 'Low':
            return '#10b981';
        default:
            return '#6b7280';
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'ToDo':
            return '#6b7280';
        case 'InProgress':
            return '#3b82f6';
        case 'Done':
            return '#10b981';
        default:
            return '#6b7280';
    }
};
