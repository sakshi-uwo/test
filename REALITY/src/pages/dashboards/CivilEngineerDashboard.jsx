import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import {
    Kanban, Warning, ChartBar, CheckCircle, FilePdf,
    Link, Note, Package, Megaphone, GitDiff,
    ClipboardText, FileText, CaretRight, UploadSimple,
    HardHat, Blueprint, TrendUp
} from '@phosphor-icons/react';

const CivilEngineerDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for new features
    const [drawings] = useState([
        { id: 1, name: 'Foundation_Plan_A1.pdf', project: 'Skyline Towers', date: '2025-02-15', status: 'Approved' },
        { id: 2, name: 'Structural_Column_B2.dwg', project: 'Green Valley', date: '2025-02-16', status: 'Pending Review' },
    ]);

    const [boqItems] = useState([
        { id: 1, item: 'Cement (Grade 53)', quantity: '500 Bags', budget: '$4,500', status: 'On Track' },
        { id: 2, item: 'Steel Reinforcement', quantity: '20 Tons', budget: '$18,000', status: 'Review Needed' },
    ]);

    const [structuralNotes] = useState([
        { id: 1, title: 'Beam Reinforcement Update', date: '2025-02-17', urgency: 'High' },
        { id: 2, title: 'Soil Test Results - Plot 4', date: '2025-02-16', urgency: 'Medium' },
    ]);

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

    const StatusBadge = ({ status }) => {
        const colors = {
            'Approved': '#16a34a',
            'Pending Review': '#ea580c',
            'On Track': '#0284c7',
            'Review Needed': '#dc2626',
            'Completed': '#059669',
            'Active': '#0284c7'
        };
        const bgColors = {
            'Approved': '#dcfce7',
            'Pending Review': '#ffedd5',
            'On Track': '#e0f2fe',
            'Review Needed': '#fee2e2',
            'Completed': '#d1fae5',
            'Active': '#e0f2fe'
        };
        return (
            <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: bgColors[status] || '#f3f4f6',
                color: colors[status] || '#4b5563'
            }}>
                {status}
            </span>
        );
    };

    const FeatureCard = ({ title, icon, children, action }) => (
        <div className="dashboard-card" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a', margin: 0 }}>
                    {icon} {title}
                </h3>
                {action && (
                    <button style={{
                        background: 'transparent', border: 'none', color: 'var(--pivot-blue)',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                    }}>
                        {action}
                    </button>
                )}
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ color: 'var(--pivot-blue)', marginBottom: '0.5rem', fontWeight: 800, fontSize: '2rem' }}>Civil Engineer Dashboard</h1>
                    <p style={{ color: '#64748b', fontWeight: 500, fontSize: '1rem' }}>
                        Manage structural integrity, site compliance, and technical documentation.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="action-btn" style={{ background: 'var(--pivot-blue)', color: 'white' }}>
                        <Megaphone size={20} weight="bold" /> Raise Request
                    </button>
                    <button className="action-btn" style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                        <UploadSimple size={20} weight="bold" /> Upload Drawing
                    </button>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Assigned Projects', value: projects.length, icon: <Blueprint size={32} weight="duotone" color="#2563eb" />, bg: '#eff6ff' },
                    { label: 'Pending Drawings', value: '4', icon: <FilePdf size={32} weight="duotone" color="#dc2626" />, bg: '#fef2f2' },
                    { label: 'Open Issues', value: incidents.length, icon: <Warning size={32} weight="duotone" color="#ea580c" />, bg: '#fff7ed' },
                    { label: 'Reports Due', value: '2', icon: <ClipboardText size={32} weight="duotone" color="#16a34a" />, bg: '#f0fdf4' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '12px', background: stat.bg, borderRadius: '12px' }}>{stat.icon}</div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>

                {/* 1. View Assigned Projects */}
                <div style={{ gridColumn: 'span 2' }}>
                    <FeatureCard
                        title="Assigned Projects Status"
                        icon={<Kanban size={24} color="var(--pivot-blue)" weight="fill" />}
                        action="View All Projects"
                    >
                        {projects.length === 0 && !loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No active projects.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {projects.slice(0, 4).map(p => (
                                    <div key={p._id} style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{p.name}</span>
                                            <StatusBadge status={p.status || 'Active'} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: '65%', height: '100%', background: 'var(--pivot-blue)' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>65%</span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <HardHat size={14} weight="bold" /> Site Engineer: {p.engineer || 'Assigning...'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </FeatureCard>
                </div>

                {/* 2. Upload / Review Drawings */}
                <FeatureCard
                    title="Drawing Reviews"
                    icon={<FilePdf size={24} color="#dc2626" weight="fill" />}
                    action="Upload New"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {drawings.map(d => (
                            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ padding: '8px', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
                                    <FilePdf size={20} weight="fill" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{d.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.project} • {d.date}</div>
                                </div>
                                <StatusBadge status={d.status} />
                            </div>
                        ))}
                    </div>
                </FeatureCard>

                {/* 3. BOQ Management & 5. Material Specifications */}
                <FeatureCard
                    title="BOQ & Material Specs"
                    icon={<Package size={24} color="#059669" weight="fill" />}
                    action="Full BOQ"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {boqItems.map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #dcfce7' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#065f46' }}>{item.item}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#059669' }}>{item.quantity} • Target: {item.budget}</div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>{item.status}</span>
                            </div>
                        ))}
                        <button style={{ width: '100%', marginTop: 'auto', padding: '10px', background: 'white', border: '1px dashed #059669', color: '#059669', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            + Add Material Spec
                        </button>
                    </div>
                </FeatureCard>

                {/* 4. Structural Notes & 6. Site Instructions */}
                <FeatureCard
                    title="Structural Notes & Instructions"
                    icon={<Note size={24} color="#d97706" weight="fill" />}
                    action="Add Note"
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {structuralNotes.map(note => (
                            <div key={note.id} style={{ padding: '12px', background: '#fffbeb', borderRadius: '10px', border: '1px solid #fcd34d' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem' }}>{note.title}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: note.urgency === 'High' ? '#dc2626' : '#d97706' }}>{note.urgency}</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: '#b45309', margin: 0 }}>Review required by {note.date}</p>
                            </div>
                        ))}
                        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Megaphone size={20} color="#2563eb" />
                            <div>
                                <div style={{ fontWeight: 600, color: '#1e40af', fontSize: '0.9rem' }}>Latest Site Instruction</div>
                                <div style={{ fontSize: '0.75rem', color: '#1e3a8a' }}>Strictly follow mix design M25 for Slab 2.</div>
                            </div>
                        </div>
                    </div>
                </FeatureCard>

                {/* 7. Change Requests & 8. Quality Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <FeatureCard
                        title="Change Requests & Quality"
                        icon={<GitDiff size={24} color="#7c3aed" weight="fill" />}
                        action="Checklist"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckCircle size={18} color="#7c3aed" weight="bold" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Curing Checklist - Block A</div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Submitted today</div>
                                </div>
                                <button style={{ padding: '4px 8px', fontSize: '0.7rem', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Review</button>
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Hazards Needing Tech. Resolution"
                        icon={<WarningCircle size={24} color="#dc2626" weight="fill" />}
                        action="View All"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {incidents.filter(i => i.status !== 'Closed').length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No technical hazards reported.</p>
                            ) : incidents.filter(i => i.status !== 'Closed').slice(0, 2).map(incident => (
                                <div key={incident._id} style={{ padding: '12px', background: '#fff1f1', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#991b1b' }}>{incident.hazardType || 'General Hazard'}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626' }}>{incident.severity}</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#b91c1c', margin: '0 0 8px 0', lineHeight: 1.4 }}>{incident.description}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', color: '#991b1b', fontWeight: 600 }}>Due: {incident.dueDate ? new Date(incident.dueDate).toLocaleDateString() : 'ASAP'}</span>
                                        <button style={{ padding: '4px 10px', background: 'white', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>Resolve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FeatureCard>
                </div>

                {/* 9. Engineer Reports */}
                <div style={{ gridColumn: 'span 3' }}>
                    <div style={{ background: '#0f172a', padding: '1.5rem', borderRadius: '20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={24} weight="duotone" />
                                Engineer Reports & Analytics
                            </h3>
                            <p style={{ color: '#94a3b8', margin: 0, maxWidth: '600px', fontSize: '0.9rem' }}>
                                Generate comprehensive daily, weekly, and milestone reports. Track structural health, material consumption, and workforce efficiency.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                View Analytics <ChartBar size={18} />
                            </button>
                            <button style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Generate Report <CaretRight size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .action-btn {
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }
                .dashboard-card {
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                }
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default CivilEngineerDashboard;
