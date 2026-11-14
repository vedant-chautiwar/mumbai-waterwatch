import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdWaterDrop,
    MdWarning,
    MdBuild,
    MdCheckCircle,
    MdPending,
    MdEco,
    MdEngineering,
    MdApartment,
    MdLocationOn,
    MdEdit,
    MdSearch,
    MdClose,
    MdAssignmentInd,
    MdArrowForward,
} from 'react-icons/md';
import {
    getStoredReports,
    getWaterWatchStats,
    subscribeToWaterWatch,
    updateReportStatus,
    assignMaintenanceTeam,
    MAINTENANCE_TEAMS,
} from '../../services/waterWatchService';
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

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState({
        totalReports: 0,
        pendingRepairs: 0,
        leaksUnderRepair: 0,
        resolvedLeaks: 0,
        criticalLeaks: 0,
        estimatedWaterWastageLiters: 0,
        estimatedWaterSavedLiters: 0,
        tankerEquivalentSaved: 0,
    });
    const [statusFilter, setStatusFilter] = useState('All');
    const [envFilter, setEnvFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modals
    const [selectedReport, setSelectedReport] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [editStatus, setEditStatus] = useState('In Progress');
    const [editTeam, setEditTeam] = useState(MAINTENANCE_TEAMS[0].name);
    const [editNote, setEditNote] = useState('');
    const [toast, setToast] = useState(null);

    const refreshData = () => {
        setReports(getStoredReports());
        setStats(getWaterWatchStats());
    };

    useEffect(() => {
        refreshData();
        const unsubscribe = subscribeToWaterWatch(refreshData);
        return () => unsubscribe();
    }, []);

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesStatus =
                statusFilter === 'All' ||
                (statusFilter === 'Pending' && r.status !== 'Resolved') ||
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

    const openEditModal = (report, e) => {
        if (e) e.stopPropagation();
        setEditingReport(report);
        setEditStatus(report.status === 'Open' ? 'In Progress' : report.status);
        setEditTeam(report.assignedTeam || MAINTENANCE_TEAMS[0].name);
        setEditNote(`Updated status for ${report.id} on ${new Date().toLocaleDateString()}`);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (!editingReport) return;

        const fixedImg = editStatus === 'Resolved'
            ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
            : null;

        updateReportStatus(
            editingReport.id,
            editStatus,
            editNote,
            fixedImg,
            editTeam
        );

        setEditingReport(null);
        refreshData();
        setToast(`Report ${editingReport.id} successfully updated to ${editStatus}!`);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="page-container">
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        background: '#10b981',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <MdCheckCircle size={20} />
                    <span>{toast}</span>
                </div>
            )}

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', marginBottom: '4px' }}>
                        <MdEngineering size={22} />
                        <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                            MCGM Water Department & Campus Estates
                        </span>
                    </div>
                    <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Water Leakage Management Command
                    </h1>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => navigate('/admin/map')}
                        className="btn btn-secondary-glass"
                        style={{ padding: '9px 16px', fontSize: '13px' }}
                    >
                        Infrastructure Map
                    </button>
                    <button
                        onClick={() => navigate('/admin/analytics')}
                        className="btn btn-primary-filled"
                        style={{ padding: '9px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <span>Conservation Analytics</span>
                        <MdArrowForward size={16} />
                    </button>
                </div>
            </div>

            {/* Authority KPI Metrics */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '14px',
                    marginBottom: '28px',
                }}
            >
                {/* Total Reports */}
                <div className="card-glass" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Reports</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalReports}</div>
                    <div style={{ fontSize: '11px', color: '#38bdf8' }}>Colleges & Societies</div>
                </div>

                {/* Pending Repairs */}
                <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ fontSize: '12px', color: '#f87171', fontWeight: 600 }}>Pending Repairs</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{stats.pendingRepairs}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Require team assignment</div>
                </div>

                {/* Critical Leaks */}
                <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #dc2626' }}>
                    <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 700 }}>Critical Leakages</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626' }}>{stats.criticalLeaks}</div>
                    <div style={{ fontSize: '11px', color: '#dc2626' }}>Immediate action needed</div>
                </div>

                {/* Completed Repairs */}
                <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>Completed Repairs</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{stats.resolvedLeaks}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Arrested & certified</div>
                </div>

                {/* Estimated Water Wastage */}
                <div className="card-glass" style={{ padding: '16px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 600 }}>Total Water Loss</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b' }}>
                        {stats.estimatedWaterWastageLiters.toLocaleString()} L
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Potable loss to date</div>
                </div>

                {/* Estimated Water Saved */}
                <div className="card-glass" style={{ padding: '16px', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>Water Saved</div>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                        {stats.estimatedWaterSavedLiters.toLocaleString()} L
                    </div>
                    <div style={{ fontSize: '11px', color: '#34d399' }}>
                        ~{stats.tankerEquivalentSaved} Tanker equiv.
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-glass-strong)',
                    border: '1px solid var(--border-default)',
                }}
            >
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`btn ${statusFilter === st ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '5px 12px', fontSize: '12px', borderRadius: '16px' }}
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
                            padding: '6px 10px',
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
                            placeholder="Search report ID, location..."
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

            {/* Management Table */}
            <div className="table-glass-container" style={{ overflowX: 'auto', borderRadius: '12px', marginBottom: '24px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '12px 14px' }}>Report ID</th>
                            <th style={{ padding: '12px 14px' }}>Leakage Type & Title</th>
                            <th style={{ padding: '12px 14px' }}>Institution / Location</th>
                            <th style={{ padding: '12px 14px' }}>Severity</th>
                            <th style={{ padding: '12px 14px' }}>Status</th>
                            <th style={{ padding: '12px 14px' }}>Assigned Team</th>
                            <th style={{ padding: '12px 14px' }}>Reported</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map((report) => {
                            const statusBadge = getStatusBadge(report.status);
                            const sevBadge = getSeverityBadge(report.severity);

                            return (
                                <tr
                                    key={report.id}
                                    style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer' }}
                                    onClick={() => {
                                        setSelectedReport(report);
                                        setShowDetailModal(true);
                                    }}
                                >
                                    <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8' }}>
                                        {report.id}
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{report.title}</div>
                                        <div style={{ fontSize: '11px', color: '#0ea5e9' }}>{report.category}</div>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <div style={{ fontWeight: 600 }}>{report.institution}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{report.location} ({report.ward})</div>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: sevBadge.bg, color: sevBadge.color }}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: statusBadge.bg, color: statusBadge.color }}>
                                            {statusBadge.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {report.assignedTeam || (
                                            <span style={{ color: '#ef4444', fontStyle: 'italic' }}>Pending Assignment</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {new Date(report.reportedAt || report.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                            <button
                                                type="button"
                                                onClick={(e) => openEditModal(report, e)}
                                                className="btn btn-primary-filled"
                                                style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <MdEdit size={13} />
                                                <span>Update</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Action / Update Status Modal */}
            {editingReport && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '16px',
                    }}
                    onClick={() => setEditingReport(null)}
                >
                    <div
                        style={{
                            background: 'var(--bg-surface, #18181b)',
                            border: '1px solid var(--border-default)',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '540px',
                            padding: '24px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            color: 'var(--text-primary)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                                    {editingReport.id}
                                </span>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0 0' }}>
                                    Update Repair Status & Assign Squad
                                </h3>
                            </div>
                            <button
                                onClick={() => setEditingReport(null)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                            >
                                <MdClose size={22} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Repair Status
                                </label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default)',
                                        fontSize: '13px',
                                    }}
                                >
                                    <option value="Open">Open (Pending Triage)</option>
                                    <option value="Under Review">Under Review (Inspecting)</option>
                                    <option value="In Progress">In Progress (Plumber On Site)</option>
                                    <option value="Resolved">Resolved (Leak Arrested & Certified)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Assign Maintenance Team / Squad
                                </label>
                                <select
                                    value={editTeam}
                                    onChange={(e) => setEditTeam(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default)',
                                        fontSize: '13px',
                                    }}
                                >
                                    {MAINTENANCE_TEAMS.map((team) => (
                                        <option key={team.id} value={team.name}>
                                            {team.name} ({team.type})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Repair Log / Status Update Note
                                </label>
                                <textarea
                                    value={editNote}
                                    onChange={(e) => setEditNote(e.target.value)}
                                    rows={3}
                                    required
                                    placeholder="Enter repair details (e.g. ball valve replaced, pressure tested at 2.2 bar, leak arrested)..."
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default)',
                                        fontSize: '13px',
                                    }}
                                />
                            </div>

                            {editStatus === 'Resolved' && (
                                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '16px', fontSize: '12px', color: '#34d399' }}>
                                    ✓ Marking as <strong>Resolved</strong> will attach certified resolution photographic proof and credit water savings to the institutional conservation balance.
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingReport(null)}
                                    className="btn btn-ghost"
                                    style={{ padding: '8px 16px' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary-filled"
                                    style={{ padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
                                >
                                    Save & Broadcast Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Details Modal */}
            <ReportDetailsModal
                report={selectedReport}
                open={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                onRefresh={refreshData}
            />
        </div>
    );
}
