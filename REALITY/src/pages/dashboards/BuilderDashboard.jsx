import React, { useState, useEffect } from 'react';
import {
    Plus, Buildings, Users, Gear, ChartLineUp,
    CurrencyDollar, PencilSimple, Trash, UserPlus,
    ArrowRight, CheckCircle, WarningCircle, Sparkle,
    FileArrowUp, Calendar, Clock, Checks, FileText,
    Robot, HardDrive, MagnifyingGlass
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import CreateProjectModal from '../../components/CreateProjectModal';
import AIPlanningModal from '../../components/AIPlanningModal';
import ScheduleGenerationModal from '../../components/ScheduleGenerationModal';

const BuilderDashboard = () => {
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showAIPlanningModal, setShowAIPlanningModal] = useState(false);
    const [showScheduleGenerationModal, setShowScheduleGenerationModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const expenseApprovals = [
        { id: 1, item: 'Steel Reinforcement', amount: '$45,000', project: 'Skyline Towers', date: 'Today' },
        { id: 2, item: 'Labor Overtime (W12)', amount: '$12,400', project: 'Green Valley', date: 'Yesterday' },
    ];

    const documents = [
        { id: 1, name: 'Blueprint_Final_v2.pdf', project: 'Skyline Towers', type: 'Technical' },
        { id: 2, name: 'Structural_Audit_Report.docx', project: 'Green Valley', type: 'Compliance' },
    ];

    useEffect(() => {
        fetchProjects();

        // Real-time listeners
        socketService.on('project-added', (project) => {
            console.log('[REAL-TIME] New project added:', project);
            setProjects(prev => [project, ...prev]);
        });

        socketService.on('project-updated', (updatedProject) => {
            console.log('[REAL-TIME] Project updated:', updatedProject);
            setProjects(prev => prev.map(p => p._id === updatedProject._id ? updatedProject : p));
        });

        return () => {
            socketService.off('project-added');
            socketService.off('project-updated');
        };
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects`);
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (projectData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/projects`, {
                name: projectData.projectName,
                location: projectData.location || 'New Location',
                budget: parseFloat(projectData.estimatedCost) || 0,
                totalUnits: projectData.totalUnits || 0,
                availableUnits: projectData.totalUnits || 0,
                status: 'Active'
            });
            setProjects([response.data, ...projects]);
            setShowCreateProjectModal(false);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Project Portfolio</h2>
                    <p style={{ color: '#2c3e50', fontWeight: 600 }}>Manage your construction projects and resources</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'white', color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        <FileArrowUp size={20} weight="bold" /> Upload Docs
                    </button>
                    <button
                        onClick={() => setShowCreateProjectModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: 'var(--pivot-blue)', color: 'white', border: 'none',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(0, 71, 171, 0.2)'
                        }}
                    >
                        <Plus size={20} weight="bold" /> Start New Project
                    </button>
                </div>
            </div>

            {showCreateProjectModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateProjectModal(false)}
                    onSave={handleCreateProject}
                />
            )}

            {showAIPlanningModal && (
                <AIPlanningModal onClose={() => setShowAIPlanningModal(false)} />
            )}

            {showScheduleGenerationModal && (
                <ScheduleGenerationModal onClose={() => setShowScheduleGenerationModal(false)} />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* Left Column: Metrics & Projects */}
                <div>
                    {/* Overall Portfolio Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        <div className="card" style={{ background: 'var(--pivot-blue)', color: 'white' }}>
                            <ChartLineUp size={28} style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Portfolio Progress</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>32.5% Average</div>
                        </div>
                        <div className="card">
                            <CurrencyDollar size={28} color="var(--pivot-blue)" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.8rem', color: '#2c3e50', fontWeight: 700 }}>Total Budget Allocated</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>$4.2M</div>
                        </div>
                        <div className="card">
                            <Users size={28} color="#4CAF50" style={{ marginBottom: '1rem' }} />
                            <div style={{ fontSize: '0.8rem', color: '#2c3e50', fontWeight: 700 }}>Active Resource Teams</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>12 Units</div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Buildings size={24} color="var(--pivot-blue)" /> Active Construction Projects
                    </h3>

                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {projects.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                                <Buildings size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                <p>No projects yet. Click "Start New Project" to begin.</p>
                            </div>
                        )}
                        {projects.map((p) => {
                            const progress = p.totalUnits ? Math.round(((p.totalUnits - p.availableUnits) / p.totalUnits) * 100) : 0;
                            const spent = p.spent || 0;
                            const budget = p.budget || 0;

                            return (
                                <div key={p._id} className="card" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#1a1a1a' }}>{p.name}</h4>
                                            <div style={{ fontSize: '0.85rem', color: '#2c3e50', fontWeight: 600 }}>{p.location || 'Location TBD'}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>{progress}%</div>
                                                <div style={{ fontSize: '0.7rem', color: '#2c3e50', fontWeight: 600 }}>Progress</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timeline & Milestones */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Calendar size={18} color="var(--pivot-blue)" /> Project Status
                                            </div>
                                            <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '12px', background: p.status === 'Active' ? '#e6f4ea' : '#fff0f0', color: p.status === 'Active' ? '#1e7e34' : '#e53e3e', fontWeight: 700 }}>
                                                {p.status || 'Active'}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div style={{ padding: '1.2rem', background: '#f8f9fa', borderRadius: '14px', border: '1px solid #eee' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#2c3e50', fontWeight: 700, marginBottom: '5px' }}>Financial Snapshot</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a' }}>${(spent / 1000).toFixed(0)}k</div>
                                                    <div style={{ fontSize: '0.65rem', color: '#2c3e50', fontWeight: 600 }}>Spent of ${(budget / 1000).toFixed(0)}k</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <CurrencyDollar size={20} color="var(--pivot-blue)" />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.2rem', background: '#f8f9fa', borderRadius: '14px' }}>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '5px' }}>Units</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--pivot-blue)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{p.availableUnits || 0}</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Available of {p.totalUnits || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right Column: AI Advisor & Approvals */}
                <div>
                    {/* AI Advisor Panel */}
                    <div className="card" style={{ background: 'linear-gradient(135deg, #001a4d 0%, #003380 100%)', color: 'white', marginBottom: '2rem', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                            <Robot size={100} weight="fill" />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkle size={24} weight="fill" color="#ffd700" /> AI Project Advisor
                        </h3>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                            "Based on the steel shortage in North Suburbs, I recommend pre-stocking rebar for **Green Valley residency** within the next 48 hours to avoid a 12% cost hike."
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                onClick={() => setShowAIPlanningModal(true)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'white', color: '#003380', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                Analyze Planning
                            </button>
                            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => setShowScheduleGenerationModal(true)}>Generate Schedule</button>
                        </div>
                    </div>

                    {/* Expense Approvals */}
                    <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Checks size={22} color="#4CAF50" weight="bold" /> Expense Approvals
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {expenseApprovals.map(ex => (
                                <div key={ex.id} style={{ padding: '12px', background: '#f8f9fa', borderRadius: '10px', borderLeft: '4px solid #4CAF50' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a' }}>{ex.item}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0047AB' }}>{ex.amount}</div>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#2c3e50', fontWeight: 600 }}>{ex.project} • {ex.date}</div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button style={{ flex: 1, padding: '5px', borderRadius: '5px', background: '#4CAF50', color: 'white', border: 'none', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>Approve</button>
                                        <button style={{ flex: 0.5, padding: '5px', borderRadius: '5px', background: 'white', border: '1px solid #ddd', fontSize: '0.7rem', cursor: 'pointer' }}>Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Document Management */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <HardDrive size={22} color="var(--pivot-blue)" weight="bold" /> Project Documents
                        </h3>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <MagnifyingGlass size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                            <input type="text" placeholder="Search files..." style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {documents.map(doc => (
                                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', background: '#f8f9fa' }}>
                                    <FileText size={24} color="var(--pivot-blue)" />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#2c3e50', fontWeight: 600 }}>{doc.type} • {doc.project}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    transition: all 0.3s ease;
                }
                .card:hover {
                    box-shadow: 0 12px 40px rgba(0, 71, 171, 0.08);
                }
            `}</style>
        </div>
    );
};

export default BuilderDashboard;
