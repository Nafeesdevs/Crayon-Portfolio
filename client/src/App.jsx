import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProfileEditor from './pages/admin/ProfileEditor';
import ProjectsManager from './pages/admin/ProjectsManager';
import ExperienceManager from './pages/admin/ExperienceManager';
import Messages from './pages/admin/Messages';
import Account from './pages/admin/Account';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="grid min-h-screen place-items-center font-hand text-3xl">loading…</div>;
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminLayout />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ProfileEditor />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="experience" element={<ExperienceManager />} />
        <Route path="messages" element={<Messages />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
