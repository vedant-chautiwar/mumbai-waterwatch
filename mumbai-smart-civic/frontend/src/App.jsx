import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthContainer from './pages/AuthContainer';

// Citizen pages
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportLeakage from './pages/citizen/ReportLeakage';
import MyReports from './pages/citizen/MyReports';
import LeakageMap from './pages/citizen/LeakageMap';
import WaterConservation from './pages/citizen/WaterConservation';
import Announcements from './pages/citizen/Announcements';

// Admin / Authority pages
import AdminDashboard from './pages/admin/Dashboard';
import ResolveComplaint from './pages/admin/ResolveComplaint';
import Analytics from './pages/admin/Analytics';

// Layout
import AppLayout from './components/AppLayout';

/* ---- helpers ---- */
function getUser() {
    try {
        const raw = localStorage.getItem('user');
        if (raw) return JSON.parse(raw);
    } catch { }
    // Default demo citizen if user visits a protected route directly
    const defaultUser = {
        name: 'Aditya Deshmukh (Student)',
        email: 'aditya.deshmukh@vjti.ac.in',
        role: 'citizen',
        environment: 'College',
        institution: 'Veermata Jijabai Technological Institute (VJTI)',
    };
    try {
        localStorage.setItem('user', JSON.stringify(defaultUser));
        localStorage.setItem('token', 'mock-token-demo');
    } catch { }
    return defaultUser;
}

function isAuthorityRole(role) {
    return role === 'authority' || role === 'admin';
}

function ProtectedRoute({ children, allowedRole }) {
    const user = getUser();
    if (!user) return <Navigate to="/" replace />;

    if (allowedRole === 'authority' && !isAuthorityRole(user.role)) {
        return <Navigate to="/citizen/dashboard" replace />;
    }
    if (allowedRole === 'citizen' && isAuthorityRole(user.role)) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    return children;
}

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Auth */}
                <Route path="/" element={<AuthContainer />} />
                <Route path="/login" element={<AuthContainer />} />
                <Route path="/register" element={<AuthContainer />} />

                {/* Citizen Routes */}
                <Route
                    path="/citizen/*"
                    element={
                        <ProtectedRoute allowedRole="citizen">
                            <AppLayout role="citizen" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<CitizenDashboard />} />
                    <Route path="report" element={<ReportLeakage />} />
                    <Route path="my-reports" element={<MyReports />} />
                    <Route path="my-complaints" element={<MyReports />} />
                    <Route path="map" element={<LeakageMap />} />
                    <Route path="heatmap" element={<LeakageMap />} />
                    <Route path="conservation" element={<WaterConservation />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="notifications" element={<Announcements />} />
                    <Route path="progress-dashboard" element={<CitizenDashboard />} />
                    <Route path="*" element={<Navigate to="/citizen/dashboard" replace />} />
                </Route>

                {/* Admin / Authority Routes */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRole="authority">
                            <AppLayout role="authority" />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="manage-reports" element={<AdminDashboard />} />
                    <Route path="all-complaints" element={<AdminDashboard />} />
                    <Route path="map" element={<LeakageMap />} />
                    <Route path="resolve" element={<ResolveComplaint />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="announcements" element={<Announcements />} />
                    <Route path="ngo-requests" element={<Announcements />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
