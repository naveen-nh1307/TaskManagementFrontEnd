import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin, isManager } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <h1>Task Manager</h1>
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Dashboard</Link>
                    <Link to="/tasks" className="nav-link">My Tasks</Link>

                    {(isAdmin() || isManager()) && (
                        <Link to="/teams" className="nav-link">Teams</Link>
                    )}

                    {isAdmin() && (
                        <Link to="/users" className="nav-link">Users</Link>
                    )}
                </div>

                <div className="navbar-user">
                    <span className="user-info">
                        {user?.firstName} {user?.lastName}
                        <span className="user-role">({user?.role})</span>
                    </span>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
