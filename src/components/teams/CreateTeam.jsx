import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import '../../styles/TaskForm.css'; // Reuse form styles

const CreateTeam = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            setLoading(true);
            setError(null);

            // Include current user's ID as ManagerId
            const teamData = {
                ...formData,
                managerId: user.id
            };

            await teamService.createTeam(teamData);
            navigate('/teams');
        } catch (err) {
            console.error('Error creating team:', err);
            setError('Failed to create team. It might already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-team-container task-form">
            <h2>Create New Team</h2>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="name">Team Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        placeholder="e.g. Development Team"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="What is this team responsible for?"
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/teams')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Team'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTeam;
