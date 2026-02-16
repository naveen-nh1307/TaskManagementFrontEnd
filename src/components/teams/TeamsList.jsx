import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/teamService';
import { formatDate } from '../../utils/helpers';
import '../../styles/Teams.css';

const TeamsList = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const data = await teamService.getAllTeams();
            setTeams(data);
        } catch (error) {
            console.error('Error loading teams:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading teams...</div>;

    return (
        <div className="teams-container">
            <div className="teams-header">
                <h1>Teams</h1>
                {isAdmin() && (
                    <button
                        className="create-team-btn"
                        onClick={() => navigate('/teams/create')}
                    >
                        + Create Team
                    </button>
                )}
            </div>

            <div className="teams-grid">
                {teams.length === 0 ? (
                    <div className="no-teams">
                        <p>No teams found. {isAdmin() && 'Create one to get started!'}</p>
                    </div>
                ) : (
                    teams.map(team => (
                        <div
                            key={team.id}
                            className="team-card"
                            onClick={() => navigate(`/teams/${team.id}`)}
                        >
                            <div className="team-card-header">
                                <h3>{team.name}</h3>
                                <span className="team-member-count">
                                    {team.members ? team.members.length : 0} members
                                </span>
                            </div>

                            <p className="team-description">{team.description}</p>

                            <div className="team-meta">
                                <div className="team-meta-item">
                                    Created: <strong>{formatDate(team.createdAt)}</strong>
                                </div>
                                <div className="team-meta-item">
                                    Tasks: <strong>{team.tasks ? team.tasks.length : 0}</strong>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeamsList;
