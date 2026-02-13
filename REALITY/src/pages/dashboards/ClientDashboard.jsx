import React from 'react';

const ClientDashboard = () => {
    const milestones = [
        { title: 'Foundation', status: 'Completed', date: 'Jan 15, 2026' },
        { title: 'Ground Floor Slab', status: 'Completed', date: 'Feb 02, 2026' },
        { title: 'First Floor Brickwork', status: 'In Progress', date: 'Estimated Mar 10' },
        { title: 'Final Finishing', status: 'Upcoming', date: 'Estimated Dec 2026' },
    ];

    const payments = [
        { id: 'INV-102', date: 'Feb 05, 2026', amount: '$45,000', status: 'Paid' },
        { id: 'INV-103', date: 'Feb 20, 2026', amount: '$12,500', status: 'Due' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 800 }}>Welcome Back, Valued Client</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Project Construction Progress</h3>
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {milestones.map((m, i) => (
                            <div key={i} style={{ position: 'relative', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
                                <div style={{
                                    position: 'absolute', left: '-2.15rem', top: '0', bottom: i === milestones.length - 1 ? 'auto' : '-1.5rem',
                                    width: '2px', background: 'var(--glass-border)', zIndex: 0
                                }}></div>
                                <div style={{
                                    position: 'absolute', left: '-2.5rem', top: '0', width: '12px', height: '12px',
                                    borderRadius: '50%', background: m.status === 'Completed' ? '#4CAF50' : m.status === 'In Progress' ? 'var(--pivot-blue)' : 'var(--glass-border)',
                                    border: '3px solid white', zIndex: 1
                                }}></div>
                                <div style={{ fontWeight: 600 }}>{m.title}</div>
                                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{m.status} • {m.date}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>My Financials</h3>
                    {payments.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: p.status === 'Due' ? 'rgba(255, 159, 77, 0.05)' : 'rgba(0, 71, 171, 0.02)', borderRadius: '12px', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ fontWeight: 700 }}>{p.amount}</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{p.id} • {p.date}</div>
                            </div>
                            <button style={{
                                padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 700,
                                background: p.status === 'Due' ? '#ff9f4d' : 'var(--pivot-blue-soft)',
                                color: p.status === 'Due' ? 'white' : 'var(--pivot-blue)',
                                cursor: 'pointer'
                            }}>{p.status === 'Due' ? 'Pay Now' : 'Receipt'}</button>
                        </div>
                    ))}
                    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--pivot-blue)', fontWeight: 600, cursor: 'pointer' }}>Download Document Vault (.zip)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
