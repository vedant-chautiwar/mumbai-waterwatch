import React, { useState } from 'react';
import { MdCampaign, MdNotifications, MdInfo, MdWarning, MdCheckCircle, MdDateRange } from 'react-icons/md';
import { ANNOUNCEMENTS } from '../../data/announcements';

export default function Announcements() {
    const [selectedTab, setSelectedTab] = useState('All');

    const filtered = selectedTab === 'All'
        ? ANNOUNCEMENTS
        : ANNOUNCEMENTS.filter((a) => a.badge.toLowerCase().includes(selectedTab.toLowerCase()));

    return (
        <div className="page-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '4px' }}>
                    <MdCampaign size={24} />
                    <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Civic & Campus Advisories
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Water Notices & Directives
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Official alerts from the Municipal Corporation of Greater Mumbai (MCGM Water Dept), College Sustainability Committees, and Housing Federations.
                </p>
            </div>

            {/* Announcements List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filtered.map((item) => {
                    const isHigh = item.severity === 'high';
                    const isSuccess = item.severity === 'success';
                    const borderColor = isHigh ? '#ef4444' : isSuccess ? '#10b981' : '#0ea5e9';

                    return (
                        <div
                            key={item.id}
                            className="card-glass"
                            style={{
                                padding: '20px 24px',
                                borderRadius: '12px',
                                borderLeft: `4px solid ${borderColor}`,
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            background: `${borderColor}22`,
                                            color: borderColor,
                                        }}
                                    >
                                        {item.badge}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        Source: {item.source}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <MdDateRange size={14} />
                                    <span>{item.date}</span>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                                {item.title}
                            </h2>

                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                                {item.summary}
                            </p>

                            <div
                                style={{
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-glass, rgba(255,255,255,0.03))',
                                    border: '1px solid var(--border-default)',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5,
                                }}
                            >
                                <strong>Advisory Note:</strong> {item.details}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

