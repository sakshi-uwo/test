import React, { useState } from 'react';
import { User, Lock, ArrowRight, Buildings, Warning } from '@phosphor-icons/react';
import { authService } from '../services/api';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await authService.login({ email, password });
            onLogin(data);
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.error || 'Invalid credentials or connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8faff 0%, #e8efff 100%)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            {/* Background Decoration */}
            <div style={{
                position: 'fixed',
                width: '600px', height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--pivot-blue-soft) 0%, transparent 70%)',
                top: '-10%', right: '-10%',
                zIndex: -1,
                opacity: 0.5
            }}></div>
            <div style={{
                position: 'fixed',
                width: '400px', height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, var(--pivot-blue-soft) 0%, transparent 70%)',
                bottom: '-5%', left: '-5%',
                zIndex: -1,
                opacity: 0.3
            }}></div>

            <div className="card" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                boxShadow: '0 20px 50px rgba(0, 71, 171, 0.1)',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                animation: 'fadeInUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        borderRadius: '16px',
                        background: 'var(--pivot-blue)',
                        color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 8px 20px rgba(0, 71, 171, 0.3)'
                    }}>
                        <Buildings size={32} weight="bold" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--soft-black)' }}>AI-AUTO</h1>
                    <p style={{ color: 'var(--charcoal)', fontSize: '0.9rem', opacity: 0.7 }}>Builder Dashboard Login</p>
                </div>

                {error && (
                    <div style={{
                        width: '100%', padding: '12px', background: '#fff5f5', border: '1px solid #feb2b2',
                        borderRadius: '8px', color: '#c53030', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                        <Warning size={18} weight="bold" />
                        {error}
                    </div>
                )}

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--charcoal)', opacity: 0.6, marginBottom: '0.5rem' }}>Select a role to enter the dashboard</p>
                    {[
                        { label: 'Login as Admin', role: 'admin', color: 'var(--pivot-blue)' },
                        { label: 'Login as Builder', role: 'builder', color: '#0047AB' },
                        { label: 'Login as Civil Engineer', role: 'civil_engineer', color: '#2E5BFF' },
                        { label: 'Login as Site Manager', role: 'project_site', color: '#4CAF50' },
                        { label: 'Login as Client/Buyer', role: 'client', color: '#ff9f4d' },
                    ].map((btn) => (
                        <button
                            key={btn.role}
                            onClick={() => {
                                const userData = { name: btn.label.split('as ')[1], role: btn.role, email: `${btn.role}@ai-auto.com` };
                                localStorage.setItem('aiauto_user', JSON.stringify(userData));
                                onLogin(userData);
                            }}
                            style={{
                                padding: '12px',
                                borderRadius: '10px',
                                background: btn.color,
                                color: 'white',
                                border: 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .input-field:focus-within {
                    border-color: var(--pivot-blue) !important;
                    box-shadow: 0 0 0 4px var(--pivot-blue-soft);
                }
            `}</style>
        </div>
    );
};

export default Login;
