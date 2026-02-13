import React, { useState, useEffect } from 'react';
import { Buildings, Calendar, ChartPieSlice, Info, ArrowRight, Cube } from '@phosphor-icons/react';
import { leadService, visitService } from '../services/api';
import socketService from '../services/socket';

const LeadsAnalytics = () => {
    const [hoveredType, setHoveredType] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [leads, setLeads] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [leadsRes, visitsRes] = await Promise.all([
                    leadService.getAll(),
                    visitService.getAll()
                ]);
                setLeads(leadsRes.data || []);
                setVisits(visitsRes.data || []);
            } catch (error) {
                console.error("Analytics Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        socketService.on('lead-added', (newLead) => {
            setLeads(prev => [newLead, ...prev]);
        });

        socketService.on('lead-updated', (updatedLead) => {
            setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
        });

        socketService.on('visit-scheduled', (newVisit) => {
            setVisits(prev => [...prev, newVisit]);
        });

        return () => {
            socketService.off('lead-added');
            socketService.off('lead-updated');
            socketService.off('visit-scheduled');
        };
    }, []);

    const getStatusData = (status) => {
        const filteredLeads = leads.filter(l => l.status === status);
        const leadIds = filteredLeads.map(l => l._id);
        const statusVisits = visits.filter(v => leadIds.includes(v.lead?._id || v.lead));

        return {
            count: filteredLeads.length,
            visits: statusVisits.length,
            projects: [...new Set(filteredLeads.map(l => l.projectInterest).filter(Boolean))]
        };
    };

    const analyticsData = {
        Hot: {
            ...getStatusData('Hot'),
            color: '#ff6b6b',
            inventory: { soldPercent: 88, available: 12 }
        },
        Warm: {
            ...getStatusData('Warm'),
            color: '#ff9f4d',
            inventory: { soldPercent: 45, available: 55 }
        },
        Cold: {
            ...getStatusData('Cold'),
            color: '#4d9fff',
            inventory: { soldPercent: 12, available: 88 }
        }
    };

    const hasLeads = leads.length > 0;
    const chartData = [
        { type: 'Hot', value: analyticsData.Hot.count || (hasLeads ? 0 : 3), color: '#ff6b6b' },
        { type: 'Warm', value: analyticsData.Warm.count || (hasLeads ? 0 : 5), color: '#ff9f4d' },
        { type: 'Cold', value: analyticsData.Cold.count || (hasLeads ? 0 : 2), color: '#4d9fff' },
    ];

    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const size = 320;
    const radius = 120;
    const strokeWidth = 60;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedAngle = -90;

    if (loading) return <div style={{ padding: '2rem' }}>Loading Analytics...</div>;

    return (
        <div
            style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}
            onDoubleClick={() => setSelectedType(null)}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Leads Overview</h1>
                <p style={{ color: 'var(--charcoal)', fontSize: '0.9rem', marginTop: '5px' }}>
                    Visual distribution of lead statuses and their impact on operational metrics.
                </p>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch' }}>
                    <div className="card" style={{
                        flex: '0 0 420px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ flexShrink: 0, textAlign: 'center', transition: 'var(--transition)', zIndex: 1, width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Lead Status Distribution</h2>
                                {!hasLeads && (
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--pivot-blue)', background: 'var(--pivot-blue-soft)', padding: '4px 10px', borderRadius: '12px' }}>DEMO DATA</span>
                                )}
                            </div>
                            <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
                                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                                    {chartData.map((item, index) => {
                                        const percentage = total === 0 ? 0 : (item.value / total) * 100;
                                        const dashoffset = circumference - (percentage / 100) * circumference;
                                        const rotation = accumulatedAngle;
                                        accumulatedAngle += (percentage / 100) * 360;

                                        const isHovered = hoveredType === item.type;
                                        const isSelected = selectedType === item.type;

                                        return (
                                            <circle
                                                key={index}
                                                cx={center}
                                                cy={center}
                                                r={radius}
                                                fill="transparent"
                                                stroke={item.color}
                                                strokeWidth={isSelected ? strokeWidth + 12 : (isHovered ? strokeWidth + 8 : strokeWidth)}
                                                strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                                                transform={`rotate(${rotation} ${center} ${center})`}
                                                style={{
                                                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                                                    cursor: 'pointer',
                                                    filter: isSelected || isHovered ? `drop-shadow(0 0 10px ${item.color}cc)` : 'none',
                                                    opacity: selectedType !== null && !isSelected ? 0.3 : 1
                                                }}
                                                onMouseEnter={() => setHoveredType(item.type)}
                                                onMouseLeave={() => setHoveredType(null)}
                                                onClick={() => setSelectedType(selectedType === item.type ? null : item.type)}
                                            />
                                        );
                                    })}
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--soft-black)' }}>{total}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '2px' }}>Total</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '2.5rem' }}>
                                {chartData.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        opacity: (hoveredType === null && selectedType === null) || hoveredType === item.type || selectedType === item.type ? 1 : 0.4,
                                        color: selectedType === item.type || hoveredType === item.type ? item.color : 'inherit',
                                    }}
                                        onMouseEnter={() => setHoveredType(item.type)}
                                        onMouseLeave={() => setHoveredType(null)}
                                        onClick={() => setSelectedType(selectedType === item.type ? null : item.type)}
                                    >
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: item.color }}></div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{
                        flex: 1,
                        opacity: hoveredType || selectedType ? 1 : 0.4,
                        padding: '2.5rem',
                        transition: 'all 0.4s ease',
                        border: (hoveredType || selectedType) ? `1px solid ${analyticsData[hoveredType || selectedType].color}40` : '1px solid var(--glass-border)',
                    }}>
                        {(hoveredType || selectedType) ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: analyticsData[hoveredType || selectedType].color }}></div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{(hoveredType || selectedType)} Lead Impact</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color, marginBottom: '12px' }}>
                                                <Buildings size={22} weight="bold" />
                                                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Interests</h4>
                                            </div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--charcoal)', paddingLeft: '8px' }}>
                                                {analyticsData[hoveredType || selectedType].projects.length > 0 ?
                                                    analyticsData[hoveredType || selectedType].projects.join(', ') :
                                                    'General inquiry'}
                                            </div>
                                        </section>

                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color, marginBottom: '12px' }}>
                                                <Calendar size={22} weight="bold" />
                                                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Visits</h4>
                                            </div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: analyticsData[hoveredType || selectedType].color, paddingLeft: '8px' }}>
                                                {analyticsData[hoveredType || selectedType].visits}
                                            </div>
                                        </section>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                        <section>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: analyticsData[hoveredType || selectedType].color, marginBottom: '12px' }}>
                                                <ChartPieSlice size={22} weight="bold" />
                                                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Conversion Progress</h4>
                                            </div>
                                            <div style={{ paddingLeft: '8px' }}>
                                                <div style={{ height: '10px', background: 'var(--light-grey)', borderRadius: '5px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${analyticsData[hoveredType || selectedType].inventory.soldPercent}%`, background: analyticsData[hoveredType || selectedType].color }}></div>
                                                </div>
                                            </div>
                                        </section>

                                        <section style={{ background: 'var(--pivot-blue-soft)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--pivot-blue)', marginBottom: '8px' }}>Strategy Tip</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--charcoal)', lineHeight: '1.4' }}>
                                                {(hoveredType || selectedType) === 'Hot' ? 'Immediately assign high-priority sales executives for site closing.' :
                                                    (hoveredType || selectedType) === 'Warm' ? 'Send follow-up catalogs and invite for weekend project walkthroughs.' :
                                                        'Add to monthly newsletter for long-term brand awareness.'}
                                            </p>
                                        </section>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                                <Info size={48} weight="duotone" color="var(--pivot-blue)" />
                                <h3 style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 600 }}>Interactive Analytics</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--charcoal)' }}>Hover over the chart segments to reveal contextual insights</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Leads Management</h2>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--charcoal)', opacity: 0.7 }}>
                                <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Lead Name</th>
                                <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Project Interest</th>
                                <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Status</th>
                                <th style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 700 }}>Last Activity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.slice(0, 10).map((lead, i) => (
                                <tr key={i} className="table-row" style={{ fontSize: '0.95rem', background: 'rgba(255, 255, 255, 0.5)' }}>
                                    <td style={{ padding: '1.2rem 0.8rem', fontWeight: 600 }}>{lead.name}</td>
                                    <td style={{ padding: '1.2rem 0.8rem' }}>{lead.projectInterest || 'General Inquiry'}</td>
                                    <td style={{ padding: '1.2rem 0.8rem' }}>
                                        <span style={{
                                            padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                            background: lead.status === 'Hot' ? '#ffebeb' : (lead.status === 'Warm' ? '#fff4eb' : '#ebf4ff'),
                                            color: lead.status === 'Hot' ? '#ff4d4d' : (lead.status === 'Warm' ? '#ff9f4d' : '#4d9fff'),
                                        }}>
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.2rem 0.8rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3D Shapes (Decorative CSS) */}
            <div className="bg-decoration shape-1" style={{ bottom: '10%', left: '5%' }}></div>
            <div className="bg-decoration shape-2" style={{ top: '10%', right: '10%', transform: 'rotate(20deg)', background: 'linear-gradient(white, var(--pivot-blue-soft))' }}></div>
        </div>
    );
};

export default LeadsAnalytics;
