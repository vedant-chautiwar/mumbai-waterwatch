import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiDroplet } from 'react-icons/fi';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';

const DEMO_PROFILES = {
    student: {
        email: 'aditya.deshmukh@vjti.ac.in',
        name: 'Aditya Deshmukh',
        role: 'citizen',
        environment: 'College',
        institution: 'Veermata Jijabai Technological Institute (VJTI)',
        label: 'Student / College Reporter',
    },
    resident: {
        email: 'kavita.menon@hiranandani.org',
        name: 'Kavita Menon',
        role: 'citizen',
        environment: 'Residential',
        institution: 'Hiranandani Gardens (Heritage Tower)',
        label: 'Society Resident',
    },
    authority: {
        email: 'rajesh.kulkarni@waterwatch.mumbai.gov.in',
        name: 'Er. Rajesh Kulkarni',
        role: 'authority',
        authority_rank: 'Executive Engineer',
        authority_level: 'Zone 2 (Colleges & Societies)',
        label: 'MCGM / Water Authority',
    },
};

export default function Login({ onSwitch, isFlipped }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('aditya.deshmukh@vjti.ac.in');
    const [password, setPassword] = useState('WaterWatch@2026');
    const [loginAs, setLoginAs] = useState('citizen');
    const [authorityCode, setAuthorityCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const loginWithProfile = (profile) => {
        setLoading(true);
        setError('');
        setTimeout(() => {
            const token = `mock-token-${Date.now()}-${profile.role}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({
                name: profile.name,
                email: profile.email,
                role: profile.role,
                environment: profile.environment || 'College',
                institution: profile.institution || 'Mumbai Institution',
                authority_rank: profile.authority_rank,
                authority_level: profile.authority_level,
            }));
            setLoading(false);
            if (profile.role === 'authority' || profile.role === 'admin') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/citizen/dashboard', { replace: true });
            }
        }, 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const role = loginAs === 'authority' ? 'authority' : 'citizen';
            const user = {
                email,
                name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                role,
                authority_rank: loginAs === 'authority' ? 'Supervising Engineer' : undefined,
                environment: 'College',
            };
            const token = `mock-token-${Date.now()}-${role}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setLoading(false);

            if (role === 'authority') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/citizen/dashboard', { replace: true });
            }
        }, 350);
    };

    return (
        <div className="glass-card-liquid" style={{ pointerEvents: isFlipped ? 'none' : 'auto', visibility: isFlipped ? 'hidden' : 'visible' }}>
            <div className="auth-header-liquid auth-header-mini" style={{ textAlign: 'center' }}>
                <div className="auth-brand-mark-liquid auth-brand-mark-mini" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
                    <FiDroplet size={22} color="#ffffff" />
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, marginTop: '8px', color: '#f8fafc' }}>Mumbai WaterWatch</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>College & Residential Water Wastage Monitoring</p>
            </div>

            {error && (
                <div className="form-alert form-alert-danger" role="alert" style={{ marginBottom: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#feb2b2', padding: '8px 12px', fontSize: '12px' }}>
                    {error}
                </div>
            )}

            {/* Quick 1-Click Demo Profiles */}
            <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
                    ⚡ Instant Demo Access
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                    <button
                        type="button"
                        onClick={() => loginWithProfile(DEMO_PROFILES.student)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(14, 165, 233, 0.12)',
                            border: '1px solid rgba(14, 165, 233, 0.3)',
                            color: '#38bdf8',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <span>🎓 Student (VJTI Campus)</span>
                        <span style={{ fontSize: '10px', background: 'rgba(14, 165, 233, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>Citizen</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => loginWithProfile(DEMO_PROFILES.resident)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            color: '#34d399',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <span>🏢 Resident (Hiranandani Powai)</span>
                        <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>Resident</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => loginWithProfile(DEMO_PROFILES.authority)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.35)',
                            color: '#a5b4fc',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        <span>🛠️ Water Authority / Plumber Lead</span>
                        <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.25)', padding: '2px 6px', borderRadius: '4px' }}>Admin</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0', gap: '8px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or Standard Login</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-liquid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <InputField
                    id="login-as"
                    label="Portal Role"
                    as="select"
                    value={loginAs}
                    onChange={(e) => setLoginAs(e.target.value)}
                    liquid
                    icon={FiUser}
                    size="sm"
                >
                    <option value="citizen" style={{ background: '#1e293b' }}>Citizen / Student / Resident</option>
                    <option value="authority" style={{ background: '#1e293b' }}>MCGM Water Authority / Admin</option>
                </InputField>

                <InputField
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="student@college.edu or resident@society.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    liquid
                    icon={FiMail}
                    size="sm"
                />

                <InputField
                    id="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    liquid
                    icon={FiLock}
                    size="sm"
                />

                {loginAs === 'authority' && (
                    <InputField
                        id="authority-code"
                        type="text"
                        label="Official Department Code"
                        placeholder="MCGM-WATER-2026"
                        value={authorityCode}
                        onChange={(e) => setAuthorityCode(e.target.value)}
                        liquid
                        size="sm"
                    />
                )}

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    className="btn-liquid-gradient"
                    style={{ padding: '9px', fontSize: '13px', marginTop: '4px' }}
                >
                    {loading ? 'Authenticating...' : 'Sign In to Portal'}
                </Button>
            </form>

            <div className="auth-footer-text" style={{ textAlign: 'center', marginTop: '14px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                New campus or society user?{' '}
                <button
                    type="button"
                    onClick={onSwitch}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                    Register Here
                </button>
            </div>
        </div>
    );
}
