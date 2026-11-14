import React from 'react';
import { MdClose, MdThumbUp, MdLocationOn, MdApartment, MdWaterDrop, MdCheckCircle, MdSchedule, MdEngineering } from 'react-icons/md';
import { upvoteReport } from '../services/waterWatchService';

function getStatusBadge(status) {
    const s = String(status || '').toLowerCase();
    if (s.includes('resolv')) {
        return { label: 'Resolved', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' };
    }
    if (s.includes('progress')) {
        return { label: 'In Progress', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' };
    }
    if (s.includes('review')) {
        return { label: 'Under Review', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' };
    }
    return { label: 'Open', bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' };
}

function getSeverityBadge(severity) {
    const s = String(severity || '').toLowerCase();
    if (s === 'critical') return { bg: '#dc2626', color: '#fff' };
    if (s === 'high') return { bg: '#ea580c', color: '#fff' };
    if (s === 'medium') return { bg: '#f59e0b', color: '#fff' };
    return { bg: '#059669', color: '#fff' };
}

export default function ReportDetailsModal({ report, open, onClose, onRefresh }) {
    if (!open || !report) return null;

    const coords = report?.coordinates || [];
    const lat = Number(coords[0]);
    const lng = Number(coords[1]);
    const statusInfo = getStatusBadge(report.status);
    const sevInfo = getSeverityBadge(report.severity);

    const handleUpvote = (e) => {
        e.stopPropagation();
        upvoteReport(report.id);
        if (onRefresh) onRefresh();
    };

    return (
        <div
            className="report-modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Report ${report.id}`}
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
        >
            <div
                className="report-modal-card"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-surface, #18181b)',
                    border: '1px solid var(--border-default, #3f3f46)',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '680px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    padding: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    color: 'var(--text-primary)',
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>
                                {report.id}
                            </span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: report.environment === 'College' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                    color: report.environment === 'College' ? '#38bdf8' : '#34d399',
                                }}
                            >
                                {report.environment === 'College' ? '🎓 College Campus' : '🏢 Residential Society'}
                            </span>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: sevInfo.bg,
                                    color: sevInfo.color,
                                }}
                            >
                                {report.severity} Severity
                            </span>
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, lineHeight: 1.3 }}>
                            {report.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-ghost"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                        }}
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {/* Location & Institution strip */}
                <div
                    style={{
                        padding: '12px 14px',
                        background: 'var(--bg-surface-secondary, #202024)',
                        borderRadius: '10px',
                        marginBottom: '16px',
                        border: '1px solid var(--border-default, #3f3f46)',
                        fontSize: '13px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
                        <MdApartment size={16} />
                        <span>{report.institution}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>({report.ward})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                        <MdLocationOn size={16} />
                        <span>{report.location}</span>
                    </div>
                </div>

                {/* Photos Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: report.fixed_image_url ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Report Evidence Photo:
                        </div>
                        <img
                            src={report.image_url}
                            alt="Leakage evidence"
                            style={{
                                width: '100%',
                                height: '180px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop';
                            }}
                        />
                    </div>
                    {report.fixed_image_url && (
                        <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
                                Verified Resolution Evidence:
                            </div>
                            <img
                                src={report.fixed_image_url}
                                alt="Resolution evidence"
                                style={{
                                    width: '100%',
                                    height: '180px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(16, 185, 129, 0.4)',
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Description */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Problem Description:
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                        {report.description}
                    </p>
                </div>

                {/* Conservation & Metrics Badges */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '10px',
                        marginBottom: '16px',
                    }}
                >
                    <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div style={{ fontSize: '11px', color: '#f87171' }}>Wastage Rate</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444' }}>~{report.estimatedLitersPerHour || 40} L/hr</div>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ fontSize: '11px', color: '#34d399' }}>Water Saved</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{report.estimatedWaterSavedLiters || 0} Liters</div>
                    </div>

                    <div style={{ padding: '10px', background: statusInfo.bg, borderRadius: '8px', border: `1px solid ${statusInfo.border}` }}>
                        <div style={{ fontSize: '11px', color: statusInfo.color }}>Current Status</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: statusInfo.color }}>{statusInfo.label}</div>
                    </div>

                    <div style={{ padding: '10px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
                        <div style={{ fontSize: '11px', color: '#38bdf8' }}>Category</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0ea5e9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {report.category}
                        </div>
                    </div>
                </div>

                {/* Assigned Maintenance Squad */}
                <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#818cf8', fontWeight: 700, marginBottom: '4px' }}>
                        <MdEngineering size={16} />
                        <span>Assigned Maintenance Team:</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{report.assignedTeam || 'Unassigned — Pending Allocation'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Reported by: {report.reportedBy} • {new Date(report.reportedAt || report.created_at).toLocaleString()}
                    </div>
                </div>

                {/* Progress Timeline */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Repair Progress Timeline
                    </div>
                    <div style={{ borderLeft: '2px solid rgba(14, 165, 233, 0.3)', paddingLeft: '14px', marginLeft: '6px' }}>
                        {(report.timeline || []).map((step, idx) => (
                            <div key={idx} style={{ marginBottom: '12px', position: 'relative' }}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: '-21px',
                                        top: '2px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: step.status === 'Resolved' ? '#10b981' : step.status === 'In Progress' ? '#f59e0b' : '#0ea5e9',
                                        border: '2px solid var(--bg-surface, #0f172a)',
                                    }}
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        {step.status}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {new Date(step.date).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                    {step.note}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                    — {step.updatedBy}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-default, rgba(255,255,255,0.1))' }}>
                    <button
                        onClick={handleUpvote}
                        className="btn btn-secondary-glass"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <MdThumbUp size={15} color="#0ea5e9" />
                        <span>Upvote / Confirm Leak ({report.upvotes || 0})</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="btn btn-primary-filled"
                        style={{ padding: '6px 18px', fontSize: '13px' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
