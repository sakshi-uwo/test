import React from 'react';

const CivilEngineerDashboard = () => {
    const dailyTasks = [
        { task: 'Foundation Pouring - Sector B', status: 'In Progress', priority: 'High' },
        { task: 'Structural Inspection - Floor 4', status: 'Completed', priority: 'Critical' },
        { task: 'Slab Curing Monitor', status: 'Pending', priority: 'Medium' },
    ];

    const materials = [
        { item: 'Cement (Grade 53)', qty: '500 Bags', status: 'Arrived' },
        { item: 'Steel Rods (12mm)', qty: '2 Tons', status: 'Requested' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 800 }}>Civil Engineer Operations</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Daily Progress Report (DPR)</h3>
                    {dailyTasks.map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontWeight: 600 }}>{t.task}</div>
                                <div style={{ fontSize: '0.75rem', color: t.priority === 'Critical' ? '#ff4d4d' : 'var(--charcoal)' }}>{t.priority} Priority</div>
                            </div>
                            <span style={{
                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
                                background: t.status === 'Completed' ? '#e6f4ea' : '#ebf4ff',
                                color: t.status === 'Completed' ? '#1e7e34' : 'var(--pivot-blue)'
                            }}>{t.status}</span>
                        </div>
                    ))}
                    <button style={{
                        marginTop: '1.5rem', width: '100%', padding: '12px', background: 'var(--pivot-blue)',
                        color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700
                    }}>+ New Log Entry</button>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Material Logistics</h3>
                    {materials.map((m, i) => (
                        <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ fontWeight: 600 }}>{m.item}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '4px' }}>
                                <span>{m.qty}</span>
                                <span style={{ color: 'var(--pivot-blue)', fontWeight: 700 }}>{m.status}</span>
                            </div>
                        </div>
                    ))}
                    <button style={{
                        width: '100%', padding: '10px', background: 'transparent',
                        color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                        borderRadius: '12px', fontWeight: 600
                    }}>Request Material</button>
                </div>
            </div>
        </div>
    );
};

export default CivilEngineerDashboard;
