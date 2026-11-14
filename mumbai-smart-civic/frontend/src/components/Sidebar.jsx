import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    MdDashboard,
    MdAddCircleOutline,
    MdFormatListBulleted,
    MdMap,
    MdNotificationsNone,
    MdEco,
    MdAnalytics,
    MdAssignmentTurnedIn,
    MdCampaign,
    MdLogout,
    MdWaterDrop,
} from 'react-icons/md';

const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    { to: '/citizen/report', label: 'Report Leakage', icon: <MdAddCircleOutline /> },
    { to: '/citizen/my-reports', label: 'My Reports', icon: <MdFormatListBulleted /> },
    { to: '/citizen/map', label: 'Leakage Map', icon: <MdMap /> },
    { to: '/citizen/conservation', label: 'Water Conservation', icon: <MdEco /> },
    { to: '/citizen/announcements', label: 'Announcements', icon: <MdCampaign /> },
];

const authorityLinks = [
    { to: '/admin/dashboard', label: 'Executive Dashboard', icon: <MdDashboard /> },
    { to: '/admin/manage-reports', label: 'Manage Reports', icon: <MdAssignmentTurnedIn /> },
    { to: '/admin/map', label: 'Leakage Map', icon: <MdMap /> },
    { to: '/admin/analytics', label: 'Conservation Analytics', icon: <MdAnalytics /> },
    { to: '/admin/announcements', label: 'Announcements & Alerts', icon: <MdCampaign /> },
];

export default function Sidebar({ role, open, onClose }) {
    const navigate = useNavigate();
    const isAuthority = role === 'authority' || role === 'admin';
    const links = isAuthority ? authorityLinks : citizenLinks;
    const roleLabel = isAuthority ? 'Authority Command' : 'Citizen & Campus Portal';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/', { replace: true });
    };

    const handleNav = () => {
        if (onClose) onClose();
    };

    return (
        <aside className={`sidebar-glass ${open ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand-row">
                    <div className="sidebar-brand-mark" style={{ background: 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
                        <MdWaterDrop size={20} color="#ffffff" />
                    </div>
                    <div className="brand-text">
                        <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>WaterWatch</h2>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{roleLabel}</span>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link-glass ${isActive ? 'active' : ''}`}
                        onClick={handleNav}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={handleLogout}
                    className="nav-link-glass nav-link-danger"
                >
                    <MdLogout />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
