import React, { useState, useEffect } from 'react';
import {
    HardHat, Users, CheckCircle, Clock,
    ArrowRight, MapPin, ChartBar, Plus,
    UsersThree, TrendUp, ClipboardText, Notebook,
    ListChecks, Calendar, WarningCircle, Monitor,
    ShieldWarning, Package, FileArrowUp, VideoCamera,
    Camera, PaperPlaneRight, CloudSun, UploadSimple,
    CaretRight, CheckSquare, ImageSquare
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import SiteLogModal from '../../components/SiteLogModal';
import ReportIncidentModal from '../../components/ReportIncidentModal';

const ProjectSiteDashboard = ({ setCurrentPage }) => {
    const [showSiteLogModal, setShowSiteLogModal] = useState(false);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [dailyTasks, setDailyTasks] = useState([]);
    const [attStats, setAttStats] = useState({ totalWorkers: 0, present: 0 });
    const [materialUsage, setMaterialUsage] = useState([]);
    const [siteLogs, setSiteLogs] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [quickLog, setQuickLog] = useState('');
    const [isSavingLog, setIsSavingLog] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();

        socketService.on('taskUpdated', (task) => setDailyTasks(prev => prev.map(t => t._id === task._id ? task : t)));
        socketService.on('materialUpdated', (material) => setMaterialUsage(prev => prev.map(m => m._id === material._id ? material : m)));
        socketService.on('attendanceUpdated', fetchAllData);
        socketService.on('siteLogAdded', (newLog) => setSiteLogs(prev => [newLog, ...prev]));
        socketService.on('incidentReported', (newIncident) => setIncidents(prev => [newIncident, ...prev]));

        return () => {
            socketService.off('taskUpdated');
            socketService.off('materialUpdated');
            socketService.off('attendanceUpdated');
            socketService.off('siteLogAdded');
            socketService.off('incidentReported');
        };
    }, []);

    const fetchAllData = async () => {
        try {
            const [tasksRes, materialsRes, logsRes, incidentsRes, attStatsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/materials`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/logs`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0 } }))
            ]);

            setDailyTasks(tasksRes.data || []);
            setMaterialUsage(materialsRes.data || []);
            setSiteLogs(logsRes.data || []);
            setIncidents(incidentsRes.data || []);
            setAttStats(attStatsRes.data);
        } catch (error) {
            console.error('Error fetching site data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogSave = async () => {
        if (!quickLog.trim()) return;
        setIsSavingLog(true);
        try {
            await axios.post(`${API_BASE_URL}/site-ops/logs`, {
                type: 'general',
                description: quickLog,
                timestamp: new Date()
            });
            setQuickLog('');
        } catch (error) {
            console.error("Failed to save log:", error);
            alert("Failed to save log.");
        } finally {
            setIsSavingLog(false);
        }
    };

    const getStats = () => {
        const activeLabor = attStats.present;
        const totalTasks = dailyTasks.length;
        const completedTasks = dailyTasks.filter(t => t.status === 'Completed').length;

        // Site Productivity: Weighted avg of Task Progress (70%) and Manpower Presence (30%)
        const taskProd = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
        const laborProd = attStats.totalWorkers > 0 ? (attStats.present / attStats.totalWorkers) : 1;
        const productivity = Math.round((taskProd * 0.7 + laborProd * 0.3) * 100);

        const openIssues = incidents.filter(i => i.status !== 'Closed').length +
            dailyTasks.filter(t => t.status === 'Delayed').length;
        return { activeLabor, productivity, openIssues };
    };

    const dashboardStats = getStats();

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#003380', margin: 0 }}>Site Operations Dashboard</h2>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} weight="bold" /> Downtown Heights - Site A
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setShowIncidentModal(true)} style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'white', color: '#be123c', border: '1px solid #fda4af',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fff1f2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                    >
                        <WarningCircle size={20} weight="bold" /> Report Incident
                    </button>
                    <button
                        onClick={() => setShowSiteLogModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                            background: '#0047AB', color: 'white', border: 'none',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 71, 171, 0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                        <Plus size={20} weight="bold" /> New Site Log
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '16px', color: '#16a34a' }}>
                        <UsersThree size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Active Labor</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.activeLabor}</div>
                    </div>
                </div>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#eff6ff', borderRadius: '16px', color: '#0047AB' }}>
                        <TrendUp size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Site Productivity</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.productivity}%</div>
                    </div>
                </div>
                <div style={{
                    background: 'white', padding: '2rem', borderRadius: '24px',
                    border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease'
                }} className="dashboard-card">
                    <div style={{ padding: '15px', background: '#fff1f2', borderRadius: '16px', color: '#e11d48' }}>
                        <WarningCircle size={32} weight="bold" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Open Issues</div>
                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>{dashboardStats.openIssues}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Daily Execution Tracker */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ListChecks size={24} weight="bold" color="#0047AB" /> Daily Execution Tracker
                            </h3>
                            <button style={{ background: 'none', border: 'none', color: '#0047AB', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>Manage Schedule</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {dailyTasks.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No tasks scheduled for today.</p>
                            ) : dailyTasks.slice(0, 3).map((task, idx) => (
                                <div key={task._id || idx} style={{ padding: '1.2rem', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{task.task || task.title}</h4>
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>Team: {task.team || task.assignedTo || 'General'}</p>
                                        </div>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: 800,
                                            color: task.status === 'Completed' ? '#16a34a' : task.status === 'Delayed' ? '#e11d48' : '#0047AB',
                                            padding: '4px 12px',
                                            background: task.status === 'Completed' ? '#16a34a15' : task.status === 'Delayed' ? '#e11d4815' : '#0047AB15',
                                            borderRadius: '8px'
                                        }}>{task.status}</span>
                                    </div>
                                    <div style={{ marginBottom: '5px' }}>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${task.progress}%`,
                                                height: '100%',
                                                background: task.status === 'Completed' ? '#16a34a' : task.status === 'Delayed' ? '#e11d48' : '#0047AB',
                                                borderRadius: '4px'
                                            }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Current Progress</span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{task.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material Usage Log */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Package size={24} weight="bold" color="#0047AB" /> Material Usage Log
                            </h3>
                            <button style={{ padding: '8px 16px', background: '#eff6ff', color: '#0047AB', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Record Usage</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ITEM</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>USAGE TODAY</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>INVENTORY</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialUsage.length === 0 ? (
                                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No material logs today.</td></tr>
                                ) : materialUsage.map((m, idx) => (
                                    <tr key={m._id || idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{m.item}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 700, color: '#0047AB' }}>{m.used || m.usage}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>{m.inventory}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                fontSize: '0.75rem', fontWeight: 800,
                                                color: m.status === 'Optimal' ? '#16a34a' : '#e11d48',
                                                padding: '4px 10px',
                                                background: m.status === 'Optimal' ? '#16a34a15' : '#e11d4815',
                                                borderRadius: '6px'
                                            }}>{m.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Site Progress Media */}
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Monitor size={24} weight="bold" color="#0047AB" /> Site Progress Media
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Camera size={18} /> Photo
                                </button>
                                <button style={{ padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <VideoCamera size={18} /> Video
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {siteLogs.flatMap(l => l.photos || []).slice(0, 4).length === 0 ? (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} style={{ aspectRatio: '1', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ImageSquare size={32} color="#cbd5e1" weight="duotone" />
                                    </div>
                                ))
                            ) : siteLogs.flatMap(l => l.photos || []).slice(0, 4).map((photo, i) => (
                                <div key={i} style={{ aspectRatio: '1', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                                    <img src={photo} alt="Site" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Safety & Issues Report */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#be123c', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldWarning size={24} color="#be123c" weight="bold" /> Safety & Issues Report
                        </h4>
                        {incidents.length === 0 ? (
                            <div style={{ padding: '1.2rem', background: '#f0fdf4', borderRadius: '16px', borderLeft: '4px solid #16a34a', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#16a34a', marginBottom: '8px' }}>SAFE ZONE</div>
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#0f172a', fontWeight: 600, margin: 0, opacity: 0.9 }}>
                                    No safety incidents reported today. Keep up the high standards.
                                </p>
                            </div>
                        ) : (
                            incidents.filter(i => i.status !== 'Closed').slice(0, 1).map(incident => (
                                <div key={incident._id} style={{ padding: '1.2rem', background: '#fff1f2', borderRadius: '16px', borderLeft: '4px solid #e11d48', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#e11d48' }}>{incident.severity?.toUpperCase() || 'HIGH'} PRIORITY</div>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#be123c', background: '#fff1f2', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fda4af' }}>{incident.status}</div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#0f172a', fontWeight: 700, margin: '0 0 4px 0' }}>
                                        {incident.hazardType || incident.title}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, margin: 0 }}>
                                        {incident.description?.length > 60 ? incident.description.substring(0, 60) + '...' : incident.description}
                                    </p>
                                </div>
                            ))
                        )}
                        <button
                            onClick={() => setShowIncidentModal(true)}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '12px',
                                background: '#e11d48', color: 'white', border: 'none',
                                fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#be123c'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#e11d48'}
                        >Report New Hazard</button>
                    </div>

                    {/* Labor & Attendance */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#16a34a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HardHat size={24} color="#16a34a" weight="bold" /> Labor & Attendance
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem' }}>
                            {(!attStats.tradeWise || attStats.tradeWise.length === 0) ? (
                                <p style={{ color: '#64748b', textAlign: 'center' }}>No attendance logged yet.</p>
                            ) : attStats.tradeWise.map((l, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{l.trade}</div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#16a34a' }}>{l.present}/{l.total}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, margin: 0 }}>Active Manpower</p>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: 800,
                                            color: '#16a34a',
                                            background: '#16a34a15',
                                            padding: '2px 8px', borderRadius: '4px'
                                        }}>{Math.round((l.present / l.total) * 100)}% Prod.</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage('manage-attendance')}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px',
                                background: '#f8fafc', color: '#0f172a', border: '1px solid #e2e8f0',
                                fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
                            }}>Manage Attendance</button>
                    </div>

                    {/* Site Diary & Activity Logs */}
                    <div style={{
                        background: 'white', padding: '1.8rem', borderRadius: '24px',
                        border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0047AB', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ClipboardText size={24} color="#0047AB" weight="bold" /> Site Diary & Activity Logs
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                            {siteLogs.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center' }}>No logs today.</p>
                            ) : siteLogs.map((log, idx) => (
                                <div key={log._id || idx} style={{
                                    padding: '1rem',
                                    background: log.type === 'incident' ? '#fff1f2' : log.type === 'weather' ? '#fffbeb' : '#eff6ff',
                                    borderRadius: '16px',
                                    borderLeft: `4px solid ${log.type === 'incident' ? '#e11d48' : log.type === 'weather' ? '#F59E0B' : '#0047AB'}`
                                }}>
                                    <div style={{
                                        fontSize: '0.75rem', fontWeight: 800,
                                        color: log.type === 'incident' ? '#be123c' : log.type === 'weather' ? '#B45309' : '#1E40AF',
                                        marginBottom: '4px', textTransform: 'uppercase'
                                    }}>
                                        {log.type || 'General'} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: log.type === 'incident' ? '#881337' : log.type === 'weather' ? '#92400E' : '#1E3A8A',
                                        fontWeight: 600, margin: 0, lineHeight: '1.4'
                                    }}>
                                        {log.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Type a quick log entry..."
                                value={quickLog}
                                onChange={(e) => setQuickLog(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
                                onKeyDown={(e) => e.key === 'Enter' && handleQuickLogSave()}
                            />
                            <button
                                onClick={handleQuickLogSave}
                                disabled={isSavingLog}
                                style={{
                                    padding: '0 15px', background: '#0047AB', color: 'white', border: 'none',
                                    borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                                }}
                            >
                                <PaperPlaneRight size={18} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSiteLogModal && <SiteLogModal onClose={() => setShowSiteLogModal(false)} />}
            {showIncidentModal && <ReportIncidentModal onClose={() => setShowIncidentModal(false)} />}

            <style>{`
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
                    transform: translateY(-4px);
                }
            `}</style>
        </div>
    );
};

export default ProjectSiteDashboard;
