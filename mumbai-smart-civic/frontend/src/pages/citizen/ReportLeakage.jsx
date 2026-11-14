import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdWaterDrop,
    MdCloudUpload,
    MdMyLocation,
    MdCheckCircle,
    MdWarning,
    MdApartment,
    MdPhotoCamera,
    MdFlashOn,
} from 'react-icons/md';
import {
    MUMBAI_COLLEGES,
    MUMBAI_RESIDENTIAL_SOCIETIES,
    MUMBAI_WARDS,
    LEAKAGE_CATEGORIES,
} from '../../data/wards';
import { addReport } from '../../services/waterWatchService';

const SAMPLE_LEAK_PHOTOS = [
    { label: 'Leaking Washroom Tap', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800&auto=format&fit=crop' },
    { label: 'Overhead Tank Overflow', url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?q=80&w=800&auto=format&fit=crop' },
    { label: 'Water Cooler Dripping', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop' },
    { label: 'Basement Pump Gland Leak', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop' },
];

export default function ReportLeakage() {
    const navigate = useNavigate();

    // Environment & Entities
    const [environment, setEnvironment] = useState('College');
    const [institution, setInstitution] = useState(MUMBAI_COLLEGES[0].name);
    const [ward, setWard] = useState(MUMBAI_COLLEGES[0].ward);
    const [location, setLocation] = useState('Academic Block A, 2nd Floor Washroom');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(LEAKAGE_CATEGORIES.College[0]);
    const [severity, setSeverity] = useState('Medium');
    const [landmark, setLandmark] = useState('');
    const [latitude, setLatitude] = useState(MUMBAI_COLLEGES[0].coordinates[0]);
    const [longitude, setLongitude] = useState(MUMBAI_COLLEGES[0].coordinates[1]);

    // Media
    const [imageUrl, setImageUrl] = useState(SAMPLE_LEAK_PHOTOS[0].url);
    const [customImageFile, setCustomImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('user'));
    } catch { }

    const handleEnvironmentChange = (env) => {
        setEnvironment(env);
        if (env === 'College') {
            setInstitution(MUMBAI_COLLEGES[0].name);
            setWard(MUMBAI_COLLEGES[0].ward);
            setCategory(LEAKAGE_CATEGORIES.College[0]);
            setLocation('Academic Block A, 2nd Floor Washroom');
            setLatitude(MUMBAI_COLLEGES[0].coordinates[0]);
            setLongitude(MUMBAI_COLLEGES[0].coordinates[1]);
        } else {
            setInstitution(MUMBAI_RESIDENTIAL_SOCIETIES[0].name);
            setWard(MUMBAI_RESIDENTIAL_SOCIETIES[0].ward);
            setCategory(LEAKAGE_CATEGORIES.Residential[0]);
            setLocation('Tower Wing B, 8th Floor Plumbing Shaft');
            setLatitude(MUMBAI_RESIDENTIAL_SOCIETIES[0].coordinates[0]);
            setLongitude(MUMBAI_RESIDENTIAL_SOCIETIES[0].coordinates[1]);
        }
    };

    const handleInstitutionChange = (name) => {
        setInstitution(name);
        const match = environment === 'College'
            ? MUMBAI_COLLEGES.find((c) => c.name === name)
            : MUMBAI_RESIDENTIAL_SOCIETIES.find((s) => s.name === name);
        if (match) {
            setWard(match.ward);
            setLatitude(match.coordinates[0]);
            setLongitude(match.coordinates[1]);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCustomImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const autoFillCoordinates = () => {
        if (!navigator.geolocation) {
            alert('Geolocation not supported in this browser. Using institution default coordinates.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLatitude(pos.coords.latitude.toFixed(6));
                setLongitude(pos.coords.longitude.toFixed(6));
                setToast({ type: 'success', message: 'Current GPS location tagged successfully!' });
                setTimeout(() => setToast(null), 3000);
            },
            () => {
                // Fallback to chosen institution coordinates
                const match = environment === 'College'
                    ? MUMBAI_COLLEGES.find((c) => c.name === institution)
                    : MUMBAI_RESIDENTIAL_SOCIETIES.find((s) => s.name === institution);
                if (match) {
                    setLatitude(match.coordinates[0]);
                    setLongitude(match.coordinates[1]);
                }
                setToast({ type: 'info', message: 'Applied institution campus GPS coordinates.' });
                setTimeout(() => setToast(null), 3000);
            }
        );
    };

    const fillSampleData = (type) => {
        if (type === 'college-tap') {
            handleEnvironmentChange('College');
            setTitle('Heavy Washroom Basin Tap Leak in Library Block');
            setDescription('The threaded faucet bib-cock is stripped and continuously leaking cold water. The washbasin is overflowing onto floor tiles.');
            setLocation('Library Annex 1st Floor, Boys Restroom');
            setCategory('Washroom Tap Leakage');
            setSeverity('High');
            setImageUrl(SAMPLE_LEAK_PHOTOS[0].url);
        } else if (type === 'tank-overflow') {
            handleEnvironmentChange('Residential');
            setTitle('Rooftop Water Storage Tank Overflow Cascading Down Wing A');
            setDescription('Ball float valve has failed. Thousands of liters of municipal potable water have been cascading off the parapet since 6 AM.');
            setLocation('Wing A Terrace, Main Storage Sump Battery');
            setCategory('Overhead Tank Overflow');
            setSeverity('Critical');
            setImageUrl(SAMPLE_LEAK_PHOTOS[1].url);
        } else if (type === 'water-cooler') {
            handleEnvironmentChange('College');
            setTitle('Drinking Water Cooler Supply Line Rupture');
            setDescription('Chilled water dispenser tubing has come off its push-fit coupling. Water is puddling right next to power extension socket.');
            setLocation('Canteen Corridor, Near Mechanical Workshop');
            setCategory('Drinking Water Cooler Leakage');
            setSeverity('Medium');
            setImageUrl(SAMPLE_LEAK_PHOTOS[2].url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('Please provide a leakage title');
            return;
        }

        setSubmitting(true);

        const newReport = addReport({
            title: title.trim(),
            description: description.trim() || 'Visual evidence submitted by reporter. Immediate plumbing attention requested.',
            environment,
            institution,
            location: location.trim(),
            ward,
            category,
            severity,
            coordinates: [Number(latitude) || 19.076, Number(longitude) || 72.8777],
            image_url: imageUrl,
            reportedBy: currentUser?.name || 'Citizen Reporter',
            initialNote: `Initial report logged by ${currentUser?.name || 'Citizen'}. ${severity} severity alert generated.`,
        });

        setTimeout(() => {
            setSubmitting(false);
            setToast({
                type: 'success',
                message: `Report ${newReport.id} successfully registered! Dispatched to maintenance queue.`,
            });
            setTimeout(() => {
                navigate('/citizen/my-reports');
            }, 1200);
        }, 600);
    };

    return (
        <div className="page-container" style={{ maxWidth: '960px', margin: '0 auto' }}>
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        background: toast.type === 'success' ? '#10b981' : '#0ea5e9',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                    }}
                >
                    <MdCheckCircle size={20} />
                    <span>{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '4px' }}>
                    <MdWaterDrop size={24} />
                    <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        Sustainability SUS-02 Initiative
                    </span>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    Report Water Leakage & Wastage
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
                    Help conserve potable water across Mumbai colleges and residential housing societies.
                </p>
            </div>

            {/* Quick Demo Pre-fill Bar */}
            <div
                style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'var(--bg-glass, rgba(255,255,255,0.04))',
                    border: '1px solid var(--border-default, rgba(255,255,255,0.1))',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
                    <MdFlashOn size={18} />
                    <span>Quick Demo Pre-fills:</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => fillSampleData('college-tap')}
                        className="btn btn-secondary-glass"
                        style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                        🎓 College Washroom Tap
                    </button>
                    <button
                        type="button"
                        onClick={() => fillSampleData('tank-overflow')}
                        className="btn btn-secondary-glass"
                        style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                        🏢 Society Tank Overflow
                    </button>
                    <button
                        type="button"
                        onClick={() => fillSampleData('water-cooler')}
                        className="btn btn-secondary-glass"
                        style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                        💧 Campus Water Cooler
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {/* Step 1: Target Environment */}
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '14px',
                            background: 'var(--bg-glass-strong, rgba(255,255,255,0.05))',
                            border: '1px solid var(--border-default, rgba(255,255,255,0.1))',
                        }}
                    >
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                            1. Select Environment & Institution
                        </h3>

                        {/* Environment Toggle */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                            <div
                                onClick={() => handleEnvironmentChange('College')}
                                style={{
                                    padding: '14px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    background: environment === 'College' ? 'rgba(14, 165, 233, 0.15)' : 'var(--bg-surface-secondary, #202024)',
                                    border: `2px solid ${environment === 'College' ? '#0ea5e9' : 'var(--border-default, #3f3f46)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span style={{ fontSize: '24px' }}>🎓</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: environment === 'College' ? '#38bdf8' : 'var(--text-primary)' }}>
                                        College Campus
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        Classrooms, labs, restrooms, hostels, canteen coolers
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => handleEnvironmentChange('Residential')}
                                style={{
                                    padding: '14px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    background: environment === 'Residential' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-surface-secondary, #202024)',
                                    border: `2px solid ${environment === 'Residential' ? '#10b981' : 'var(--border-default, #3f3f46)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span style={{ fontSize: '24px' }}>🏢</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '14px', color: environment === 'Residential' ? '#34d399' : 'var(--text-primary)' }}>
                                        Residential Society
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        Apartment risers, overhead tanks, sumps, booster pumps
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Institution & Ward selection */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    {environment === 'College' ? 'Select College / University Campus' : 'Select Housing Society'}
                                </label>
                                <select
                                    value={institution}
                                    onChange={(e) => handleInstitutionChange(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                        fontSize: '13px',
                                    }}
                                >
                                    {environment === 'College' ? (
                                        MUMBAI_COLLEGES.map((c) => (
                                            <option key={c.name} value={c.name}>
                                                {c.name} ({c.ward})
                                            </option>
                                        ))
                                    ) : (
                                        MUMBAI_RESIDENTIAL_SOCIETIES.map((s) => (
                                            <option key={s.name} value={s.name}>
                                                {s.name} ({s.ward})
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Municipal Ward (BMC)
                                </label>
                                <select
                                    value={ward}
                                    onChange={(e) => setWard(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                        fontSize: '13px',
                                    }}
                                >
                                    {MUMBAI_WARDS.map((w) => (
                                        <option key={w.code} value={w.code}>
                                            {w.code} - {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Location & Problem Description */}
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '14px',
                            background: 'var(--bg-glass-strong, rgba(255,255,255,0.05))',
                            border: '1px solid var(--border-default, rgba(255,255,255,0.1))',
                        }}
                    >
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                            2. Specific Location & Problem Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Specific Location / Wing / Floor / Room
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder={environment === 'College' ? 'e.g. Mechanical Block A, 2nd Floor Washroom' : 'e.g. Tower 3, 5th Floor Plumbing Duct'}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                        fontSize: '13px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                    Leakage Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        background: 'var(--bg-input, #1e293b)',
                                        color: 'var(--text-primary)',
                                        border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                        fontSize: '13px',
                                    }}
                                >
                                    {(environment === 'College' ? LEAKAGE_CATEGORIES.College : LEAKAGE_CATEGORIES.Residential).map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Leakage Title / Summary
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Continuous dripping bib-cock tap flooding washroom floor"
                                required
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-input, #1e293b)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                    fontSize: '13px',
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Problem Description & Context
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                placeholder="Describe the water leak: rate of flow, how long it has been occurring, whether water is reaching electrical lines or common pathways..."
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    background: 'var(--bg-input, #1e293b)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                    fontSize: '13px',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* Severity Selector */}
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                Severity Level & Estimated Wastage Rate
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                                {[
                                    { level: 'Low', rate: '~15 L/hr', desc: 'Slow drip', color: '#10b981' },
                                    { level: 'Medium', rate: '~45 L/hr', desc: 'Continuous trickle', color: '#f59e0b' },
                                    { level: 'High', rate: '~90 L/hr', desc: 'Steady stream / jet', color: '#ea580c' },
                                    { level: 'Critical', rate: '>250 L/hr', desc: 'Pipe burst / tank overflow', color: '#dc2626' },
                                ].map((s) => (
                                    <div
                                        key={s.level}
                                        onClick={() => setSeverity(s.level)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: severity === s.level ? 'rgba(255,255,255,0.1)' : 'var(--bg-surface-secondary, #202024)',
                                            border: `2px solid ${severity === s.level ? s.color : 'var(--border-default, #3f3f46)'}`,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, color: s.color, fontSize: '14px' }}>{s.level}</div>
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.rate}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Photo & Geotag */}
                    <div
                        style={{
                            padding: '20px',
                            borderRadius: '14px',
                            background: 'var(--bg-glass-strong, rgba(255,255,255,0.05))',
                            border: '1px solid var(--border-default, rgba(255,255,255,0.1))',
                        }}
                    >
                        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
                            3. Leakage Photo Evidence & Location Tag
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                            {/* Photo Upload & Preview */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Upload Photograph (with live preview)
                                </label>

                                <div style={{ marginBottom: '10px' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="leak-file-upload"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="leak-file-upload"
                                        className="btn btn-secondary-glass"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            padding: '10px 16px',
                                            cursor: 'pointer',
                                            width: '100%',
                                        }}
                                    >
                                        <MdCloudUpload size={18} color="#0ea5e9" />
                                        <span>Choose Photo from Device</span>
                                    </label>
                                </div>

                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Or choose a sample scenario photo:
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
                                    {SAMPLE_LEAK_PHOTOS.map((p, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setImageUrl(p.url)}
                                            style={{
                                                padding: '6px',
                                                borderRadius: '6px',
                                                background: imageUrl === p.url ? 'rgba(14, 165, 233, 0.25)' : 'var(--bg-surface-secondary, #202024)',
                                                border: `1px solid ${imageUrl === p.url ? '#0ea5e9' : 'var(--border-default, #3f3f46)'}`,
                                                color: imageUrl === p.url ? '#38bdf8' : 'var(--text-secondary)',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Preview Card */}
                                <div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                        Image Preview:
                                    </div>
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                        onError={(e) => {
                                            e.target.src = SAMPLE_LEAK_PHOTOS[0].url;
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Geotagging */}
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Geolocation Coordinates (Mumbai Map Pin)
                                </label>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                                    <div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Latitude</span>
                                        <input
                                            type="text"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                borderRadius: '6px',
                                                background: 'var(--bg-input, #1e293b)',
                                                color: 'var(--text-primary)',
                                                border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                                fontSize: '12px',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Longitude</span>
                                        <input
                                            type="text"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 10px',
                                                borderRadius: '6px',
                                                background: 'var(--bg-input, #1e293b)',
                                                color: 'var(--text-primary)',
                                                border: '1px solid var(--border-default, rgba(255,255,255,0.15))',
                                                fontSize: '12px',
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={autoFillCoordinates}
                                    className="btn btn-secondary-glass"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        fontSize: '12px',
                                        width: '100%',
                                        marginBottom: '14px',
                                    }}
                                >
                                    <MdMyLocation size={16} color="#0ea5e9" />
                                    <span>Sync Campus / Device GPS Pin</span>
                                </button>

                                <div
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: 'rgba(14, 165, 233, 0.08)',
                                        border: '1px solid rgba(14, 165, 233, 0.2)',
                                        fontSize: '12px',
                                        color: '#bae6fd',
                                    }}
                                >
                                    <strong>📍 Auto-Pinned:</strong> {institution}
                                    <br />
                                    Location: {location} ({ward})
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/citizen/dashboard')}
                            className="btn btn-ghost"
                            style={{ padding: '10px 20px' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn btn-primary-filled"
                            style={{
                                padding: '10px 28px',
                                fontSize: '14px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <MdWaterDrop size={18} />
                            <span>{submitting ? 'Registering Report...' : 'Submit Water Leakage Report'}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

