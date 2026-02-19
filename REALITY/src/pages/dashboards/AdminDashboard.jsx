import React, { useState, useEffect } from 'react';
import {
    UserPlus, Gear, ShieldCheck, ToggleLeft, ToggleRight,
    PencilSimple, Plus, CreditCard, ListBullets, ChartBar,
    CaretRight, BellRinging, Globe, Lock, Download, Warning
} from '@phosphor-icons/react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';
import CreateUserModal from '../../components/CreateUserModal';

const AdminDashboard = ({ setCurrentPage }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [stats, setStats] = useState({
        activeSubscriptions: 0,
        systemHealth: '99.9%',
        pendingApprovals: 0,
        safetyHealth: 'Stable'
    });
    const [loading, setLoading] = useState(true);

    const logs = [
        { id: 1, action: 'User Deactivated', user: 'Bob Wilson', time: '2 hours ago', status: 'Security' },
        { id: 2, action: 'Billing Tier Updated', user: 'Admin', time: '5 hours ago', status: 'Finance' },
        { id: 3, action: 'Workflow Triggered', user: 'System', time: '12 hours ago', status: 'Automation' },
    ];

    useEffect(() => {
        fetchDashboardData();

        // Real-time listeners
        socketService.on('newUser', (user) => {
            console.log('[REAL-TIME] New user added:', user);
            setUsers(prev => [user, ...prev]);
        });

        socketService.on('userUpdated', (updatedUser) => {
            console.log('[REAL-TIME] User updated:', updatedUser);
            setUsers(prev => prev.map(u => u._id === updatedUser._id ? updatedUser : u));
        });

        socketService.on('incidentReported', (incident) => {
            setIncidents(prev => [incident, ...prev]);
            fetchDashboardData();
        });

        socketService.on('taskUpdated', fetchDashboardData);
        socketService.on('attendanceUpdated', fetchDashboardData);

        return () => {
            socketService.off('newUser');
            socketService.off('userUpdated');
            socketService.off('incidentReported');
            socketService.off('taskUpdated');
            socketService.off('attendanceUpdated');
        };
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [usersRes, incidentsRes, attStatsRes, tasksRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/users`),
                axios.get(`${API_BASE_URL}/site-ops/incidents`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0 } })),
                axios.get(`${API_BASE_URL}/tasks`).catch(() => ({ data: [] }))
            ]);

            setUsers(usersRes.data);
            setIncidents(incidentsRes.data);

            const attendanceRate = attStatsRes.data.totalWorkers > 0 ? (attStatsRes.data.present / attStatsRes.data.totalWorkers) : 1;
            const criticalCount = incidentsRes.data.filter(i => i.severity === 'Critical').length;

            // Site Productivity: Weighted avg of Task Progress (70%) and Manpower Presence (30%)
            const totalTasks = tasksRes.data.length;
            const completedTasks = tasksRes.data.filter(t => t.status === 'Completed').length;
            const taskProd = totalTasks > 0 ? (completedTasks / totalTasks) : 0;
            const productivity = Math.round((taskProd * 0.7 + attendanceRate * 0.3) * 100);

            setStats(prev => ({
                ...prev,
                activeSubscriptions: usersRes.data.filter(u => u.status === 'Active').length,
                pendingApprovals: usersRes.data.filter(u => u.status === 'Pending').length,
                safetyHealth: criticalCount > 0 ? 'Urgent Review' : 'Stable',
                manpowerHealth: `${(attendanceRate * 100).toFixed(0)}%`,
                siteProductivity: `${productivity}%`
            }));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id) => {
        const user = users.find(u => u._id === id);
        let newStatus;

        if (user.status === 'Pending') {
            newStatus = 'Active';
        } else {
            newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        }

        try {
            await axios.patch(`${API_BASE_URL}/users/${id}`, { status: newStatus });
            setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));

            // Refresh stats
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleCreateUser = async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/users`, {
                name: userData.name || `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                password: userData.tempPassword, // Pass the generated password
                role: userData.roles[0] || 'Client',
                status: userData.status || 'Active'
            });
            setUsers([response.data, ...users]);
            setShowCreateModal(false);
            fetchDashboardData();
        } catch (error) {
            console.error('Error creating user:', error);
            alert("Failed to create user. Ensure the email is unique.");
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Control Center</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setCurrentPage('reports')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            background: 'white', color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        <ChartBar size={20} weight="bold" /> Global Reports
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            background: 'var(--pivot-blue)', color: 'white', border: 'none',
                            borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)'
                        }}
                    >
                        <UserPlus size={20} weight="bold" /> Create User
                    </button>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && <CreateUserModal onClose={() => setShowCreateModal(false)} onSave={handleCreateUser} />}

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Active Subscriptions', value: stats.activeSubscriptions, color: 'var(--pivot-blue)' },
                    { label: 'Manpower Health', value: stats.manpowerHealth || '0%', color: '#0047AB' },
                    { label: 'Site Productivity', value: stats.siteProductivity || '0%', color: '#6366f1' },
                    { label: 'Safety Health', value: stats.safetyHealth, color: stats.safetyHealth === 'Stable' ? '#4CAF50' : '#e53e3e' }
                ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.2rem' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '5px' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Section 0: Global Safety Overview (New) */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderLeft: '6px solid #e53e3e' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', margin: 0 }}>
                        <Warning size={24} color="#e53e3e" weight="bold" /> Global Safety & High-Risk Trends
                    </h3>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e53e3e', background: '#feeded', padding: '4px 12px', borderRadius: '8px' }}>
                        {incidents.filter(i => i.severity === 'Critical').length} Critical Issues
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {incidents.filter(i => i.status !== 'Closed').slice(0, 3).map(incident => (
                        <div key={incident._id} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: incident.severity === 'Critical' ? '#e53e3e' : '#475569' }}>{incident.hazardType || 'Hazard'}</span>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>{incident.status}</span>
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>{incident.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project: {incident.areaZone || 'Global'}</div>
                        </div>
                    ))}
                    {incidents.length === 0 && <p style={{ gridColumn: 'span 3', textAlign: 'center', color: '#64748b', padding: '1rem' }}>No active safety hazards reported.</p>}
                </div>
            </div>

            {/* Section 1: User Management & Permissions */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={24} color="var(--pivot-blue)" /> Users & Permissions
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)', opacity: 0.6 }}>
                            <th style={{ padding: '1rem' }}>User Profile</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                                <td style={{ padding: '1rem' }}>{u.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700,
                                        background: u.status === 'Active' ? '#e6f4ea' : u.status === 'Pending' ? '#fffbeb' : '#fff0f0',
                                        color: u.status === 'Active' ? '#1e7e34' : u.status === 'Pending' ? '#b45309' : '#e53e3e'
                                    }}>{u.status}</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => toggleStatus(u._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.status === 'Active' ? '#4CAF50' : '#ccc' }}>
                                        {u.status === 'Active' ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} weight="fill" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Section 2: Activity Logs & Audit Trails */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <ListBullets size={22} color="var(--pivot-blue)" /> Audit Trails & Logs
                    </h3>
                    {logs.map(log => (
                        <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{log.action}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{log.user} • {log.time}</div>
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pivot-blue)' }}>{log.status}</span>
                        </div>
                    ))}
                    <button style={{ width: '100%', marginTop: '1rem', padding: '10px', background: 'transparent', border: 'none', color: 'var(--pivot-blue)', fontWeight: 700, cursor: 'pointer' }}>
                        View Full History <CaretRight size={14} weight="bold" />
                    </button>
                </div>

                {/* Section 3: Subscription & Billing */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <CreditCard size={22} color="var(--pivot-blue)" /> Billing & Plans
                    </h3>
                    <div style={{ padding: '1rem', background: 'var(--pivot-blue-soft)', borderRadius: '12px', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Current Plan</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Enterprise AI Plus</div>
                        <div style={{ fontSize: '0.75rem', marginTop: '5px' }}>Next renewal: March 12, 2026</div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setCurrentPage('billing')} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Manage Plan</button>
                        <button style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'white', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>History</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Section 4: System-Wide Settings */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                        <Globe size={22} color="var(--pivot-blue)" /> System Configuration
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { label: 'Maintenance Mode', icon: <Lock size={18} />, status: 'Off' },
                            { label: 'Real-time Sync', icon: <BellRinging size={18} />, status: 'On' },
                            { label: 'Public Registration', icon: <Plus size={18} />, status: 'On' },
                            { label: 'Global API Access', icon: <Globe size={18} />, status: 'On' }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ opacity: 0.6 }}>{item.icon}</span>
                                    <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: item.status === 'On' ? '#4CAF50' : '#e53e3e' }}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 5: Performance Reports Generation */}
                <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--pivot-blue) 0%, #003380 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Intelligence Reports</h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: '1.5' }}>
                        Generate a comprehensive PDF audit of system performance, lead conversions, and site activity across all regions.
                    </p>
                    <button style={{
                        width: '100%', padding: '12px', borderRadius: '10px',
                        background: 'white', color: 'var(--pivot-blue)', border: 'none',
                        fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}>
                        <Download size={20} weight="bold" /> Download PDF
                    </button>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1.5rem', paddingTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>
                        Last generated: Yesterday, 11:45 PM
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
        </div >
    );
};

export default AdminDashboard;
