import React from 'react';

const BuilderDashboard = () => {
    const projects = [
        { name: 'Skyline Towers', budget: '$2.4M', spent: '$1.1M', progress: 45 },
        { name: 'Green Valley', budget: '$1.8M', spent: '$0.4M', progress: 20 },
        { name: 'Ocean View', budget: '$5.0M', spent: '$4.8M', progress: 95 },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '2rem', fontWeight: 800 }}>Builder Project Portfolio</h2>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {projects.map((p, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{p.name}</h3>
                            <div style={{ fontWeight: 700, color: 'var(--pivot-blue)' }}>{p.progress}% Complete</div>
                        </div>

                        <div style={{ height: '10px', background: 'var(--light-grey)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                            <div style={{ width: `${p.progress}%`, height: '100%', background: 'var(--pivot-blue)' }}></div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--pivot-blue-soft)', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--charcoal)', opacity: 0.7 }}>Allocated Budget</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{p.budget}</div>
                            </div>
                            <div style={{ padding: '1rem', background: '#e6f4ea', borderRadius: '12px' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--charcoal)', opacity: 0.7 }}>Actual Expenses</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e7e34' }}>{p.spent}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuilderDashboard;
