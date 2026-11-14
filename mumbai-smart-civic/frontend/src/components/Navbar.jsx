import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdSwapHoriz, MdWaterDrop } from 'react-icons/md';
import ThemeToggle from './ui/ThemeToggle';

const pageTitles = {
    '/citizen/dashboard': 'Citizen & Campus Water Dashboard',
    '/citizen/report': 'Report Water Leakage & Wastage',
    '/citizen/my-reports': 'My Leakage Reports & Repair Tracking',
    '/citizen/my-complaints': 'My Leakage Reports & Repair Tracking',
    '/citizen/map': 'Mumbai Leakage & Wastage Map',
    '/citizen/heatmap': 'Mumbai Leakage & Wastage Map',
    '/citizen/conservation': 'Water Conservation Hub & Best Practices',
    '/citizen/announcements': 'Civic & Institutional Water Notices',
    '/citizen/notifications': 'Civic & Institutional Water Notices',
    '/citizen/progress-dashboard': 'Conservation Progress',
    '/admin/dashboard': 'Authority Water Leakage Management Command',
    '/admin/manage-reports': 'Leakage Reports Management',
    '/admin/all-complaints': 'Leakage Reports Management',
    '/admin/map': 'Mumbai Infrastructure Leakage Map',
    '/admin/resolve': 'Resolve Leakages & Dispatch Teams',
    '/admin/analytics': 'Water Conservation & Wastage Analytics',
    '/admin/announcements': 'Authority Advisories & Directive Broadcasting',
};

export default function Navbar({ onMenuClick }) {
    const location = useLocation();
    const navigate = useNavigate();
    const title = pageTitles[location.pathname] || 'Mumbai WaterWatch';

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch { }

    const isAuthority = user?.role === 'authority' || user?.role === 'admin';

    const handleSwitchRole = () => {
        if (isAuthority) {
            const citizenUser = {
                name: 'Aditya Deshmukh (Student)',
                email: 'aditya.deshmukh@vjti.ac.in',
                role: 'citizen',
                environment: 'College',
                institution: 'Veermata Jijabai Technological Institute (VJTI)',
            };
            localStorage.setItem('user', JSON.stringify(citizenUser));
            navigate('/citizen/dashboard');
        } else {
            const authorityUser = {
                name: 'Er. Rajesh Kulkarni (MCGM)',
                email: 'rajesh.kulkarni@waterwatch.mumbai.gov.in',
                role: 'authority',
                authority_rank: 'Executive Engineer',
            };
            localStorage.setItem('user', JSON.stringify(authorityUser));
            navigate('/admin/dashboard');
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : 'WW';

    return (
        <header className="navbar-glass">
            <div className="navbar-left">
                <button onClick={onMenuClick} className="mobile-menu-btn navbar-menu-btn" aria-label="Open menu">
                    <MdMenu size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0ea5e9' }}>
                        <MdWaterDrop size={22} />
                    </div>
                    <div>
                        <h1 className="navbar-title" style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{title}</h1>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {user?.institution ? `${user.institution} • ` : ''}Mumbai WaterWatch
                        </span>
                    </div>
                </div>
            </div>

            <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* 1-Click Role Switcher */}
                <button
                    onClick={handleSwitchRole}
                    className="btn btn-secondary-glass"
                    style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: '20px',
                        border: '1px solid rgba(14, 165, 233, 0.35)',
                        background: 'rgba(14, 165, 233, 0.1)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                    }}
                    title="Quickly switch between Citizen and Authority roles"
                >
                    <MdSwapHoriz size={16} color="#0ea5e9" />
                    <span>Switch to {isAuthority ? 'Citizen View' : 'Authority View'}</span>
                </button>

                <ThemeToggle />

                <div className="user-info-desktop navbar-user-copy" style={{ textAlign: 'right' }}>
                    <span className="navbar-user-name" style={{ fontWeight: 600 }}>{user?.name || 'Portal User'}</span>
                    <span className="navbar-user-role" style={{ fontSize: '11px', color: isAuthority ? '#818cf8' : '#38bdf8' }}>
                        {isAuthority ? 'Authority Officer' : (user?.environment ? `${user.environment} Reporter` : 'Citizen Reporter')}
                    </span>
                </div>

                <div
                    className="navbar-avatar"
                    style={{
                        background: isAuthority
                            ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                            : 'linear-gradient(135deg, #0284c7, #0369a1)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px',
                    }}
                >
                    {initials}
                </div>
            </div>
        </header>
    );
}
