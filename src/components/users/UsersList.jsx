import { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Users.css';

const UsersList = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    if (loading) return <div className="users-container">Loading...</div>;
    if (error) return <div className="users-container error-message">{error}</div>;
    if (!isAdmin()) return <div className="users-container">Access Denied</div>;

    return (
        <div className="users-container">
            <div className="users-header">
                <h1>Users</h1>
                <div className="user-count">
                    {users.length} {users.length === 1 ? 'User' : 'Users'}
                </div>
            </div>

            <div className="users-table-container">
                {users.length === 0 ? (
                    <div className="no-users">
                        <p>No users found in the system.</p>
                    </div>
                ) : (
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {getInitials(user.firstName, user.lastName)}
                                            </div>
                                            <span className="user-name">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`user-role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="status-badge active">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default UsersList;
