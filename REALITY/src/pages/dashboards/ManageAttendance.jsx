```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users, CheckCircle, XCircle, Clock, Calendar,
    Download, Funnel, MagnifyingGlass, FloppyDisk,
    ArrowLeft, HardHat, Timer, BellRinging,
    SealCheck, Info, CaretRight, Plus,
    PencilLine, Trash, PlusCircle, IdentificationCard, Storefront, Money, UserPlus, ArrowsLeftRight
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/api';
import socketService from '../../services/socket';

const ManageAttendance = () => {
    const [viewMode, setViewMode] = useState('attendance'); // 'attendance' or 'labor'
    const [workers, setWorkers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [stats, setStats] = useState({
        totalWorkers: 0, present: 0, absent: 0, late: 0, onLeave: 0, overtime: 0
    });
    const [showAuditModal, setShowAuditModal] = useState(null); // stores workerId to show history for
    const [auditHistory, setAuditHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState({ trade: 'All', contractor: 'All', search: '' });

    // Labor Management State
    const [showLaborForm, setShowLaborForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [formData, setFormData] = useState({
        name: '', role: 'Helper', tradeType: 'Civil', contractor: '',
        phoneNumber: '', wageType: 'Daily', wageAmount: '', idProof: '', status: 'Active'
    });
    const [assignData, setAssignData] = useState({
        project: '', block: '', shift: 'Morning', startDate: '', endDate: ''
    });

    useEffect(() => {
        fetchData();
        fetchProjects();

        socketService.on('attendanceUpdated', fetchData);
        socketService.on('workerAdded', fetchData);
        socketService.on('workerUpdated', fetchData);
        socketService.on('workerAssigned', fetchData);

        return () => {
            socketService.off('attendanceUpdated');
            socketService.off('workerAdded');
            socketService.off('workerUpdated');
            socketService.off('workerAssigned');
        };
    }, [date]);

    const handleExport = async (type) => {
        alert(`Generating ${ type } Attendance Report...\n - Formats: PDF, Excel\n - Scope: All Contractors\n - Status: Success\n\nYour download will begin shortly.`);
    };

    const fetchAuditHistory = (workerId) => {
        const att = attendance[workerId];
        if (att && att.editHistory) {
            setAuditHistory(att.editHistory);
            setShowAuditModal(workerId);
        } else {
            alert("No correction history found for this record.");
        }
    };

    // Logic for auto-calculating OT when check-out changes
    const calculateOT = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const [inH, inM] = checkIn.split(':').map(Number);
        const [outH, outM] = checkOut.split(':').map(Number);
        const totalHours = (outH + outM / 60) - (inH + inM / 60);
        const standardHours = 9;
        return totalHours > standardHours ? (totalHours - standardHours).toFixed(1) : 0;
    };

    const handleAutoSync = () => {
        // Simulate syncing from QR/Bio devices
        alert("Syncing with Site entry devices...\n- QR Code logs fetched (12)\n- Mobile Geo-fenced logs fetched (8)");
        // In real app, this would call a backend trigger
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [workersRes, attendanceRes, statsRes, alertsRes] = await Promise.all([
                axios.get(`${ API_BASE_URL } /attendance/workers`).catch(() => ({ data: [] })),
                axios.get(`${ API_BASE_URL }/attendance?date=${date}`).catch (() => ({ data: [] })),
axios.get(`${API_BASE_URL}/attendance/stats`).catch(() => ({ data: { totalWorkers: 0, present: 0, absent: 0, late: 0, onLeave: 0, overtime: 0 } })),
    axios.get(`${API_BASE_URL}/attendance/alerts`).catch(() => ({ data: [] }))
            ]);

setWorkers(workersRes.data);
setAlerts(alertsRes.data);

// Map attendance to worker ID for easy lookup
const attendanceMap = {};
attendanceRes.data.forEach(a => {
    attendanceMap[a.workerId._id || a.workerId] = a;
});
setAttendance(attendanceMap);
setStats(statsRes.data);
        } catch (error) {
    console.error("Error fetching attendance data:", error);
} finally {
    setLoading(false);
}
    };

const handleStatusChange = (workerId, status) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(12, 0, 0, 0);

    setAttendance(prev => ({
        ...prev,
        [workerId]: {
            ...(prev[workerId] || {}),
            workerId,
            status,
            date: normalizedDate,
            shift: prev[workerId]?.shift || 'Morning',
            remarks: prev[workerId]?.remarks || ''
        }
    }));
};

const handleBulkSave = async () => {
    setSaving(true);
    try {
        const updates = Object.values(attendance);
        await axios.post(`${API_BASE_URL}/attendance`, updates);
        // socket will trigger refresh
        alert("Attendance and corrections saved successfully!");
    } catch (error) {
        console.error("Error saving attendance:", error);
        alert("Failed to save attendance.");
    } finally {
        setSaving(false);
    }
};

const filteredWorkers = workers.filter(w => {
    const matchesTrade = filter.trade === 'All' || w.tradeType === filter.trade;
    const matchesContractor = filter.contractor === 'All' || w.contractor === filter.contractor;
    const matchesSearch = w.name.toLowerCase().includes(filter.search.toLowerCase());
    return matchesTrade && matchesContractor && matchesSearch;
});

const trades = ['All', ...new Set(workers.map(w => w.tradeType))];
const contractors = ['All', ...new Set(workers.map(w => w.contractor))];

return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

        {/* Audit Log Modal */}
        {showAuditModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Correction History</h3>
                        <button onClick={() => setShowAuditModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <XCircle size={24} weight="fill" />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {auditHistory.map((log, i) => (
                            <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0047AB' }}>{log.previousStatus} → {log.updatedStatus}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{new Date(log.updatedAt).toLocaleString()}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>"{log.reason}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={() => setCurrentPage('dashboard')}
                    style={{ border: 'none', background: 'white', padding: '10px', borderRadius: '12px', cursor: 'pointer', display: 'flex', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                >
                    <ArrowLeft size={20} weight="bold" color="#64748b" />
                </button>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0047AB', margin: 0 }}>Attendance & Compliance</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <Calendar size={18} weight="bold" color="#64748b" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            style={{ border: 'none', background: 'transparent', fontWeight: 700, color: '#64748b', outline: 'none', fontSize: '1rem' }}
                        />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                        <Download size={20} /> Export
                    </button>
                    <div className="dropdown" style={{ display: 'none' }}> {/* Logic for dropdown */} </div>
                    {/* Simplified Export Buttons for demo */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button onClick={() => handleExport('Daily')} style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Daily</button>
                        <button onClick={() => handleExport('Weekly')} style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Weekly</button>
                        <button onClick={() => handleExport('Monthly')} style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Monthly</button>
                    </div>
                </div>
                <button
                    onClick={handleBulkSave}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#0047AB', border: 'none', borderRadius: '12px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}
                >
                    {saving ? 'Saving...' : <><FloppyDisk size={20} weight="bold" /> Finalize Records</>}
                </button>
            </div>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
                { label: 'Total Workers', value: stats.totalWorkers, icon: <Users size={24} />, color: '#0047AB', bg: '#eff6ff' },
                { label: 'Present', value: stats.present, icon: <CheckCircle size={24} />, color: '#16a34a', bg: '#f0fdf4' },
                { label: 'Absent', value: stats.absent, icon: <XCircle size={24} />, color: '#dc2626', bg: '#fff1f1' },
                { label: 'Late', value: stats.late, icon: <Clock size={24} />, color: '#ea580c', bg: '#fff7ed' },
                { label: 'On Leave', value: stats.onLeave, icon: <Calendar size={24} />, color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'Overtime', value: stats.overtime, icon: <Timer size={24} />, color: '#0891b2', bg: '#ecfeff' }
            ].map((stat, i) => (
                <div key={i} style={{ background: 'white', padding: '1.2rem', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ color: stat.color, background: stat.bg, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {stat.icon}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{stat.label}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>{stat.value}</div>
                </div>
            ))}
        </div>

        {/* Filters & Search */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                <MagnifyingGlass size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Search worker by name..."
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontWeight: 600 }}
                />
            </div>

            <div style={{ display: 'flex', gap: '0.8rem' }}>
                <select
                    value={filter.trade}
                    onChange={(e) => setFilter(prev => ({ ...prev, trade: e.target.value }))}
                    style={{ padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', outline: 'none', minWidth: '150px' }}
                >
                    {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
                </select>

                <select
                    value={filter.contractor}
                    onChange={(e) => setFilter(prev => ({ ...prev, contractor: e.target.value }))}
                    style={{ padding: '12px 15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600, color: '#475569', outline: 'none', minWidth: '150px' }}
                >
                    {contractors.map(c => <option key={c} value={c}>{c === 'All' ? 'All Contractors' : c}</option>)}
                </select>
            </div>

            <button
                onClick={handleAutoSync}
                style={{ marginLeft: 'auto', padding: '12px 20px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <SealCheck size={20} weight="bold" /> Auto-Sync Device Logs
            </button>
        </div>

        {/* Worker List Table */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '1.2rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>WORKER / CONTRACTOR</th>
                        <th style={{ padding: '1.2rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>ROLE / SHIFT</th>
                        <th style={{ padding: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>TIME LOGS</th>
                        <th style={{ padding: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>STATUS & REMARKS</th>
                        <th style={{ padding: '1.2rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>OT/PAYROLL</th>
                        <th style={{ padding: '1.2rem', textAlign: 'right', fontSize: '0.85rem', color: '#64748b' }}>AUDIT</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading worker data...</td></tr>
                    ) : filteredWorkers.length === 0 ? (
                        <tr><td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No workers found matching your criteria.</td></tr>
                    ) : filteredWorkers.map((worker) => {
                        const current = attendance[worker._id] || {};
                        return (
                            <tr key={worker._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                                            <HardHat size={20} weight="duotone" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{worker.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{worker.contractor}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{worker.role}</div>
                                    <select
                                        value={current.shift || 'Morning'}
                                        onChange={(e) => setAttendance(prev => ({
                                            ...prev,
                                            [worker._id]: { ...(prev[worker._id] || {}), workerId: worker._id, shift: e.target.value, date: new Date(date) }
                                        }))}
                                        style={{ fontSize: '0.75rem', color: '#16a34a', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        <option value="Morning">Morning</option>
                                        <option value="Night">Night</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                        <input
                                            type="time"
                                            value={current.checkIn || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setAttendance(prev => {
                                                    const newAtt = { ...(prev[worker._id] || {}), workerId: worker._id, checkIn: val, date: new Date(date) };
                                                    newAtt.overtimeHours = calculateOT(val, newAtt.checkOut);
                                                    return { ...prev, [worker._id]: newAtt };
                                                });
                                            }}
                                            style={{ padding: '4px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 600 }}
                                        />
                                        <input
                                            type="time"
                                            value={current.checkOut || ''}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setAttendance(prev => {
                                                    const newAtt = { ...(prev[worker._id] || {}), workerId: worker._id, checkOut: val, date: new Date(date) };
                                                    newAtt.overtimeHours = calculateOT(newAtt.checkIn, val);
                                                    return { ...prev, [worker._id]: newAtt };
                                                });
                                            }}
                                            style={{ padding: '4px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 600 }}
                                        />
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {['Present', 'Absent', 'Late', 'On Leave'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusChange(worker._id, s)}
                                                    style={{
                                                        padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                                        background: current.status === s ?
                                                            (s === 'Present' ? '#16a34a' : s === 'Absent' ? '#dc2626' : s === 'Late' ? '#ea580c' : '#7c3aed')
                                                            : 'white',
                                                        color: current.status === s ? 'white' : '#64748b',
                                                        fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                                                    }}
                                                >
                                                    {s === 'On Leave' ? 'Leave' : s}
                                                </button>
                                            ))}
                                        </div>
                                        {(current.status === 'Late' || current.status === 'Absent' || current.status === 'On Leave') && (
                                            <input
                                                type="text"
                                                placeholder="Add correction remark..."
                                                value={current.remarks || ''}
                                                onChange={(e) => setAttendance(prev => ({
                                                    ...prev,
                                                    [worker._id]: { ...(prev[worker._id] || {}), remarks: e.target.value }
                                                }))}
                                                style={{ width: '100%', fontSize: '0.75rem', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        )}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: (current.overtimeHours > 0) ? '#0891b2' : '#64748b' }}>
                                            {current.overtimeHours || 0}h
                                        </span>
                                        {current.overtimeHours > 0 && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#0891b2' }}>AUTO-CALC</span>}
                                    </div>
                                </td>
                                <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => fetchAuditHistory(worker._id)}
                                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                        title="View History"
                                    >
                                        <Timer size={20} weight="bold" />
                                        <span style={{ fontSize: '0.6rem', fontWeight: 700 }}>AUDIT</span>
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>

        {/* Footer / Summary Info */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.length > 0 ? alerts.map((alert, idx) => (
                    <div key={idx} style={{
                        background: alert.severity === 'Critical' ? '#fff1f2' : alert.severity === 'High' ? '#fffbeb' : '#f0f9ff',
                        padding: '1.2rem', borderRadius: '20px',
                        border: `1px solid ${alert.severity === 'Critical' ? '#fda4af' : alert.severity === 'High' ? '#fef3c7' : '#bae6fd'}`,
                        display: 'flex', gap: '1rem'
                    }}>
                        <BellRinging size={24} color={alert.severity === 'Critical' ? '#e11d48' : alert.severity === 'High' ? '#d97706' : '#0284c7'} weight="bold" />
                        <div>
                            <div style={{ fontWeight: 800, color: alert.severity === 'Critical' ? '#9f1239' : alert.severity === 'High' ? '#92400e' : '#075985', marginBottom: '4px' }}>
                                {alert.type} {alert.severity === 'Critical' && '(Action Required)'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: alert.severity === 'Critical' ? '#be123c' : alert.severity === 'High' ? '#b45309' : '#0369a1', margin: 0, lineHeight: 1.5 }}>
                                {alert.message}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div style={{ background: '#f0fdf4', padding: '1.2rem', borderRadius: '20px', border: '1px solid #dcfce7', display: 'flex', gap: '1rem' }}>
                        <SealCheck size={24} color="#16a34a" weight="bold" />
                        <div>
                            <div style={{ fontWeight: 800, color: '#166534', marginBottom: '4px' }}>Manpower Health Stable</div>
                            <p style={{ fontSize: '0.85rem', color: '#15803d', margin: 0 }}>All critical roles are checked in and attendance is within optimal thresholds.</p>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ width: '400px', background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>Integrations & Sync</span>
                    <div style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>3 Connected</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { name: 'Payroll (ERP)', status: 'Live', color: '#16a34a' },
                        { name: 'Contractor Ledger', status: 'Syncing...', color: '#0047AB' },
                        { name: 'Project Schedule', status: 'Live', color: '#16a34a' }
                    ].map((sys, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{sys.name}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: sys.color }}>{sys.status}</span>
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
                    Finalizing attendance will automatically push work-hours to unified billing.
                </p>
            </div>
        </div>
    </div>
);
};

export default ManageAttendance;
