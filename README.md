# Task Management System - React Frontend

A modern, responsive React frontend for the Task Management System with role-based access control and JWT authentication.

## 🚀 Features

- **Authentication**: Login/Register with JWT token management
- **Role-Based Access**: Different views for Admin, Manager, and User roles
- **Dashboard**: Task statistics and recent task overview
- **Task Management**: View, filter, and update tasks
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Updates**: Automatic token refresh and session management

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   └── PrivateRoute.jsx    # Route protection
│   ├── common/
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── Loader.jsx          # Loading component
│   ├── dashboard/
│   │   └── Dashboard.jsx       # Main dashboard
│   ├── tasks/
│   │   └── TaskList.jsx        # Task list with filters
│   ├── teams/                  # (To be implemented)
│   └── users/                  # (To be implemented)
├── context/
│   └── AuthContext.jsx         # Authentication state
├── services/
│   ├── api.js                  # Axios instance with interceptors
│   ├── authService.js          # Auth API calls
│   ├── taskService.js          # Task API calls
│   ├── teamService.js          # Team API calls
│   └── userService.js          # User API calls
├── utils/
│   ├── constants.js            # App constants
│   └── helpers.js              # Utility functions
├── styles/                     # CSS files
├── App.jsx                     # Main app component
└── main.jsx                    # Entry point
```

## ⚙️ Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Backend API**: Running on `http://localhost:5000`

## 🛠️ Installation & Setup

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
cd Frontend/task-management-ui
npm install
```

This will install:
- `react` & `react-dom` - Core React libraries
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `vite` - Build tool and dev server

### 3. Configure API URL

The API base URL is set in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Update this if your backend is running on a different port.

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at:
- **Local**: `http://localhost:5173`

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload enabled) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |

## 🔐 Authentication Flow

### Login
1. User enters email and password
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates and returns JWT token
4. Token stored in `localStorage`
5. User redirected to dashboard

### Protected Routes
- All routes except `/login` and `/register` require authentication
- Token automatically added to API requests via interceptor
- Expired tokens trigger automatic logout and redirect to login

### Role-Based Access
```javascript
// Admin - Full access
- Dashboard, Tasks, Teams, Users

// Manager - Team management
- Dashboard, Tasks, Teams

// User - Personal tasks only
- Dashboard, My Tasks
```

## 🎨 UI Components

### Auth Pages
- **Login**: Email/password with demo credentials
- **Register**: Full registration with role selection

### Dashboard
- Task statistics cards
- Recent tasks overview
- Role-specific welcome message

### Task List
- Filter by status (All, To Do, In Progress, Done)
- Update task status
- Delete tasks (Admin/Manager only)
- Color-coded priority and status

### Navbar
- Role-based navigation links
- User info display
- Logout button

## 🔌 API Integration

### Services Structure

All API calls are organized in service files:

```javascript
// Example: authService.js
export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  // ... other methods
};
```

### Axios Interceptors

**Request Interceptor** - Adds JWT token:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** - Handles 401 errors:
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🎯 Usage Examples

### 1. Login as Admin

Use demo credentials:
- **Email**: `admin@taskmanagement.com`
- **Password**: `Admin@123`

### 2. View Tasks

Navigate to "My Tasks" to see:
- All assigned tasks
- Filter by status
- Update task status by selecting from dropdown

### 3. Register New User

1. Click "Register" on login page
2. Fill in details and select role
3. Submit to create account (if registration is enabled)

## 🎨 Styling & Theming

### CSS Variables

Colors and styles are defined in `src/styles/index.css`:

```css
:root {
  --primary-color: #4f46e5;
  --primary-dark: #4338ca;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  /* ... more variables */
}
```

### Responsive Design

- **Desktop**: Full layout with sidebar
- **Tablet**: Adjusted spacing and layouts
- **Mobile**: Stacked columns, hamburger menu

## 🚧 Planned Features

### Short Term
- [ ] Create Task modal (Admin/Manager)
- [ ] Task detail view with comments
- [ ] Team management page
- [ ] User management page (Admin only)
- [ ] Notification dropdown

### Long Term
- [ ] Real-time updates with SignalR
- [ ] Task drag-and-drop for status change
- [ ] File attachments
- [ ] Advanced filtering (date range, priority)
- [ ] Dark mode toggle
- [ ] Export tasks to CSV/PDF

## 🐛 Troubleshooting

### Issue: "npm is not recognized"
**Solution**: Install Node.js which includes npm

### Issue: "Failed to fetch"
**Solution**: 
1. Ensure backend is running on `http://localhost:5000`
2. Check CORS configuration in backend
3. Verify API base URL in `src/services/api.js`

### Issue: Login redirects immediately
**Solution**: Check browser console for JWT errors, ensure backend is returning valid token

### Issue: Styles not loading
**Solution**: 
1. Clear browser cache
2. Run `npm run dev` again
3. Check that all CSS files are imported correctly

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist/` folder.

To deploy:
1. Upload `dist/` contents to web server
2. Configure server to serve `index.html` for all routes
3. Update API base URL to production backend

## 🔒 Security Best Practices

✅ **Implemented**:
- JWT tokens stored in localStorage
- Automatic token validation
- Protected routes with role checking
- XSS prevention via React's built-in escaping

⚠️ **Recommendations**:
- Consider using HttpOnly cookies for tokens (requires backend change)
- Implement CSRF tokens for state-changing operations
- Add rate limiting on login attempts
- Use environment variables for API URLs

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

When adding new features:
1. Create component in appropriate folder
2. Add service method in relevant service file
3. Update routing in `App.jsx`
4. Add styles in corresponding CSS file
5. Update this README

## 📄 License

MIT License - Free to use for personal and commercial projects

---

**Built with** ⚛️ React 18 + Vite + Modern CSS

**Backend API**: .NET 8 MVC with PostgreSQL
