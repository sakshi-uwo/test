import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import { Kanban, Warning, ChartBar, CheckCircle } from '@phosphor-icons/react';

const CivilEngineerDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();

        socketService.on('project-added', (newProject) => {
            setProjects(prev => [newProject, ...prev]);
        });
        socketService.on('project-updated', (updatedProject) => {
            setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
        });
        socketService.on('incidentReported', (newIncident) => {
            setIncidents(prev => [newIncident, ...prev]);
        });

        return () => {
            socketService.off('project-added');
            socketService.off('project-updated');
            socketService.off('incidentReported');
        };
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, incidentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/projects`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] }))
            ]);
            setProjects(projectsRes.data || []);
            setIncidents(incidentsRes.data || []);
        } catch (error) {
            console.error("Error fetching civil engineer data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--pivot-blue)', marginBottom: '0.5rem', fontWeight: 800 }}>Civil Engineer Dashboard</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontWeight: 600 }}>Overview of structural integrity, project progress, and safety compliance.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Active Projects Status */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                        <Kanban size={24} color="var(--pivot-blue)" weight="bold" /> Site Progress Overview
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {projects.length === 0 && !loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No projects assigned.</div>
                        ) : (
                            projects.map(p => (
                                <div key={p._id} style={{ padding: '15px', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 700, color: '#1a1a1a' }}>{p.name}</span>
                                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: '#e0f2fe', color: '#0369a1', fontWeight: 700 }}>
                                            {p.status || 'Active'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${p.totalUnits ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0}%`,
                                                height: '100%',
                                                background: 'var(--pivot-blue)'
                                            }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                                            {p.totalUnits ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>📍 {p.location || 'Location Pending'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Safety Incidents */}
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', border: '1px solid #f0f0f0' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b' }}>
                        <Warning size={24} color="#dc2626" weight="bold" /> Critical Safety Reports
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {incidents.filter(i => i.status !== 'Closed').length === 0 && !loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', background: '#fff9f9', borderRadius: '12px' }}>
                                <CheckCircle size={32} color="#16a34a" weight="duotone" style={{ marginBottom: '0.5rem' }} />
                                <p>All sites are compliant.</p>
                            </div>
                        ) : (
                            incidents.filter(i => i.status !== 'Closed').map(i => (
                                <div key={i._id} style={{
                                    padding: '15px',
                                    background: '#fff1f1',
                                    borderRadius: '12px',
                                    borderLeft: `4px solid ${i.severity === 'High' || i.severity === 'Blocker' ? '#dc2626' : '#f59e0b'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: i.severity === 'High' ? '#dc2626' : '#b45309', textTransform: 'uppercase' }}>{i.severity} Priority</span>
                                        <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600 }}>{new Date(i.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style={{ fontWeight: 700, color: '#7f1d1d', marginBottom: '4px' }}>{i.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#991b1b' }}>{i.location}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CivilEngineerDashboard;
