import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    MdWaterDrop,
    MdAddCircleOutline,
    MdCheckCircle,
    MdPending,
    MdBuild,
    MdApartment,
    MdLocationOn,
    MdTrendingUp,
    MdNotifications,
    MdArrowForward,
    MdSearch,
    MdEco,
    MdWarning,
    MdThumbUp,
} from 'react-icons/md';
import {
    getStoredReports,
    getWaterWatchStats,
    subscribeToWaterWatch,
    ANNOUNCEMENTS,
    upvoteReport,
} from '../../services/waterWatchService';
import ReportDetailsModal from '../../components/ReportDetailsModal';

export default function CitizenDashboard() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalReports: 0,
        pendingRepairs: 0,
        leaksUnderRepair: 0,
        resolvedLeaks: 0,
        estimatedWaterSavedLiters: 0,
        tankerEquivalentSaved: 0,
    });
    const [envFilter, setEnvFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user'));
    } catch { }

    const refreshData = () => {
        const list = getStoredReports();
        setReports(list);
        setStats(getWaterWatchStats());
    };

    useEffect(() => {
        refreshData();
        const unsubscribe = subscribeToWaterWatch(refreshData);
        return () => unsubscribe();
    }, []);

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesEnv = envFilter === 'All' || r.environment === envFilter;
            const matchesSearch = !searchQuery.trim() ||
                (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.institution && r.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesEnv && matchesSearch;
        });
    }, [reports, envFilter, searchQuery]);

    const recentReports = useMemo(() => filteredReports.slice(0, 6), [filteredReports]);

    const nearbyReports = useMemo(() => {
        // Show reports matching user's institution or ward if logged in, or top critical/active leaks
        return reports
            .filter((r) => r.status !== 'Resolved')
            .slice(0, 4);
    }, [reports]);

    const openDetails = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleUpvote = (e, id) => {
        e.stopPropagation();
        upvoteReport(id);
        refreshData();
    };

    return (
        <div className="page-container">
            {/* Hero / Announcement Banner */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.15))',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <div style={{ maxWidth: '640px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                        <MdWaterDrop size={20} />
                        <span>MUMBAI WATERWATCH • CIVIC SUSTAINABILITY PORTAL</span>
                    </div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                        Welcome, {user?.name || 'Citizen'}!
                    </h1>
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                        Monitoring water leakage and wastage across colleges and residential societies. Every reported leak saves thousands of liters of clean potable water.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/citizen/report')}
                        className="btn btn-primary-filled"
                        style={{
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 10px 25px -5px rgba(14, 165, 233, 0.4)',
                        }}
                    >
                        <MdAddCircleOutline size={20} />
                        <span>Report Water Leakage</span>
                    </button>
                    <button
                        onClick={() => navigate('/citizen/map')}
                        className="btn btn-secondary-glass"
                        style={{ padding: '12px 18px', fontSize: '14px', fontWeight: 600 }}
                    >
                        View Mumbai Map
                    </button>
                </div>
            </div>

            {/* Dashboard Statistics Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                {/* Total Reported Leaks */}
                <div className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(14, 165, 233, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0ea5e9',
                        }}
                    >
                        <MdWaterDrop size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Reported Leaks</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalReports}</div>
                        <div style={{ fontSize: '11px', color: '#0ea5e9' }}>Across 18 institutions</div>
                    </div>
                </div>

                {/* Pending Repairs */}
                <div className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                        }}
                    >
                        <MdPending size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Repairs</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{stats.pendingRepairs}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Awaiting maintenance team</div>
                    </div>
                </div>

                {/* Leaks Under Repair */}
                <div className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#f59e0b',
                        }}
                    >
                        <MdBuild size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Leaks Under Repair</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{stats.leaksUnderRepair}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Plumber squad on site</div>
                    </div>
                </div>

                {/* Resolved Leaks */}
                <div className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                        }}
                    >
                        <MdCheckCircle size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved Leaks</div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{stats.resolvedLeaks}</div>
                        <div style={{ fontSize: '11px', color: '#10b981' }}>Fixed & verified</div>
                    </div>
                </div>

                {/* Estimated Water Saved */}
                <div className="card-glass" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#34d399',
                        }}
                    >
                        <MdEco size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>Estimated Water Saved</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                            {stats.estimatedWaterSavedLiters.toLocaleString()} L
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            ~{stats.tankerEquivalentSaved} Domestic Tankers
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '20px',
                }}
            >
                <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-glass-strong)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-default)' }}>
                    {['All', 'College', 'Residential'].map((env) => (
                        <button
                            key={env}
                            onClick={() => setEnvFilter(env)}
                            className={`btn ${envFilter === env ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                        >
                            {env === 'All' ? 'All Environments' : env === 'College' ? '🎓 Colleges' : '🏢 Residential Societies'}
                        </button>
                    ))}
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                    <MdSearch size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search leakages, colleges, societies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 34px',
                            borderRadius: '8px',
                            background: 'var(--bg-input, #1e293b)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                            fontSize: '12px',
                        }}
                    />
                </div>
            </div>

            {/* Grid Layout: Main Feed & Side Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Left / Main Column: Recent Leakage Reports */}
                <div style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            Recent Water Leakage Reports
                        </h2>
                        <Link
                            to="/citizen/my-reports"
                            style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                        >
                            <span>View All Reports</span>
                            <MdArrowForward size={14} />
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {recentReports.map((report) => {
                            const isResolved = report.status === 'Resolved';
                            const isInProgress = report.status === 'In Progress';
                            const statusColor = isResolved ? '#10b981' : isInProgress ? '#f59e0b' : '#ef4444';

                            return (
                                <div
                                    key={report.id}
                                    onClick={() => openDetails(report)}
                                    className="card-glass"
                                    style={{
                                        padding: '16px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, border-color 0.2s ease',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    background: report.environment === 'College' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                    color: report.environment === 'College' ? '#38bdf8' : '#34d399',
                                                }}
                                            >
                                                {report.environment === 'College' ? '🎓 College' : '🏢 Residential'}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    background: `${statusColor}22`,
                                                    color: statusColor,
                                                }}
                                            >
                                                {report.status}
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                                            {report.title}
                                        </h3>

                                        <div style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                            <MdApartment size={14} />
                                            <span>{report.institution}</span>
                                        </div>

                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                                            <MdLocationOn size={14} />
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {report.location}
                                            </span>
                                        </div>

                                        <img
                                            src={report.image_url}
                                            alt={report.title}
                                            style={{
                                                width: '100%',
                                                height: '130px',
                                                objectFit: 'cover',
                                                borderRadius: '8px',
                                                marginBottom: '10px',
                                            }}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-default)', fontSize: '11px' }}>
                                        <span style={{ color: '#ef4444', fontWeight: 600 }}>
                                            Loss: ~{report.estimatedLitersPerHour || 40} L/hr
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => handleUpvote(e, report.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#38bdf8',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            <MdThumbUp size={13} />
                                            <span>{report.upvotes || 0}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Nearby Leaks, Water Conservation Tips & Announcements */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Active Hotspots Alert */}
                    <div className="card-glass" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '12px' }}>
                            <MdWarning size={20} />
                            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                Urgent Unresolved Leaks
                            </h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {nearbyReports.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => openDetails(item)}
                                    style={{
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-surface-secondary, #202024)',
                                        border: '1px solid var(--border-default, #3f3f46)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>{item.severity} Severity</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{item.ward}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        {item.institution}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {item.category} • ~{item.estimatedLitersPerHour} L/hr
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Water Conservation Widget */}
                    <div
                        className="card-glass"
                        style={{
                            padding: '20px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.08))',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '10px' }}>
                            <MdEco size={22} />
                            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                Water Conservation Tips
                            </h3>
                        </div>
                        <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', paddingLeft: '18px', margin: '0 0 14px 0', lineHeight: 1.6 }}>
                            <li>A single leaking faucet tap can waste over <strong>4,000 liters</strong> of potable water each year.</li>
                            <li>Check college washroom flush valves; continuous runs discharge up to <strong>900 L/day</strong>.</li>
                            <li>Prompt residential societies to install mechanical float shut-offs on overhead sumps.</li>
                        </ul>
                        <Link
                            to="/citizen/conservation"
                            className="btn btn-secondary-glass"
                            style={{ width: '100%', textAlign: 'center', display: 'block', fontSize: '12px', padding: '8px' }}
                        >
                            Open Water Conservation Guide
                        </Link>
                    </div>

                    {/* Latest Civic Announcements */}
                    <div className="card-glass" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '12px' }}>
                            <MdNotifications size={20} />
                            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                Latest Announcements
                            </h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {ANNOUNCEMENTS.slice(0, 3).map((ann) => (
                                <div key={ann.id} style={{ fontSize: '12px', borderBottom: '1px solid var(--border-default)', paddingBottom: '10px' }}>
                                    <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                                        {ann.badge} • {ann.date}
                                    </div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '2px 0 4px 0' }}>
                                        {ann.title}
                                    </div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.4 }}>
                                        {ann.summary}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <ReportDetailsModal
                report={selectedReport}
                open={showModal}
                onClose={() => setShowModal(false)}
                onRefresh={refreshData}
            />
        </div>
    );
}
