import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdSearch,
    MdFilterList,
    MdWaterDrop,
    MdLocationOn,
    MdApartment,
    MdAddCircleOutline,
    MdCheckCircle,
    MdPending,
    MdBuild,
    MdEngineering,
    MdViewAgenda,
    MdViewList,
} from 'react-icons/md';
import { getStoredReports, subscribeToWaterWatch } from '../../services/waterWatchService';
import ReportDetailsModal from '../../components/ReportDetailsModal';

function getStatusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('resolv')) return { label: 'Resolved', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
    if (s.includes('progress')) return { label: 'In Progress', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
    if (s.includes('review')) return { label: 'Under Review', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' };
    return { label: 'Open', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
}

function getSeverityBadge(severity) {
    const s = String(severity || '').toLowerCase();
    if (s === 'critical') return { bg: '#dc2626', color: '#fff' };
    if (s === 'high') return { bg: '#ea580c', color: '#fff' };
    if (s === 'medium') return { bg: '#f59e0b', color: '#fff' };
    return { bg: '#059669', color: '#fff' };
}

export default function MyReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [envFilter, setEnvFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const refreshData = () => {
        setReports(getStoredReports());
    };

    useEffect(() => {
        refreshData();
        const unsubscribe = subscribeToWaterWatch(refreshData);
        return () => unsubscribe();
    }, []);

    const filtered = useMemo(() => {
        return reports.filter((r) => {
            const matchesStatus =
                statusFilter === 'All' ||
                (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());
            const matchesEnv =
                envFilter === 'All' || r.environment === envFilter;
            const matchesSearch =
                !searchQuery.trim() ||
                (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.institution && r.institution.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesStatus && matchesEnv && matchesSearch;
        });
    }, [reports, statusFilter, envFilter, searchQuery]);

    const openDetails = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    return (
        <div className="page-container">
            {/* Top Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                        My Reports & Repair Tracking
                    </h1>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                        Track submitted water leakage cases and monitor repair progress across Mumbai.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', background: 'var(--bg-glass-strong)', borderRadius: '8px', border: '1px solid var(--border-default)', padding: '2px' }}>
                        <button
                            type="button"
                            onClick={() => setViewMode('card')}
                            className={`btn ${viewMode === 'card' ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Card View"
                        >
                            <MdViewAgenda size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            className={`btn ${viewMode === 'table' ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '6px 10px', fontSize: '12px' }}
                            title="Table View"
                        >
                            <MdViewList size={16} />
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/citizen/report')}
                        className="btn btn-primary-filled"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', fontSize: '13px' }}
                    >
                        <MdAddCircleOutline size={18} />
                        <span>Report New Leakage</span>
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '20px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-glass-strong)',
                    border: '1px solid var(--border-default)',
                }}
            >
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['All', 'Open', 'Under Review', 'In Progress', 'Resolved'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`btn ${statusFilter === st ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '20px' }}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                        value={envFilter}
                        onChange={(e) => setEnvFilter(e.target.value)}
                        style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-input, #1e293b)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                            fontSize: '12px',
                        }}
                    >
                        <option value="All">All Environments</option>
                        <option value="College">🎓 Colleges</option>
                        <option value="Residential">🏢 Residential Societies</option>
                    </select>

                    <div style={{ position: 'relative', width: '220px' }}>
                        <MdSearch size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filter by ID, Title, Place..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px 10px 6px 32px',
                                borderRadius: '8px',
                                background: 'var(--bg-input, #1e293b)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-default)',
                                fontSize: '12px',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Results Counter */}
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Showing <strong>{filtered.length}</strong> reports ({reports.length} total)
            </div>

            {/* View Mode: Cards */}
            {viewMode === 'card' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {filtered.map((report) => {
                        const statusBadge = getStatusBadge(report.status);
                        const sevBadge = getSeverityBadge(report.severity);

                        return (
                            <div
                                key={report.id}
                                onClick={() => openDetails(report)}
                                className="card-glass"
                                style={{
                                    padding: '18px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div>
                                    {/* Badges Bar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                                                {report.id}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: report.environment === 'College' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                    color: report.environment === 'College' ? '#38bdf8' : '#34d399',
                                                }}
                                            >
                                                {report.environment}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: sevBadge.bg, color: sevBadge.color }}>
                                                {report.severity}
                                            </span>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: statusBadge.bg, color: statusBadge.color }}>
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                                        {report.title}
                                    </h3>

                                    {/* Institution & Location */}
                                    <div style={{ fontSize: '12px', color: '#0ea5e9', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        <MdApartment size={14} />
                                        <span>{report.institution}</span>
                                    </div>

                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                        <MdLocationOn size={14} />
                                        <span>{report.location} ({report.ward})</span>
                                    </div>

                                    {/* Progress Step Indicator */}
                                    <div style={{ padding: '10px 12px', background: 'var(--bg-surface-secondary, #202024)', borderRadius: '8px', border: '1px solid var(--border-default)', marginBottom: '12px' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>Maintenance Progress</span>
                                            <span style={{ fontWeight: 600, color: statusBadge.color }}>{report.status}</span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: report.status === 'Resolved' ? '100%' : report.status === 'In Progress' ? '65%' : report.status === 'Under Review' ? '35%' : '15%',
                                                    background: statusBadge.color,
                                                    transition: 'width 0.4s ease',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: Team & Date */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-default)', fontSize: '11px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                                        <MdEngineering size={14} color="#818cf8" />
                                        <span style={{ maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {report.assignedTeam || 'Team Assignment Pending'}
                                        </span>
                                    </div>
                                    <span style={{ color: 'var(--text-muted)' }}>
                                        {new Date(report.reportedAt || report.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Mode: Table */}
            {viewMode === 'table' && (
                <div className="table-glass-container" style={{ overflowX: 'auto', borderRadius: '12px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 16px' }}>Report ID</th>
                                <th style={{ padding: '12px 16px' }}>Environment & Title</th>
                                <th style={{ padding: '12px 16px' }}>Location / Ward</th>
                                <th style={{ padding: '12px 16px' }}>Severity</th>
                                <th style={{ padding: '12px 16px' }}>Status</th>
                                <th style={{ padding: '12px 16px' }}>Assigned Team</th>
                                <th style={{ padding: '12px 16px' }}>Date</th>
                                <th style={{ padding: '12px 16px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((report) => {
                                const statusBadge = getStatusBadge(report.status);
                                const sevBadge = getSeverityBadge(report.severity);

                                return (
                                    <tr
                                        key={report.id}
                                        style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer' }}
                                        onClick={() => openDetails(report)}
                                    >
                                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                                            {report.id}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{report.title}</div>
                                            <div style={{ fontSize: '11px', color: '#0ea5e9' }}>{report.institution}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                                            <div>{report.location}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{report.ward}</div>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: sevBadge.bg, color: sevBadge.color }}>
                                                {report.severity}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: statusBadge.bg, color: statusBadge.color }}>
                                                {statusBadge.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {report.assignedTeam || 'Pending Assignment'}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {new Date(report.reportedAt || report.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDetails(report);
                                                }}
                                                className="btn btn-secondary-glass"
                                                style={{ padding: '4px 10px', fontSize: '11px' }}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <MdWaterDrop size={40} style={{ opacity: 0.4, marginBottom: '10px' }} />
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>No leakage reports found</div>
                    <div style={{ fontSize: '13px' }}>Try adjusting your search criteria or filter options.</div>
                </div>
            )}

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

