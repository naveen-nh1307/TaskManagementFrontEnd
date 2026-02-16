import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import TaskComments from './TaskComments';
import { taskService } from '../../services/taskService';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';
import '../../styles/TaskForm.css'; // Reusing form styles for layout

const TaskDetailsModal = ({ taskId, isOpen, onClose }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && taskId) {
            loadTaskDetails();
        } else {
            setTask(null);
        }
    }, [isOpen, taskId]);

    const loadTaskDetails = async () => {
        try {
            setLoading(true);
            const data = await taskService.getTaskById(taskId);
            setTask(data);
        } catch (error) {
            console.error('Error loading task details:', error);
            // Close modal on error or show error state
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
            {loading ? (
                <div className="loading-spinner">Loading task details...</div>
            ) : task ? (
                <div className="task-details-container">
                    <div className="task-header-info">
                        <div className="task-status-badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                            {task.status}
                        </div>
                        <div className="task-priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                            {task.priority}
                        </div>
                    </div>

                    <h2 className="task-title-large">{task.title}</h2>

                    <div className="task-meta-grid">
                        <div className="meta-item">
                            <span className="meta-label">Assigned To:</span>
                            <span className="meta-value">{task.assignedToName}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Due Date:</span>
                            <span className="meta-value">{formatDate(task.deadline)}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Team:</span>
                            <span className="meta-value">{task.teamName || 'N/A'}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Created By:</span>
                            <span className="meta-value">{task.createdByName}</span>
                        </div>
                    </div>

                    <div className="task-description-section">
                        <h4>Description</h4>
                        <p>{task.description}</p>
                    </div>

                    <TaskComments taskId={taskId} />
                </div>
            ) : (
                <div className="error-message">Task not found</div>
            )}
        </Modal>
    );
};

export default TaskDetailsModal;
