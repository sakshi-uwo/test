import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { HouseLine, CaretRight, Image } from '@phosphor-icons/react';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/projects`);
                setProjects(res.data);
            } catch (error) {
                console.error("Error fetching client projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#003380', marginBottom: '0.5rem', fontWeight: 800 }}>Client Portal</h1>
            <p style={{ color: '#64748b', marginBottom: '2.5rem', fontWeight: 600 }}>Track the progress of your properties in real-time.</p>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {projects.length === 0 && !loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: 'white', borderRadius: '16px' }}>
                        <HouseLine size={48} weight="duotone" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <h3>No Active Projects Found</h3>
                        <p>Contact your manager to link your account to a property.</p>
                    </div>
                ) : (
                    projects.map(p => (
                        <div key={p._id} style={{
                            background: 'white', borderRadius: '24px', overflow: 'hidden',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{p.name}</h2>
                                    <p style={{ margin: '5px 0 0', color: '#64748b', fontWeight: 600 }}>{p.location}</p>
                                </div>
                                <span style={{
                                    padding: '8px 16px', borderRadius: '30px',
                                    background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.9rem'
                                }}>
                                    {p.status}
                                </span>
                            </div>

                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 700, color: '#475569' }}>Completion Status</span>
                                    <span style={{ fontWeight: 800, color: '#2563eb' }}>
                                        {p.totalUnits ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0}%
                                    </span>
                                </div>
                                <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem' }}>
                                    <div style={{
                                        width: `${p.totalUnits ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #2563eb, #0ea5e9)',
                                        borderRadius: '6px',
                                        transition: 'width 1s ease'
                                    }}></div>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Start Date</div>
                                        <div style={{ fontWeight: 600, color: '#334155' }}>{p.startDate ? new Date(p.startDate).toLocaleDateString() : 'TBD'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Target Completion</div>
                                        <div style={{ fontWeight: 600, color: '#334155' }}>{p.endDate ? new Date(p.endDate).toLocaleDateString() : 'TBD'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
