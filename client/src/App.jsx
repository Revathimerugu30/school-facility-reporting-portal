import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ReportIssue from './pages/ReportIssue.jsx';
import Issues from './pages/Issues.jsx';
import Notifications from './pages/Notifications.jsx';
import Profile from './pages/Profile.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminHome from './pages/admin/AdminHome.jsx';
import AdminManageIssues from './pages/admin/AdminManageIssues.jsx';
import AdminIssueDetails from './pages/admin/AdminIssueDetails.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/admin" element={<ProtectedRoute roles={[ 'admin' ]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminHome />} />
        <Route path="manage" element={<AdminManageIssues />} />
        <Route path="issues/:id" element={<AdminIssueDetails />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="/" element={<ProtectedRoute roles={[ 'teacher', 'parent', 'staff', 'admin' ]}><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="issues" element={<Issues />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
