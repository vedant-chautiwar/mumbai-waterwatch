import React, { useState, useMemo, useEffect } from 'react';
import { CircleMarker, Popup, useMap } from 'react-leaflet';
import MapComponent from '../../components/MapComponent';
import { getStoredReports, subscribeToWaterWatch } from '../../services/waterWatchService';
import { MUMBAI_COLLEGES, MUMBAI_RESIDENTIAL_SOCIETIES } from '../../data/wards';
import ReportDetailsModal from '../../components/ReportDetailsModal';
import { MdFilterList, MdWaterDrop, MdLocationOn, MdApartment, MdMyLocation } from 'react-icons/md';

const DEFAULT_MUMBAI_CENTER = [19.0760, 72.8777];

function MapPanController({ targetCenter }) {
    const map = useMap();
    useEffect(() => {
        if (Array.isArray(targetCenter) && targetCenter.length === 2) {
            map.flyTo(targetCenter, 14, { duration: 1.2 });
        }
    }, [targetCenter, map]);
    return null;
}

export default function LeakageMap() {
    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [envFilter, setEnvFilter] = useState('All');
    const [severityFilter, setSeverityFilter] = useState('All');
    const [center, setCenter] = useState(DEFAULT_MUMBAI_CENTER);
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

    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchesStatus =
                statusFilter === 'All' ||
                (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());
            const matchesEnv =
                envFilter === 'All' || r.environment === envFilter;
            const matchesSeverity =
                severityFilter === 'All' ||
                (r.severity && r.severity.toLowerCase() === severityFilter.toLowerCase());
            return matchesStatus && matchesEnv && matchesSeverity;
        });
    }, [reports, statusFilter, envFilter, severityFilter]);

    const handleJumpTo = (e) => {
        const val = e.target.value;
        if (!val) return;
        const allPlaces = [...MUMBAI_COLLEGES, ...MUMBAI_RESIDENTIAL_SOCIETIES];
        const match = allPlaces.find((p) => p.name === val);
        if (match && match.coordinates) {
            setCenter(match.coordinates);
        }
    };

    const getMarkerVisuals = (report) => {
        const s = String(report.status || '').toLowerCase();
        if (s.includes('resolv')) {
            return { color: '#10b981', fillColor: '#34d399', fillOpacity: 0.8, radius: 10 };
        }
        if (s.includes('progress')) {
            return { color: '#f59e0b', fillColor: '#fbbf24', fillOpacity: 0.85, radius: 11 };
        }
        // Open
        const isCritical = report.severity === 'Critical';
        return {
            color: isCritical ? '#991b1b' : '#dc2626',
            fillColor: isCritical ? '#ef4444' : '#f87171',
            fillOpacity: 0.9,
            radius: isCritical ? 14 : 11,
        };
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '4px' }}>
                        <MdWaterDrop size={22} />
                        <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                            Geospatial Leakage Registry
                        </span>
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                        Mumbai Water Leakage & Wastage Map
                    </h1>
                </div>

                {/* Jump to campus / society */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MdMyLocation size={18} color="#38bdf8" />
                    <select
                        onChange={handleJumpTo}
                        defaultValue=""
                        style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'var(--bg-input, #1e293b)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-default)',
                            fontSize: '12px',
                        }}
                    >
                        <option value="" disabled>Zoom to Campus / Society...</option>
                        <optgroup label="Colleges & Campuses">
                            {MUMBAI_COLLEGES.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Residential Societies">
                            {MUMBAI_RESIDENTIAL_SOCIETIES.map((s) => (
                                <option key={s.name} value={s.name}>
                                    {s.name}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            </div>

            {/* Filter Controls Bar */}
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
                {/* Status Filter */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS:</span>
                    {['All', 'Open', 'In Progress', 'Resolved'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`btn ${statusFilter === st ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '14px' }}
                        >
                            {st}
                        </button>
                    ))}
                </div>

                {/* Environment Filter */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SECTOR:</span>
                    {['All', 'College', 'Residential'].map((env) => (
                        <button
                            key={env}
                            onClick={() => setEnvFilter(env)}
                            className={`btn ${envFilter === env ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '14px' }}
                        >
                            {env === 'All' ? 'All' : env === 'College' ? 'Colleges' : 'Residential'}
                        </button>
                    ))}
                </div>

                {/* Severity Filter */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>SEVERITY:</span>
                    {['All', 'Critical', 'High', 'Medium', 'Low'].map((sev) => (
                        <button
                            key={sev}
                            onClick={() => setSeverityFilter(sev)}
                            className={`btn ${severityFilter === sev ? 'btn-primary-filled' : 'btn-ghost'}`}
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '14px' }}
                        >
                            {sev}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map Canvas with Leaflet */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                <MapComponent center={center} zoom={12} style={{ height: '560px' }}>
                    <MapPanController targetCenter={center} />

                    {filteredReports.map((report) => {
                        const coords = report.coordinates || DEFAULT_MUMBAI_CENTER;
                        const visuals = getMarkerVisuals(report);

                        return (
                            <CircleMarker
                                key={report.id}
                                center={[Number(coords[0]), Number(coords[1])]}
                                radius={visuals.radius}
                                pathOptions={{
                                    color: visuals.color,
                                    fillColor: visuals.fillColor,
                                    fillOpacity: visuals.fillOpacity,
                                    weight: 2,
                                }}
                            >
                                <Popup maxWidth={300}>
                                    <div style={{ padding: '4px', fontSize: '12px', background: '#18181b', borderRadius: '8px', color: '#f9fafb' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#38bdf8' }}>
                                                {report.id}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    background: report.status === 'Resolved' ? 'rgba(16,185,129,0.2)' : report.status === 'In Progress' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                                                    color: report.status === 'Resolved' ? '#34d399' : report.status === 'In Progress' ? '#fbbf24' : '#f87171',
                                                }}
                                            >
                                                {report.status}
                                            </span>
                                        </div>

                                        <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: 800, lineHeight: 1.3, color: '#f9fafb' }}>
                                            {report.title}
                                        </h4>

                                        <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '2px' }}>
                                            {report.institution}
                                        </div>

                                        <div style={{ color: '#d1d5db', fontSize: '11px', marginBottom: '6px' }}>
                                            {report.location} ({report.ward})
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px', background: '#27272a', padding: '4px 6px', borderRadius: '4px' }}>
                                            <span style={{ fontWeight: 700, color: report.severity === 'Critical' ? '#f87171' : '#fbbf24' }}>
                                                {report.severity} Severity
                                            </span>
                                            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                                                ~{report.estimatedLitersPerHour || 40} L/hr
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setShowModal(true);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '6px',
                                                borderRadius: '6px',
                                                background: '#0284c7',
                                                color: '#ffffff',
                                                border: 'none',
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            View Full Report & Timeline
                                        </button>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        );
                    })}
                </MapComponent>

                {/* Floating Map Legend */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 900,
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(10px)',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        fontSize: '11px',
                        color: '#f8fafc',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ fontWeight: 700, marginBottom: '6px', color: '#38bdf8' }}>Marker Legend</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
                            <span>Open / Unattended Leak</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                            <span>In Progress (Plumber Dispatched)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                            <span>Resolved & Leakage Arrested</span>
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

