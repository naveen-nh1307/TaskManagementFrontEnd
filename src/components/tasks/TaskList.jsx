import { useEffect, useState } from 'react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';
import { TASK_STATUSES } from '../../utils/constants';
import Modal from '../common/Modal';
import CreateTask from './CreateTask';
import TaskDetailsModal from './TaskDetailsModal';
import '../../styles/Tasks.css';

const TaskList = () => {
    const { user, isAdmin, isManager } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, filter]);

    const loadTasks = async () => {
        try {
            const data = isAdmin() || isManager()
                ? await taskService.getAllTasks()
                : await taskService.getMyTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        if (filter === 'all') {
            setFilteredTasks(tasks);
        } else {
            setFilteredTasks(tasks.filter(task => task.status === filter));
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateTaskStatus(taskId, newStatus);
            loadTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            alert('Failed to update task status');
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            await taskService.deleteTask(taskId);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        loadTasks();
        alert('Task created successfully!');
    };

    if (loading) {
        return <div className="tasks-container">Loading...</div>;
    }

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <div className="tasks-title-section">
                    <h1>Tasks</h1>
                    {(isAdmin() || isManager()) && (
                        <button
                            className="create-task-btn"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create Task
                        </button>
                    )}
                </div>
                <div className="filter-buttons">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All ({tasks.length})
                    </button>
                    <button
                        className={filter === TASK_STATUSES.TODO ? 'active' : ''}
                        onClick={() => setFilter(TASK_STATUSES.TODO)}
                    >
                        To Do ({tasks.filter(t => t.status === TASK_STATUSES.TODO).length})
                    </button>
                    <button
                        className={filter === TASK_STATUSES.IN_PROGRESS ? 'active' : ''}
                        onClick={() => setFilter(TASK_STATUSES.IN_PROGRESS)}
                    >
                        In Progress ({tasks.filter(t => t.status === TASK_STATUSES.IN_PROGRESS).length})
                    </button>
                    <button
                        className={filter === TASK_STATUSES.DONE ? 'active' : ''}
                        onClick={() => setFilter(TASK_STATUSES.DONE)}
                    >
                        Done ({tasks.filter(t => t.status === TASK_STATUSES.DONE).length})
                    </button>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="no-tasks">
                    <p>No tasks found</p>
                </div>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.map(task => (
                        <div
                            key={task.id}
                            className="task-card clickable"
                            onClick={() => {
                                setSelectedTaskId(task.id);
                                setShowDetailsModal(true);
                            }}
                        >
                            <div className="task-card-header">
                                <h3>{task.title}</h3>
                                <span
                                    className="task-priority-badge"
                                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                                >
                                    {task.priority}
                                </span>
                            </div>

                            <p className="task-description">{task.description}</p>

                            <div className="task-details">
                                <div className="detail-item">
                                    <strong>Assigned to:</strong> {task.assignedToName}
                                </div>
                                <div className="detail-item">
                                    <strong>Created by:</strong> {task.createdByName}
                                </div>
                                <div className="detail-item">
                                    <strong>Deadline:</strong> {formatDate(task.deadline)}
                                </div>
                                {task.teamName && (
                                    <div className="detail-item">
                                        <strong>Team:</strong> {task.teamName}
                                    </div>
                                )}
                            </div>

                            <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className="status-select"
                                    style={{ backgroundColor: getStatusColor(task.status) }}
                                    disabled={!isAdmin() && !isManager() && task.assignedToId !== user.id}
                                >
                                    <option value={TASK_STATUSES.TODO}>To Do</option>
                                    <option value={TASK_STATUSES.IN_PROGRESS}>In Progress</option>
                                    <option value={TASK_STATUSES.DONE}>Done</option>
                                </select>

                                {(isAdmin() || isManager()) && (
                                    <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="btn-delete task-priority-badge"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Task Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Task"
            >
                <CreateTask
                    onSuccess={handleCreateSuccess}
                    onCancel={() => setShowCreateModal(false)}
                />
            </Modal>

            {/* Task Details Modal */}
            <TaskDetailsModal
                taskId={selectedTaskId}
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedTaskId(null);
                }}
            />
        </div>
    );
};

export default TaskList;
