import React from 'react';

const ProjectSiteDashboard = () => {
    const attendance = [
        { shift: 'Morning (8AM-4PM)', present: 42, absent: 3 },
        { shift: 'Evening (4PM-12AM)', present: 18, absent: 2 },
    ];

    const expenses = [
        { date: '2026-02-12', category: 'Petty Cash', amount: '$45.00', desc: 'Light Bulbs for Site Office' },
        { date: '2026-02-11', category: 'Transport', amount: '$120.00', desc: 'Emergency Diesel for Generator' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 800 }}>Site Management Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Labor Attendance</h3>
                    {attendance.map((a, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontWeight: 600 }}>{a.shift}</span>
                                <span style={{ fontSize: '0.8rem' }}>{a.present} Present / {a.absent} Absent</span>
                            </div>
                            <div style={{ height: '8px', background: '#ffebeb', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                                <div style={{ width: `${(a.present / (a.present + a.absent)) * 100}%`, background: '#4CAF50' }}></div>
                            </div>
                        </div>
                    ))}
                    <button style={{ width: '100%', padding: '12px', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Open Attendance Tool</button>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Local Site Expenses</h3>
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', opacity: 0.6 }}>
                                <th style={{ padding: '8px' }}>Category</th>
                                <th style={{ padding: '8px' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((e, i) => (
                                <tr key={i}>
                                    <td style={{ padding: '8px' }}>
                                        <div style={{ fontWeight: 600 }}>{e.category}</div>
                                        <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>{e.desc}</div>
                                    </td>
                                    <td style={{ padding: '8px', fontWeight: 700 }}>{e.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button style={{ marginTop: '1rem', width: '100%', padding: '12px', background: 'var(--pivot-blue)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>+ Log Expense</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectSiteDashboard;
