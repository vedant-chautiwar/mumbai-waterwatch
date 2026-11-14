import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiHome, FiDroplet } from 'react-icons/fi';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import { MUMBAI_COLLEGES, MUMBAI_RESIDENTIAL_SOCIETIES, MUMBAI_WARDS } from '../data/wards';

export default function Register({ onSwitch, isFlipped }) {
    const navigate = useNavigate();
    const [roleType, setRoleType] = useState('citizen');
    const [environment, setEnvironment] = useState('College');
    const [institution, setInstitution] = useState('Veermata Jijabai Technological Institute (VJTI)');
    const [ward, setWard] = useState('Ward F/N');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnvironmentChange = (env) => {
        setEnvironment(env);
        if (env === 'College') {
            setInstitution(MUMBAI_COLLEGES[0].name);
            setWard(MUMBAI_COLLEGES[0].ward);
        } else {
            setInstitution(MUMBAI_RESIDENTIAL_SOCIETIES[0].name);
            setWard(MUMBAI_RESIDENTIAL_SOCIETIES[0].ward);
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password and confirm password do not match');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const user = {
                name: name || (email.split('@')[0].replace(/[._]/g, ' ')),
                email,
                role: roleType,
                environment,
                institution,
                ward,
            };
            const token = `mock-token-${Date.now()}-${roleType}`;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setLoading(false);

            if (roleType === 'authority') {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/citizen/dashboard', { replace: true });
            }
        }, 400);
    };

    return (
        <div className="glass-card-liquid" style={{ pointerEvents: isFlipped ? 'auto' : 'none', visibility: isFlipped ? 'visible' : 'hidden' }}>
            <div className="auth-header-liquid auth-header-mini" style={{ textAlign: 'center' }}>
                <div className="auth-brand-mark-liquid auth-brand-mark-mini" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
                    <FiDroplet size={20} color="#ffffff" />
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, marginTop: '6px', color: '#f8fafc' }}>Join Mumbai WaterWatch</h1>
                <p style={{ fontSize: '11px', color: '#94a3b8' }}>Register as Campus Reporter or Society Resident</p>
            </div>

            {error && (
                <div className="form-alert form-alert-danger" role="alert" style={{ marginBottom: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#feb2b2', padding: '6px 10px', fontSize: '12px' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="auth-form-liquid" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => handleEnvironmentChange('College')}
                        style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            background: environment === 'College' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${environment === 'College' ? '#0ea5e9' : 'rgba(255,255,255,0.1)'}`,
                            color: environment === 'College' ? '#38bdf8' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        🎓 College Campus
                    </button>
                    <button
                        type="button"
                        onClick={() => handleEnvironmentChange('Residential')}
                        style={{
                            padding: '6px 8px',
                            borderRadius: '8px',
                            background: environment === 'Residential' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${environment === 'Residential' ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                            color: environment === 'Residential' ? '#34d399' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        🏢 Residential Society
                    </button>
                </div>

                <InputField
                    id="inst-select"
                    label={environment === 'College' ? 'College / University' : 'Housing Society'}
                    as="select"
                    value={institution}
                    onChange={(e) => {
                        const val = e.target.value;
                        setInstitution(val);
                        const match = environment === 'College'
                            ? MUMBAI_COLLEGES.find((c) => c.name === val)
                            : MUMBAI_RESIDENTIAL_SOCIETIES.find((s) => s.name === val);
                        if (match) setWard(match.ward);
                    }}
                    liquid
                    size="sm"
                >
                    {environment === 'College' ? (
                        MUMBAI_COLLEGES.map((c) => (
                            <option key={c.name} value={c.name} style={{ background: '#1e293b' }}>
                                {c.name}
                            </option>
                        ))
                    ) : (
                        MUMBAI_RESIDENTIAL_SOCIETIES.map((s) => (
                            <option key={s.name} value={s.name} style={{ background: '#1e293b' }}>
                                {s.name}
                            </option>
                        ))
                    )}
                </InputField>

                <InputField
                    id="reg-name"
                    type="text"
                    label="Full Name"
                    placeholder="e.g. Aditya Deshmukh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    liquid
                    icon={FiUser}
                    size="sm"
                />

                <InputField
                    id="reg-email"
                    type="email"
                    label="Email Address"
                    placeholder="student@vjti.ac.in or resident@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    liquid
                    icon={FiMail}
                    size="sm"
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <InputField
                        id="reg-pwd"
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

                    <InputField
                        id="reg-confirm-pwd"
                        type="password"
                        label="Confirm"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        liquid
                        icon={FiLock}
                        size="sm"
                    />
                </div>

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    className="btn-liquid-gradient"
                    style={{ padding: '8px', fontSize: '13px', marginTop: '4px' }}
                >
                    {loading ? 'Creating Account...' : 'Complete Registration'}
                </Button>
            </form>

            <div className="auth-footer-text" style={{ textAlign: 'center', marginTop: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                Already registered?{' '}
                <button
                    type="button"
                    onClick={onSwitch}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                >
                    Sign In Here
                </button>
            </div>
        </div>
    );
}
