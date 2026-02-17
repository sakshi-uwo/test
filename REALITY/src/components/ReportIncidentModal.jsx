import React, { useState } from 'react';
import axios from 'axios';
import { X, ShieldWarning, Warning, MapPin, Camera, Info } from '@phosphor-icons/react';
import { API_BASE_URL } from '../config/api';

const ReportIncidentModal = ({ onClose }) => {
    const [severity, setSeverity] = useState('Medium');
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/site-ops/incidents`, {
                title,
                description: title, // Using title as description since form doesn't have it
                severity,
                location,
                status: 'Open'
            });
            onClose();
        } catch (error) {
            console.error("Error creating incident:", error);
            alert("Failed to report incident. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white', width: '100%', maxWidth: '550px', borderRadius: '24px',
                padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative', border: '1px solid #fee2e2'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: '20px', right: '20px', border: 'none',
                    background: '#fff1f1', width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                    <X size={20} weight="bold" color="#ef4444" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                    <div style={{
                        width: '50px', height: '50px', borderRadius: '15px', background: '#fff1f1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444'
                    }}>
                        <ShieldWarning size={28} weight="fill" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>Report Site Incident</h2>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>Safety & Hazards Compliance</p>
                    </div>
                </div>

                <div style={{
                    background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px',
                    padding: '12px', display: 'flex', gap: '10px', marginBottom: '1.5rem'
                }}>
                    <Info size={20} weight="bold" color="#d97706" />
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400e', lineHeight: 1.4 }}>
                        This report will be sent immediately to the Safety Officer and Project Manager for review.
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Incident Title</label>
                        <input
                            required
                            placeholder="Brief title of the incident..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                outline: 'none', background: '#f8fafc', fontWeight: 600
                            }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Severity</label>
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    outline: 'none', background: '#f8fafc', fontWeight: 600,
                                    color: severity === 'high' ? '#dc2626' : severity === 'medium' ? '#d97706' : '#16a34a'
                                }}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">Critical Hazard</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Location on Site</label>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px',
                                background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0'
                            }}>
                                <MapPin size={18} weight="bold" color="#64748b" />
                                <input
                                    placeholder="e.g. Floor 4 B-Wing"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontWeight: 600, fontSize: '0.9rem', width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '12px', borderRadius: '12px', border: '1px dashed #fca5a5',
                            background: '#fff1f1', color: '#dc2626', fontWeight: 700, cursor: 'pointer'
                        }}>
                            <Camera size={20} weight="bold" /> Attach Proof
                        </button>
                        <button type="submit" style={{
                            flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '12px', borderRadius: '12px', border: 'none',
                            background: '#dc2626', color: 'white', fontWeight: 700,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                        }}>
                            <Warning size={20} weight="bold" /> Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportIncidentModal;
