import React, { useState } from 'react';
import {
    MdEco,
    MdWaterDrop,
    MdCalculate,
    MdCheckCircle,
    MdSchool,
    MdApartment,
    MdInfo,
    MdShare,
} from 'react-icons/md';

export default function WaterConservation() {
    // Interactive Calculator State
    const [leakType, setLeakType] = useState('tap');
    const [drippingUnits, setDrippingUnits] = useState(3);
    const [hoursPerDay, setHoursPerDay] = useState(24);

    const rates = {
        tap: 3, // Liters per hour per dripping tap (slow drip ~3L/hr, continuous ~15-20L/hr)
        cooler: 12,
        toilet: 25,
        tank: 150,
        pipe: 80,
    };

    const dailyLoss = (rates[leakType] || 5) * drippingUnits * (hoursPerDay / 24) * 24;
    const monthlyLoss = dailyLoss * 30;
    const yearlyLoss = dailyLoss * 365;
    const tankerEquivalent = (yearlyLoss / 10000).toFixed(1);

    return (
        <div className="page-container" style={{ maxWidth: '1080px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '6px' }}>
                    <MdEco size={24} />
                    <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        Sustainability Goal SUS-02
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                    Water Conservation & Wastage Reduction
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Actionable strategies, audit checklists, and real-time impact calculations for Mumbai's educational institutions and residential housing societies.
                </p>
            </div>

            {/* Interactive Calculator Card */}
            <div
                className="card-glass"
                style={{
                    padding: '24px',
                    borderRadius: '16px',
                    marginBottom: '32px',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(16, 185, 129, 0.05))',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '16px' }}>
                    <MdCalculate size={24} />
                    <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        Interactive Water Wastage Calculator
                    </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Leakage Scenario:
                        </label>
                        <select
                            value={leakType}
                            onChange={(e) => setLeakType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                background: 'var(--bg-input, #1e293b)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-default)',
                                fontSize: '13px',
                            }}
                        >
                            <option value="tap">Dripping Washroom / Common Faucet (~3 L/hr per unit)</option>
                            <option value="cooler">Drinking Water Cooler Supply Line (~12 L/hr)</option>
                            <option value="toilet">Faulty Dual-Flush Tank Run (~25 L/hr)</option>
                            <option value="pipe">Riser Pipe Pinhole Leak (~80 L/hr)</option>
                            <option value="tank">Overhead Storage Tank Ball Float Overflow (~150 L/hr)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Number of Unattended Leaks: <strong>{drippingUnits}</strong>
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="25"
                            value={drippingUnits}
                            onChange={(e) => setDrippingUnits(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#0ea5e9' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>1 leak</span>
                            <span>12 leaks</span>
                            <span>25 leaks</span>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Hours Active Per Day: <strong>{hoursPerDay} hrs</strong>
                        </label>
                        <input
                            type="range"
                            min="2"
                            max="24"
                            step="2"
                            value={hoursPerDay}
                            onChange={(e) => setHoursPerDay(Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#0ea5e9' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>2 hrs</span>
                            <span>12 hrs</span>
                            <span>24 hrs (Continuous)</span>
                        </div>
                    </div>
                </div>

                {/* Calculation Outputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                        <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>Daily Potable Loss</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444' }}>{dailyLoss.toLocaleString()} L</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Per 24 hours</div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                        <div style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 600 }}>Monthly Potable Loss</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b' }}>{monthlyLoss.toLocaleString()} L</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>30 calendar days</div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.25)' }}>
                        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>Annual Potable Loss</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0ea5e9' }}>{yearlyLoss.toLocaleString()} L</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>365 calendar days</div>
                    </div>

                    <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                        <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>Equivalent Tankers</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>~{tankerEquivalent} Tankers</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10,000L MCGM Tankers</div>
                    </div>
                </div>
            </div>

            {/* Target Best Practices: College vs Residential */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {/* College Campus Guide */}
                <div className="card-glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0ea5e9', marginBottom: '14px' }}>
                        <MdSchool size={24} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            College & University Protocol
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Faucet Aerator Retrofits:</strong> Installing 2.5 LPM pressure-compensating aerators on washbasin taps cuts washroom water consumption by 55%.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Cooler Overflow Sensors:</strong> Fit auto-shutoff push taps on drinking water coolers to eliminate continuous floor drainage puddles.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Chemistry Lab Condenser Loops:</strong> Replace single-pass tap water cooling with closed-loop recirculating chillers in organic chemistry labs.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Hostel Night Audits:</strong> Periodic midnight inspections of hostel washrooms detect silent flush siphon leaks before massive water loss occurs.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Residential Housing Society Guide */}
                <div className="card-glass" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '14px' }}>
                        <MdApartment size={24} />
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                            Housing Society Protocol
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Dual Float Switches on Overhead Tanks:</strong> Implement redundant electro-magnetic level cutoff switches so pumps stop automatically before overflow.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Riser Shaft Inspection Schedules:</strong> Monthly inspection of building common plumbing shafts identifies hairline fractures before masonry damage happens.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Booster Pump Gland Packing:</strong> Regularly replace Teflon packing rings on basement booster pumps to prevent continuous gland spray into pump sumps.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <MdCheckCircle size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <strong>Water Meter Differential Audits:</strong> Compare bulk municipal water meter inflow against individual apartment consumption to detect underground main leaks.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

