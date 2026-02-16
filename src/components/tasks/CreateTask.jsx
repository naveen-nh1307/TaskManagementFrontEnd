import { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { userService } from '../../services/userService';
import { teamService } from '../../services/teamService';
import { TASK_PRIORITIES } from '../../utils/constants';
import '../../styles/TaskForm.css';

const CreateTask = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        deadline: '',
        assignedToId: '',
        teamId: '',
    });

    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
        try {
            const [usersData, teamsData] = await Promise.all([
                userService.getAllUsers(),
                teamService.getAllTeams(),
            ]);
            setUsers(usersData);
            setTeams(teamsData);
        } catch (err) {
            console.error('Error loading dropdown data:', err);
            setError('Failed to load users and teams. Please try again.');
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (formData.title.length > 200) {
            setError('Title must be less than 200 characters');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!formData.deadline) {
            setError('Deadline is required');
            return false;
        }
        if (!formData.assignedToId) {
            setError('Please assign the task to a user');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                deadline: new Date(formData.deadline).toISOString(),
                assignedToId: parseInt(formData.assignedToId),
                teamId: formData.teamId ? parseInt(formData.teamId) : null,
            };

            await taskService.createTask(taskData);
            onSuccess();
        } catch (err) {
            console.error('Error creating task:', err);
            setError(
                err.response?.data?.message ||
                'Failed to create task. Please check your inputs and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="form-loading">Loading...</div>;
    }

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="title">
                    Title <span className="required">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    maxLength={200}
                    placeholder="Enter task title"
                    disabled={loading}
                />
                <small className="char-count">
                    {formData.title.length}/200
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="description">
                    Description <span className="required">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the task details"
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="priority">
                        Priority <span className="required">*</span>
                    </label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value={TASK_PRIORITIES.LOW}>Low</option>
                        <option value={TASK_PRIORITIES.MEDIUM}>Medium</option>
                        <option value={TASK_PRIORITIES.HIGH}>High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">
                        Deadline <span className="required">*</span>
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="assignedToId">
                        Assign To <span className="required">*</span>
                    </label>
                    <select
                        id="assignedToId"
                        name="assignedToId"
                        value={formData.assignedToId}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">Select a user</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.role})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="teamId">
                        Team (Optional)
                    </label>
                    <select
                        id="teamId"
                        name="teamId"
                        value={formData.teamId}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <option value="">None</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default CreateTask;
