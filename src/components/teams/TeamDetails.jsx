import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamService } from '../../services/teamService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import '../../styles/Teams.css';

const TeamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin, isManager } = useAuth();

    const [team, setTeam] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTeamDetails();
        if (isAdmin() || isManager()) {
            loadUsers();
        }
    }, [id]);

    const loadTeamDetails = async () => {
        try {
            setLoading(true);
            const data = await teamService.getTeamById(id);
            setTeam(data);
        } catch (error) {
            console.error('Error loading team details:', error);
            setError('Failed to load team details.');
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setAllUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedUserId) return;

        try {
            setSubmitting(true);
            await teamService.addTeamMember(id, parseInt(selectedUserId));
            await loadTeamDetails(); // Reload to show new member
            setSelectedUserId('');
            alert('Member added successfully!');
        } catch (error) {
            console.error('Error adding team member:', error);
            alert('Failed to add member. User might already be in the team.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;

        try {
            await teamService.removeTeamMember(id, userId);
            setTeam(prev => ({
                ...prev,
                members: prev.members.filter(m => m.id !== userId)
            }));
        } catch (error) {
            console.error('Error removing team member:', error);
            alert('Failed to remove member.');
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    // Filter out users who are already members
    const availableUsers = allUsers.filter(u =>
        !team?.members?.some(m => m.id === u.id)
    );

    if (loading) return <div className="loading-spinner">Loading team details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!team) return <div className="error-message">Team not found</div>;

    const canManage = isAdmin() || isManager();

    return (
        <div className="teams-container">
            <button className="btn btn-secondary mb-4" onClick={() => navigate('/teams')}>
                &larr; Back to Teams
            </button>

            <div className="team-details-header">
                <div className="team-title-section">
                    <h1>{team.name}</h1>
                    <div className="team-meta-row" style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                        Created: {formatDate(team.createdAt)}
                    </div>
                </div>
                <p className="team-details-description">{team.description}</p>
            </div>

            <div className="team-members-section">
                <div className="section-header">
                    <h2>Team Members ({team.members?.length || 0})</h2>
                </div>

                {canManage && (
                    <div className="add-member-container mb-6" style={{ marginBottom: '2rem' }}>
                        <form onSubmit={handleAddMember} className="add-member-form">
                            <select
                                className="member-select"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                disabled={submitting}
                            >
                                <option value="">Select a user to add...</option>
                                {availableUsers.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.firstName} {u.lastName} ({u.email})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                className="create-team-btn"
                                disabled={!selectedUserId || submitting}
                            >
                                Add Member
                            </button>
                        </form>
                    </div>
                )}

                <div className="members-list">
                    {team.members && team.members.length > 0 ? (
                        team.members.map(member => (
                            <div key={member.id} className="member-card">
                                <div className="member-info">
                                    <div className="member-avatar">
                                        {getInitials(member.firstName, member.lastName)}
                                    </div>
                                    <div className="member-details">
                                        <h4>{member.firstName} {member.lastName}</h4>
                                        <p>{member.role}</p>
                                    </div>
                                </div>
                                {canManage && (
                                    <button
                                        className="remove-member-btn"
                                        onClick={() => handleRemoveMember(member.id)}
                                        title="Remove Member"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No members in this team yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
