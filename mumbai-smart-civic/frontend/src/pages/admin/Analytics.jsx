import React, { useState } from 'react';
import {
    MdAnalytics,
    MdWaterDrop,
    MdEco,
    MdTrendingUp,
    MdApartment,
    MdWarning,
    MdCheckCircle,
    MdBarChart,
} from 'react-icons/md';
import { ANALYTICS_DATA } from '../../data/analytics';
import { getWaterWatchStats } from '../../services/waterWatchService';

export default function Analytics() {
    const [selectedWard, setSelectedWard] = useState('All');
    const dynamicStats = getWaterWatchStats();
    const data = ANALYTICS_DATA;

    return (
        <div className="page-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '4px' }}>
                    <MdAnalytics size={24} />
                    <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Sustainability SUS-02 Analytics
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Water Conservation & Wastage Intelligence
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Comprehensive spatial analytics, ward-wise leakage patterns, and water conservation impact across Mumbai.
                </p>
            </div>

            {/* Top KPI Summary */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                <div className="card-glass" style={{ padding: '18px 20px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ fontSize: '12px', color: '#34d399', fontWeight: 700 }}>Total Water Saved</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                        {(dynamicStats.estimatedWaterSavedLiters || data.summary.estimatedWaterSavedLiters).toLocaleString()} Liters
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        ~{dynamicStats.tankerEquivalentSaved || 38} MCGM Water Tankers
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '18px 20px', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ fontSize: '12px', color: '#f87171', fontWeight: 700 }}>Estimated Water Lost</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444', margin: '4px 0' }}>
                        {(dynamicStats.estimatedWaterWastageLiters || data.summary.estimatedWaterWastageLiters).toLocaleString()} Liters
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Distribution & fixture loss</div>
                </div>

                <div className="card-glass" style={{ padding: '18px 20px', borderLeft: '4px solid #0ea5e9' }}>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700 }}>Resolution Efficiency</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0ea5e9', margin: '4px 0' }}>
                        {data.summary.resolutionRate}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {dynamicStats.resolvedLeaks} of {dynamicStats.totalReports} leaks arrested
                    </div>
                </div>

                <div className="card-glass" style={{ padding: '18px 20px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>Active Hotspot Clusters</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
                        {data.summary.activeHotspots} Zones
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Prioritized for rapid dispatch</div>
                </div>
            </div>

            {/* Middle Section: Ward Breakdown & Sector Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
                {/* Ward-wise Leakage Distribution Chart */}
                <div className="card-glass" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MdBarChart size={20} color="#0ea5e9" />
                            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                                Leakage Reports by Municipal Ward
                            </h2>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total vs Resolved</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {data.wardBreakdown.map((wb) => {
                            const percent = Math.min(100, Math.round((wb.reports / 6) * 100));
                            const resolvedPercent = Math.min(100, Math.round((wb.resolved / wb.reports) * 100));

                            return (
                                <div key={wb.ward}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{wb.ward}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                                            <strong>{wb.reports}</strong> leaks ({wb.resolved} resolved) • {wb.wastageKL} KL
                                        </span>
                                    </div>
                                    {/* Dual Progress Bar */}
                                    <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                                        <div
                                            style={{
                                                width: `${resolvedPercent}%`,
                                                background: '#10b981',
                                                transition: 'width 0.4s ease',
                                            }}
                                            title={`Resolved: ${wb.resolved}`}
                                        />
                                        <div
                                            style={{
                                                width: `${100 - resolvedPercent}%`,
                                                background: '#ef4444',
                                                transition: 'width 0.4s ease',
                                            }}
                                            title={`Unresolved: ${wb.reports - wb.resolved}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '11px', color: 'var(--text-muted)', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '2px', display: 'inline-block' }} />
                            <span>Resolved Leaks</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '2px', display: 'inline-block' }} />
                            <span>Unresolved Leaks</span>
                        </div>
                    </div>
                </div>

                {/* Sector Comparison: Colleges vs. Residential Societies */}
                <div className="card-glass" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <MdApartment size={20} color="#34d399" />
                        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            Environment Distribution: Colleges vs Societies
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                        {/* College Box */}
                        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                                🎓 College Campuses
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {data.environmentComparison.colleges.total} Reports
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Saved: <strong>{data.environmentComparison.colleges.savedLiters.toLocaleString()} L</strong>
                            </div>
                            <div style={{ fontSize: '10px', color: '#38bdf8', marginTop: '6px' }}>
                                Primary: {data.environmentComparison.colleges.topIssue}
                            </div>
                        </div>

                        {/* Residential Box */}
                        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
                                🏢 Residential Societies
                            </div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {data.environmentComparison.residential.total} Reports
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Saved: <strong>{data.environmentComparison.residential.savedLiters.toLocaleString()} L</strong>
                            </div>
                            <div style={{ fontSize: '10px', color: '#34d399', marginTop: '6px' }}>
                                Primary: {data.environmentComparison.residential.topIssue}
                            </div>
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                        Wastage by Infrastructure Category
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.categoryDistribution.slice(0, 5).map((cat) => (
                            <div key={cat.category}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>{cat.category}</span>
                                    <span style={{ fontWeight: 700, color: cat.color }}>{cat.percentage}% ({cat.count} cases)</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${cat.percentage}%`, height: '100%', background: cat.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Monthly Trend & Top Hotspots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {/* Monthly Trend Table / Chart */}
                <div className="card-glass" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <MdTrendingUp size={20} color="#0ea5e9" />
                        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            Monthly Leakage & Savings Trends (2026)
                        </h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-muted)' }}>
                                    <th style={{ padding: '8px 10px' }}>Month</th>
                                    <th style={{ padding: '8px 10px' }}>Reported</th>
                                    <th style={{ padding: '8px 10px' }}>Resolved</th>
                                    <th style={{ padding: '8px 10px' }}>Water Loss (KL)</th>
                                    <th style={{ padding: '8px 10px' }}>Water Saved (KL)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.monthlyTrends.map((row) => (
                                    <tr key={row.month} style={{ borderBottom: '1px solid var(--border-default)' }}>
                                        <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary)' }}>{row.month}</td>
                                        <td style={{ padding: '8px 10px', color: '#ef4444', fontWeight: 700 }}>{row.reported}</td>
                                        <td style={{ padding: '8px 10px', color: '#10b981', fontWeight: 700 }}>{row.resolved}</td>
                                        <td style={{ padding: '8px 10px', color: 'var(--text-muted)' }}>{row.wastageKL} KL</td>
                                        <td style={{ padding: '8px 10px', color: '#34d399', fontWeight: 700 }}>{row.savedKL} KL</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Hotspot Registry */}
                <div className="card-glass" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <MdWarning size={20} color="#f59e0b" />
                        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            Top Leakage Hotspots in Mumbai
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.hotspots.map((hs, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px',
                                    borderRadius: '10px',
                                    background: 'var(--bg-surface-secondary, #202024)',
                                    border: '1px solid var(--border-default)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                                        {hs.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {hs.ward} • {hs.type}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#0ea5e9', marginTop: '2px' }}>
                                        Avg. Resolution: {hs.avgResolutionHours} hrs
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span
                                        style={{
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            background: hs.urgency === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : hs.urgency === 'High' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(14, 165, 233, 0.2)',
                                            color: hs.urgency === 'Critical' ? '#ef4444' : hs.urgency === 'High' ? '#f59e0b' : '#38bdf8',
                                        }}
                                    >
                                        {hs.urgency} Urgency
                                    </span>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {hs.activeLeaks} active leaks
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
