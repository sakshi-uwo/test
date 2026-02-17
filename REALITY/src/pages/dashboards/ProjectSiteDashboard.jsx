import React, { useState, useEffect } from 'react';
import {
    HardHat, Users, CheckCircle, Clock,
    ArrowRight, MapPin, ChartBar, Plus,
    UsersThree, TrendUp, ClipboardText, Notebook,
    ListChecks, Calendar, WarningCircle, Monitor,
    ShieldWarning, Package, FileArrowUp, VideoCamera,
    Camera, PaperPlaneRight
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import SiteLogModal from '../../components/SiteLogModal';
import ReportIncidentModal from '../../components/ReportIncidentModal';

const ProjectSiteDashboard = () => {
    const [showSiteLogModal, setShowSiteLogModal] = useState(false);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [dailyTasks, setDailyTasks] = useState([]);
    const [laborAttendance, setLaborAttendance] = useState([]);
    const [materialUsage, setMaterialUsage] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState([
        { label: 'Active Labor', value: '0', icon: <Users size={24} />, color: '#4CAF50' },
        { label: 'Site Productivity', value: '0%', icon: <TrendUp size={24} />, color: 'var(--pivot-blue)' },
        { label: 'Open Issues', value: '0', icon: <WarningCircle size={24} />, color: '#f44336' }
    ]);

    const [siteLogs, setSiteLogs] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [quickLog, setQuickLog] = useState('');
    const [isSavingLog, setIsSavingLog] = useState(false);

    useEffect(() => {
        fetchAllData();

        // Real-time listeners
        socketService.on('taskUpdated', (task) => {
            setDailyTasks(prev => prev.map(t => t._id === task._id ? task : t));
        });

        socketService.on('materialUpdated', (material) => {
            setMaterialUsage(prev => prev.map(m => m._id === material._id ? material : m));
        });

        socketService.on('attendanceUpdated', () => {
            updateStats();
        });

        socketService.on('siteLogAdded', (newLog) => {
            setSiteLogs(prev => [newLog, ...prev]);
        });

        socketService.on('incidentReported', (newIncident) => {
            setIncidents(prev => [newIncident, ...prev]);
        });

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
            const [tasksRes, materialsRes, attendanceRes, logsRes, incidentsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/materials`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/logs`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] }))
            ]);

            setDailyTasks(tasksRes.data || []);
            setMaterialUsage(materialsRes.data || []);
            setLaborAttendance(attendanceRes.data || []);
            setSiteLogs(logsRes.data || []);
            setIncidents(incidentsRes.data || []);

            // Calculate stats
            const totalLabor = attendanceRes.data?.reduce((sum, a) => sum + (a.present || 0), 0) || 0;
            const completedTasks = tasksRes.data?.filter(t => t.status === 'Completed').length || 0;
            const totalTasks = tasksRes.data?.length || 1;
            const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const openIssues = (tasksRes.data?.filter(t => t.status === 'Delayed').length || 0) + (incidentsRes.data?.filter(i => i.status !== 'Closed' && i.status !== 'Resolved').length || 0);

            setStats([
                { label: 'Active Labor', value: totalLabor.toString(), icon: <Users size={24} />, color: '#4CAF50' },
                { label: 'Site Productivity', value: `${productivity}%`, icon: <TrendUp size={24} />, color: 'var(--pivot-blue)' },
                { label: 'Open Issues', value: openIssues.toString(), icon: <WarningCircle size={24} />, color: '#f44336' }
            ]);
        } catch (error) {
            console.error('Error fetching site data:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = async () => {
        try {
            const attendanceRes = await axios.get(`${API_BASE_URL}/attendance`);
            const totalLabor = attendanceRes.data?.reduce((sum, a) => sum + (a.present || 0), 0) || 0;
            setStats(prev => prev.map((s, i) => i === 0 ? { ...s, value: totalLabor.toString() } : s));
        } catch (error) {
            console.error('Error updating stats:', error);
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

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Site Operations Dashboard</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2c3e50', fontWeight: 600 }}>
                        <MapPin size={18} weight="bold" /> <span>Downtown Heights - Site A</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                        background: 'white', color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }} onClick={() => setShowIncidentModal(true)}>
                        <ShieldWarning size={20} weight="bold" color="#e53e3e" /> Report Incident
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'var(--pivot-blue)', color: 'white', border: 'none',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 71, 171, 0.2)'
                    }} onClick={() => setShowSiteLogModal(true)}>
                        <Plus size={20} weight="bold" /> New Site Log
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '12px',
                            background: `${s.color}15`, color: s.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#2c3e50', fontWeight: 700 }}>{s.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a1a1a' }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                {/* Column 1: Daily Tasks & Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Daily Tasks Execution */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <ListChecks size={24} color="var(--pivot-blue)" weight="bold" /> Daily Execution Tracker
                            </h3>
                            <button style={{ fontSize: '0.8rem', color: 'var(--pivot-blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Manage Schedule</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dailyTasks.length === 0 && !loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                    <ListChecks size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                                    <p>No tasks scheduled for today.</p>
                                </div>
                            ) : (
                                dailyTasks.map(t => (
                                    <div key={t._id} style={{ padding: '1.2rem', background: '#f8f9fa', borderRadius: '14px', border: '1px solid #eee' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <div>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1a1a' }}>{t.title || t.task || 'Untitled Task'}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#2c3e50', fontWeight: 600 }}>Team: {t.assignedTo || t.team || 'Unassigned'}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                                    background: t.status === 'Completed' ? '#e6f4ea' : t.status === 'Delayed' ? '#fff5f5' : '#ebf4ff',
                                                    color: t.status === 'Completed' ? '#1e7e34' : t.status === 'Delayed' ? '#e53e3e' : 'var(--pivot-blue)'
                                                }}>{t.status || 'Pending'}</span>
                                            </div>
                                        </div>
                                        <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                            <div style={{ width: `${t.progress || 0}%`, height: '100%', background: t.status === 'Delayed' ? '#f56565' : 'var(--pivot-blue)', transition: 'width 1s ease' }}></div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2c3e50' }}>Current Progress</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>{t.progress || 0}%</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Material Usage Tracking */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <Package size={24} color="var(--pivot-blue)" weight="bold" /> Material Usage Log
                            </h3>
                            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Record Usage</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Item</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Usage Today</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Inventory</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialUsage.map((m, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>{m.item}</td>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--pivot-blue)' }}>{m.used}</td>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 600 }}>{m.remaining}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 800,
                                                background: m.status === 'Optimal' ? '#e6f4ea' : '#fff5f5',
                                                color: m.status === 'Optimal' ? '#1e7e34' : '#e53e3e'
                                            }}>{m.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Site Photos & Media Logs (Visual Progress) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <Monitor size={22} color="var(--pivot-blue)" weight="bold" /> Site Progress Media
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <Camera size={16} weight="bold" /> Photo
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <VideoCamera size={16} weight="bold" /> Video
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {siteLogs.flatMap(l => l.photos || []).length > 0 ? (
                                siteLogs.flatMap(l => l.photos || []).slice(0, 4).map((photo, i) => (
                                    <div key={i} style={{ aspectRatio: '1', background: '#f8f9fa', borderRadius: '12px', overflow: 'hidden', border: '2px solid #eee' }}>
                                        <img src={photo} alt="Site progress" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))
                            ) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#9ca3af', background: '#f8f9fa', borderRadius: '12px', border: '2px dashed #eee' }}>
                                    <Camera size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>No recent media uploads</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Labor & Productivity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Safety Concerns & Alerts */}
                    <div className="card" style={{ background: '#fff9f9', border: '1px solid #fee2e2' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b' }}>
                            <ShieldWarning size={24} color="#dc2626" weight="fill" /> Safety & Issues Report
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {incidents.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                                    <CheckCircle size={24} color="#4CAF50" weight="fill" style={{ marginBottom: '5px' }} />
                                    <p style={{ margin: 0 }}>No active safety issues reported.</p>
                                </div>
                            ) : (
                                incidents.slice(0, 3).map((incident) => (
                                    <div key={incident._id} style={{ padding: '12px', background: 'white', borderRadius: '12px', borderLeft: `4px solid ${incident.severity === 'Critical' || incident.severity === 'High' ? '#dc2626' : '#d97706'}` }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: incident.severity === 'Critical' || incident.severity === 'High' ? '#dc2626' : '#d97706', marginBottom: '4px', textTransform: 'uppercase' }}>
                                            {incident.severity} PRIORITY
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 700 }}>{incident.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{incident.location || 'Location not specified'}</div>
                                    </div>
                                ))
                            )}
                            <button
                                onClick={() => setShowIncidentModal(true)}
                                style={{ width: '100%', marginTop: '5px', padding: '10px', borderRadius: '10px', background: '#dc2626', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                            >
                                Report New Hazard
                            </button>
                        </div>
                    </div>

                    {/* Labor Attendance & Health */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <UsersThree size={24} color="#4CAF50" weight="bold" /> Labor & Attendance
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {laborAttendance.map((l, i) => (
                                <div key={i} style={{ paddingBottom: '12px', borderBottom: i !== laborAttendance.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a1a' }}>{l.trade}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4CAF50' }}>{l.present}/{l.total}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#2c3e50', fontWeight: 600 }}>Shift: General (8AM-5PM)</div>
                                        <div style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#e6f4ea', color: '#1e7e34', fontWeight: 700 }}>{l.productivity} Productivity</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={{ width: '100%', marginTop: '1.5rem', padding: '12px', borderRadius: '10px', background: '#f8f9fa', color: '#1a1a1a', border: '1px solid #ddd', fontWeight: 700, cursor: 'pointer' }}>Manage Attendance</button>
                    </div>

                    {/* Site Diary & Logs */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <Notebook size={24} color="var(--pivot-blue)" weight="bold" /> Site Diary & Activity Logs
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                            {siteLogs.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                                    <p>No activity logs for today.</p>
                                </div>
                            ) : (
                                siteLogs.slice(0, 5).map((log) => (
                                    <div key={log._id} style={{
                                        padding: '10px',
                                        background: log.type === 'weather' ? '#fff9e6' : log.type === 'material' ? '#f0f7ff' : '#f8f9fa',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid ${log.type === 'weather' ? '#F59E0B' : log.type === 'material' ? 'var(--pivot-blue)' : '#9ca3af'}`
                                    }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: log.type === 'weather' ? '#F59E0B' : log.type === 'material' ? 'var(--pivot-blue)' : '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
                                            {log.type} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 700 }}>{log.description}</div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7a7a7a', marginBottom: '8px', display: 'block' }}>Add New Log Entry</label>
                            <textarea
                                value={quickLog}
                                onChange={(e) => setQuickLog(e.target.value)}
                                placeholder="Record site activity..."
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', fontSize: '0.85rem', fontFamily: 'inherit' }}
                            ></textarea>
                            <button
                                onClick={handleQuickLogSave}
                                disabled={isSavingLog}
                                style={{
                                    width: '100%', marginTop: '8px', padding: '10px',
                                    background: isSavingLog ? '#ccc' : 'var(--pivot-blue)',
                                    color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700,
                                    cursor: isSavingLog ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                <PaperPlaneRight size={18} weight="bold" /> {isSavingLog ? 'Saving...' : 'Save Log Entry'}
                            </button>
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
            {showSiteLogModal && (
                <SiteLogModal onClose={() => setShowSiteLogModal(false)} />
            )}
            {showIncidentModal && (
                <ReportIncidentModal onClose={() => setShowIncidentModal(false)} />
            )}
        </div>
    );
};

export default ProjectSiteDashboard;
