import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/common/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import UsersList from './components/users/UsersList';
import TeamsList from './components/teams/TeamsList';
import CreateTeam from './components/teams/CreateTeam';
import TeamDetails from './components/teams/TeamDetails';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/*"
                        element={
                            <PrivateRoute>
                                <div className="app">
                                    <Navbar />
                                    <main className="main-content">
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/tasks" element={<TaskList />} />
                                            <Route path="/teams" element={<TeamsList />} />
                                            <Route path="/teams/create" element={<CreateTeam />} />
                                            <Route path="/teams/:id" element={<TeamDetails />} />
                                            <Route path="/users" element={<UsersList />} />
                                            <Route path="*" element={<Navigate to="/" replace />} />
                                        </Routes>
                                    </main>
                                </div>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
