import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdEngineering, MdWaterDrop, MdPhotoCamera, MdClose } from 'react-icons/md';
import {
    getStoredReports,
    updateReportStatus,
    MAINTENANCE_TEAMS,
    subscribeToWaterWatch,
} from '../../services/waterWatchService';

export default function ResolveComplaint() {
    const [reports, setReports] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState('');
    const [note, setNote] = useState('');
    const [team, setTeam] = useState(MAINTENANCE_TEAMS[0].name);
    const [status, setStatus] = useState('Resolved');
    const [toast, setToast] = useState(null);

    const refreshData = () => {
        const list = getStoredReports();
        setReports(list);
        if (!selectedReportId && list.length > 0) {
            setSelectedReportId(list[0].id);
        }
    };

    useEffect(() => {
        refreshData();
        const unsubscribe = subscribeToWaterWatch(refreshData);
        return () => unsubscribe();
    }, []);

    const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

    const handleResolve = (e) => {
        e.preventDefault();
        if (!selectedReport) return;

        const fixedImage = status === 'Resolved'
            ? 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop'
            : null;

        updateReportStatus(
            selectedReport.id,
            status,
            note || `Maintenance action completed by ${team}.`,
            fixedImage,
            team
        );

        setToast(`Report ${selectedReport.id} successfully updated to ${status}!`);
        setNote('');
        refreshData();
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
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

            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '4px' }}>
                    <MdCheckCircle size={22} />
                    <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Rapid Response & Resolution
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Resolve Leakages & Dispatch Teams
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Assign municipal or campus plumbing maintenance squads and record verified repair actions.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Left: Select Leakage Case */}
                <div className="card-glass" style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                        Select Active Leakage Case
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                        {reports.map((r) => {
                            const isSelected = r.id === selectedReportId;
                            const isResolved = r.status === 'Resolved';

                            return (
                                <div
                                    key={r.id}
                                    onClick={() => setSelectedReportId(r.id)}
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'var(--bg-glass, rgba(255,255,255,0.02))',
                                        border: `1px solid ${isSelected ? '#0ea5e9' : 'var(--border-default)'}`,
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8' }}>{r.id}</span>
                                        <span style={{ fontWeight: 700, color: isResolved ? '#10b981' : '#f59e0b' }}>{r.status}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        {r.title}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {r.institution} • {r.ward}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Resolution & Dispatch Form */}
                {selectedReport && (
                    <div className="card-glass" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                                    {selectedReport.id}
                                </span>
                                <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '2px 0 0 0' }}>
                                    {selectedReport.title}
                                </h3>
                                <div style={{ fontSize: '12px', color: '#0ea5e9', marginTop: '2px' }}>
                                    {selectedReport.institution} ({selectedReport.location})
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleResolve}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Update Status:
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
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
                                    <option value="In Progress">In Progress (Plumber On Site)</option>
                                    <option value="Under Review">Under Review</option>
                                    <option value="Resolved">Resolved (Leak Arrested)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Assign / Reassign Squad:
                                </label>
                                <select
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
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
                                    {MAINTENANCE_TEAMS.map((t) => (
                                        <option key={t.id} value={t.name}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Action / Repair Log Note:
                                </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows={3}
                                    placeholder="Enter repair details (e.g. replaced ball float valve, installed new 2.5 bar regulator, tested for 30 minutes with zero seepage)..."
                                    required
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary-filled"
                                    style={{
                                        padding: '10px 22px',
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                    }}
                                >
                                    <MdCheckCircle size={18} />
                                    <span>Submit Resolution Action</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
