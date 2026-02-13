import React from 'react';

const AdminDashboard = () => {
    const stats = [
        { label: 'Total Users', value: '124', color: 'var(--pivot-blue)' },
        { label: 'Active Projects', value: '12', color: '#4CAF50' },
        { label: 'System Health', value: '99.9%', color: '#ff9f4d' },
    ];

    const users = [
        { name: 'John Doe', role: 'Builder', status: 'Active' },
        { name: 'Alice Smith', role: 'Civil Engineer', status: 'Active' },
        { name: 'Bob Wilson', role: 'Client', status: 'Pending' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 800 }}>Admin Oversight</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--charcoal)', opacity: 0.7 }}>{s.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>User Management</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{u.name}</td>
                                <td style={{ padding: '1rem' }}>{u.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                        background: u.status === 'Active' ? '#e6f4ea' : '#fff4e5',
                                        color: u.status === 'Active' ? '#1e7e34' : '#b27b16'
                                    }}>{u.status}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
