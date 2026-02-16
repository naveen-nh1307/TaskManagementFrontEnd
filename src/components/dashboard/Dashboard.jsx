import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { taskService } from '../../services/taskService';
import { formatDate, getPriorityColor, getStatusColor } from '../../utils/helpers';
import Modal from '../common/Modal';
import CreateTask from '../tasks/CreateTask';
import TaskDetailsModal from '../tasks/TaskDetailsModal';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    const { user, isAdmin, isManager } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = (isAdmin() || isManager())
                ? await taskService.getAllTasks()
                : await taskService.getMyTasks();
            setTasks(data);

            // Calculate stats
            setStats({
                total: data.length,
                todo: data.filter(t => t.status === 'ToDo').length,
                inProgress: data.filter(t => t.status === 'InProgress').length,
                done: data.filter(t => t.status === 'Done').length,
            });
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        loadTasks();
        alert('Task created successfully!');
    };

    if (loading) {
        return <div className="dashboard-container">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.firstName}!</h1>
                <p className="dashboard-subtitle">Role: {user?.role}</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>{stats.total}</h3>
                    <p>Total Tasks</p>
                </div>
                <div className="stat-card stat-todo">
                    <h3>{stats.todo}</h3>
                    <p>To Do</p>
                </div>
                <div className="stat-card stat-in-progress">
                    <h3>{stats.inProgress}</h3>
                    <p>In Progress</p>
                </div>
                <div className="stat-card stat-done">
                    <h3>{stats.done}</h3>
                    <p>Completed</p>
                </div>
            </div>

            <div className="dashboard-content">
                <h2>Recent Tasks</h2>
                {tasks.length === 0 ? (
                    <div className="no-tasks">
                        <p>No tasks assigned yet. Check back later!</p>
                    </div>
                ) : (
                    <div className="tasks-list">
                        {tasks.slice(0, 5).map(task => (
                            <div
                                key={task.id}
                                className="task-item clickable"
                                onClick={() => {
                                    setSelectedTaskId(task.id);
                                    setShowDetailsModal(true);
                                }}
                            >
                                <div className="task-info">
                                    <h4>{task.title}</h4>
                                    <p className="task-description">{task.description}</p>
                                    <div className="task-meta">
                                        <span
                                            className="task-status"
                                            style={{ backgroundColor: getStatusColor(task.status) }}
                                        >
                                            {task.status}
                                        </span>
                                        <span
                                            className="task-priority"
                                            style={{ color: getPriorityColor(task.priority) }}
                                        >
                                            {task.priority} Priority
                                        </span>
                                        <span className="task-deadline">
                                            Due: {formatDate(task.deadline)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button for Create Task */}
            {(isAdmin() || isManager()) && (
                <button
                    className="create-task-fab"
                    onClick={() => setShowCreateModal(true)}
                    title="Create New Task"
                >
                    +
                </button>
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

export default Dashboard;
