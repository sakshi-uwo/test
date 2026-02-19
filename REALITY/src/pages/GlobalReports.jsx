import React, { useState } from 'react';
import {
    FilePdf, FileXls, ArrowsClockwise,
    CalendarBlank, CaretDown, Funnel,
    ChartBar, ChartLineUp, FileText,
    DownloadSimple, CheckCircle, Clock,
    Buildings, UsersThree, CurrencyDollar,
    Lightning, WarningCircle, ChartPie,
    Brain, TrendUp, ShieldCheck, HardHat,
    Storefront, Truck, Handshake, Receipt,
    Bank, Wallet, UserCircle, Desktop, Pulse
} from '@phosphor-icons/react';

const GlobalReports = ({ setCurrentPage }) => {
    const [dateRange, setDateRange] = useState('This Month');
    const [projectFilter, setProjectFilter] = useState('All Projects');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeTab, setActiveTab] = useState('Overview');

    const tabs = [
        'Overview', 'Cost & Budget', 'Automation',
        'AI Insights', 'Quality & Safety', 'Vendors',
        'Finance', 'Users & System'
    ];

    const dateOptions = ['Today', 'Weekly', 'Monthly', 'Custom'];
    const projectOptions = ['All Projects', 'Downtown Heights', 'Green Valley Estate', 'Skyline Towers'];

    const toggleDropdown = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <div style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>

            {/* Navigation Back */}
            <button
                onClick={() => setCurrentPage('dashboard')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
                    color: 'var(--pivot-blue)', fontWeight: 800, cursor: 'pointer', marginBottom: '1.5rem',
                    fontSize: '0.9rem', padding: 0
                }}
            >
                <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><CaretDown size={18} weight="bold" /></div>
                Back to Dashboard
            </button>

            {/* 🔹 1. Top Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '3rem',
                background: 'white',
                padding: '2rem',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f0f4f8'
            }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000000', margin: 0, letterSpacing: '-1px' }}>Global Reports</h1>
                    <p style={{ color: '#7a7a7a', fontSize: '0.95rem', marginTop: '4px', fontWeight: 600 }}>Enterprise site performance analytics</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    {/* Date Range Picker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginLeft: '4px', letterSpacing: '0.5px' }}>DATE RANGE</label>
                        <div
                            onClick={() => toggleDropdown('date')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px',
                                background: '#f8fafc', borderRadius: '14px', border: activeDropdown === 'date' ? '1.5px solid var(--pivot-blue)' : '1.5px solid #edf2f7',
                                cursor: 'pointer', minWidth: '160px', transition: 'all 0.2s'
                            }}
                        >
                            <CalendarBlank size={20} color="var(--pivot-blue)" weight="bold" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a202c' }}>{dateRange}</span>
                            <CaretDown size={14} weight="bold" style={{ marginLeft: 'auto', transform: activeDropdown === 'date' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>

                        {activeDropdown === 'date' && (
                            <div style={{ position: 'absolute', top: '75px', left: 0, right: 0, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                                {dateOptions.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => { setDateRange(opt); setActiveDropdown(null); }}
                                        style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: dateRange === opt ? '#f0f7ff' : 'transparent', color: dateRange === opt ? 'var(--pivot-blue)' : '#4a5568' }}
                                        onMouseOver={(e) => { if (dateRange !== opt) e.currentTarget.style.background = '#f8fafc' }}
                                        onMouseOut={(e) => { if (dateRange !== opt) e.currentTarget.style.background = 'transparent' }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Project Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginLeft: '4px', letterSpacing: '0.5px' }}>PROJECT SELECTION</label>
                        <div
                            onClick={() => toggleDropdown('project')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px',
                                background: '#f8fafc', borderRadius: '14px', border: activeDropdown === 'project' ? '1.5px solid var(--pivot-blue)' : '1.5px solid #edf2f7',
                                cursor: 'pointer', minWidth: '180px', transition: 'all 0.2s'
                            }}
                        >
                            <Funnel size={20} color="var(--pivot-blue)" weight="bold" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a202c' }}>{projectFilter}</span>
                            <CaretDown size={14} weight="bold" style={{ marginLeft: 'auto', transform: activeDropdown === 'project' ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                        </div>

                        {activeDropdown === 'project' && (
                            <div style={{ position: 'absolute', top: '75px', left: 0, right: 0, background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden' }}>
                                {projectOptions.map(opt => (
                                    <div
                                        key={opt}
                                        onClick={() => { setProjectFilter(opt); setActiveDropdown(null); }}
                                        style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: '0.2s', background: projectFilter === opt ? '#f0f7ff' : 'transparent', color: projectFilter === opt ? 'var(--pivot-blue)' : '#4a5568' }}
                                        onMouseOver={(e) => { if (projectFilter !== opt) e.currentTarget.style.background = '#f8fafc' }}
                                        onMouseOut={(e) => { if (projectFilter !== opt) e.currentTarget.style.background = 'transparent' }}
                                    >
                                        {opt}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Export Options */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#7a7a7a', marginLeft: '4px' }}>EXPORT</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                                background: '#fff5f5', color: '#c53030', border: '1.5px solid #feb2b2',
                                borderRadius: '14px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer'
                            }}>
                                <FilePdf size={22} weight="bold" /> PDF
                            </button>
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                                background: '#f0fff4', color: '#22543d', border: '1.5px solid #c6f6d5',
                                borderRadius: '14px', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer'
                            }}>
                                <FileXls size={22} weight="bold" /> Excel
                            </button>
                        </div>
                    </div>

                    {/* Refresh Icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px' }}>SYNC</label>
                        <button style={{
                            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'var(--pivot-blue)', color: 'white', border: 'none',
                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: '0 8px 20px rgba(0, 71, 171, 0.2)'
                        }} title="Sync Global Data" onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(180deg) scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                            <ArrowsClockwise size={24} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 🔹 2. Summary Cards (Top Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.2rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Total Projects', value: '42', detail: 'Across all regions', icon: <Buildings size={26} />, color: 'var(--pivot-blue)' },
                    { label: 'Active / Delayed', value: '38 / 4', detail: '90.4% On-track', icon: <Clock size={26} />, color: '#4CAF50' },
                    { label: 'Budget vs Spend', value: '$12M / $8.4M', detail: '70% Utilization', icon: <CurrencyDollar size={26} />, color: '#F59E0B' },
                    { label: 'Automation Savings', value: '1,420 hrs', detail: '+$142k Saved', icon: <Lightning size={26} weight="fill" />, color: '#7C3AED' },
                    { label: 'High-Risk Alerts', value: '2', detail: 'Immediate action', icon: <WarningCircle size={26} weight="bold" />, color: '#e53e3e' }
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="summary-card"
                        style={{
                            padding: '1.2rem', background: 'white', borderRadius: '22px',
                            border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 71, 171, 0.1)';
                            e.currentTarget.style.borderColor = 'var(--pivot-blue-soft)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'none';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                            e.currentTarget.style.borderColor = '#f0f0f0';
                        }}
                    >
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '12px',
                            background: `${stat.color}15`, color: stat.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.5px' }}>{stat.value}</div>
                            <div style={{ fontSize: '0.7rem', color: stat.label === 'High-Risk Alerts' ? '#e53e3e' : '#94a3b8', fontWeight: 700, marginTop: '2px' }}>{stat.detail}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 3. Main Report Tabs (Center Section) */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '2.5rem',
                padding: '6px',
                background: '#f1f5f9',
                borderRadius: '16px',
                width: 'fit-content',
                border: '1px solid #e2e8f0'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: activeTab === tab ? 'white' : 'transparent',
                            color: activeTab === tab ? 'var(--pivot-blue)' : '#64748b',
                            boxShadow: activeTab === tab ? '0 4px 12px rgba(0, 71, 171, 0.08)' : 'none',
                            transform: activeTab === tab ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseOver={(e) => {
                            if (activeTab !== tab) {
                                e.currentTarget.style.color = 'var(--pivot-blue)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeTab !== tab) {
                                e.currentTarget.style.color = '#64748b';
                            }
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {/* Tab Content */}
            {activeTab === 'Overview' ? (
                <>
                    {/* 🔹 4. Tab-wise Layout - Overview Tab */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* Project Status Bar Chart */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Project Status Portfolio</h3>
                                <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Regional Breakdown • 2026</div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: '40px', display: 'flex', alignItems: 'flex-end', gap: '20px', justifyContent: 'center' }}>
                                    {[60, 85, 45, 95, 70].map((h, i) => (
                                        <div key={i} style={{ width: '40px', height: `${h}%`, background: i === 3 ? 'var(--pivot-blue)' : '#cbd5e1', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                                            <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{h}%</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 'auto', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                    <ChartBar size={32} opacity={0.3} weight="bold" />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px' }}>Project Status Bar Chart</span>
                                </div>
                            </div>
                        </div>

                        {/* On-time vs Delayed Pie Chart */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>On-time vs Delayed</h3>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative' }}>
                                <div style={{
                                    width: '180px', height: '180px', borderRadius: '50%',
                                    background: 'conic-gradient(var(--pivot-blue) 0% 85%, #fee2e2 85% 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <div style={{ width: '130px', height: '130px', background: '#f8fafc', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--pivot-blue)' }}>85%</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>On Time</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--pivot-blue)' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>On-Time</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#fee2e2' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Delayed</span>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                    <ChartPie size={24} opacity={0.3} weight="bold" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Comparison Table */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Progress Comparison Table</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Generate Full Audit</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Project Title', 'Category', 'Status', 'Efficiency', 'Timeline'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { title: 'Downtown Heights', cat: 'Residential', status: 'On Track', eff: '94%', time: '82% Done' },
                                    { title: 'Green Valley Estate', cat: 'Luxury Villa', status: 'Accelerated', eff: '98%', time: '45% Done' },
                                    { title: 'Skyline Towers', cat: 'Commercial', status: 'Critical', eff: '62%', time: '12% Done' }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '16px', fontWeight: 800, color: '#1a1a1a' }}>{row.title}</td>
                                        <td style={{ padding: '16px', fontWeight: 600, color: '#4a5568', fontSize: '0.9rem' }}>{row.cat}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                                background: row.status === 'Critical' ? '#fee2e2' : '#e6f4ea',
                                                color: row.status === 'Critical' ? '#dc2626' : '#1e7e34'
                                            }}>{row.status}</span>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 700, color: 'var(--pivot-blue)' }}>{row.eff}</td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ width: '100px', height: '6px', background: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: row.time.split('%')[0] + '%', height: '100%', background: 'var(--pivot-blue)' }}></div>
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: '#7a7a7a', marginTop: '4px', fontWeight: 600 }}>{row.time}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'Cost & Budget' ? (
                <>
                    {/* 🔹 Cost & Budget Tab Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 1. Budget vs actual line chart */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Budget vs Actual Spend</h3>
                                <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Monthly Cumulative • FY 2026</div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', position: 'relative', overflow: 'hidden' }}>
                                {/* SVG Line Chart Placeholder */}
                                <svg width="100%" height="100%" viewBox="0 0 800 300" style={{ padding: '20px' }}>
                                    {/* Grid Lines */}
                                    {[0, 1, 2, 3].map(i => <line key={i} x1="0" y1={75 * i} x2="800" y2={75 * i} stroke="#edf2f7" strokeWidth="1" />)}
                                    {/* Budget Line (Dashed) */}
                                    <path d="M0,250 L100,220 L200,200 L300,150 L400,120 L500,100 L600,70 L800,30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                                    {/* Actual Line (Primary Blue) */}
                                    <path d="M0,250 L100,230 L200,215 L300,180 L400,150 L500,110 L600,90" fill="none" stroke="var(--pivot-blue)" strokeWidth="4" />
                                    {/* Current Point */}
                                    <circle cx="600" cy="90" r="6" fill="var(--pivot-blue)" />
                                </svg>
                                <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '12px', height: '2px', background: '#94a3b8', borderStyle: 'dashed' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Planned Budget</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '12px', height: '4px', background: 'var(--pivot-blue)' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Actual Spend</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Cost overrun project list */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.5rem' }}>Top Cost Overruns</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { project: 'Skyline Towers', overrun: '+$240k', pct: '12%', severity: 'High' },
                                    { project: 'Marina Hub', overrun: '+$85k', pct: '4.2%', severity: 'Medium' },
                                    { project: 'East Gate Villa', overrun: '+$12k', pct: '0.8%', severity: 'Low' }
                                ].map((item, i) => (
                                    <div key={i} style={{ padding: '1rem', background: '#fff5f5', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '0.9rem' }}>{item.project}</span>
                                            <span style={{ fontWeight: 900, color: '#dc2626', fontSize: '0.9rem' }}>{item.overrun}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Over budget by {item.pct}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>{item.severity} Risk</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. BOQ planned vs used table */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>BOQ Analysis: Planned vs Used</h3>
                            <button style={{ background: 'var(--pivot-blue-soft)', border: 'none', color: 'var(--pivot-blue)', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>Export BOQ</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Material Item', 'Unit', 'Planned Qty', 'Used Qty', 'Variance', 'Cost Impact'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { item: 'Structural Steel', unit: 'Tons', planned: '450', used: '462', var: '+12', cost: '$18,400' },
                                    { item: 'Ready-Mix Concrete', unit: 'm³', planned: '2,200', used: '2,150', var: '-50', cost: '-$4,500' },
                                    { item: 'Cement Bags', unit: 'Bags', planned: '12,000', used: '13,200', var: '+1,200', cost: '$7,200' },
                                    { item: 'Electrical Cabling', unit: 'Meters', planned: '8,500', used: '9,100', var: '+600', cost: '$2,100' }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '16px', fontWeight: 800, color: '#1a1a1a' }}>{row.item}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.unit}</td>
                                        <td style={{ padding: '16px', fontWeight: 700 }}>{row.planned}</td>
                                        <td style={{ padding: '16px', fontWeight: 700 }}>{row.used}</td>
                                        <td style={{ padding: '16px', fontWeight: 800, color: row.var.startsWith('+') ? '#dc2626' : '#16a34a' }}>{row.var}</td>
                                        <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.cost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'Automation' ? (
                <>
                    {/* 🔹 Automation Tab Layout */}
                    {/* 1. Automation execution count (Highlights) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'Total AI Executions', value: '12,842', detail: 'Last 30 days', color: 'var(--pivot-blue)' },
                            { label: 'Average Task Duration', value: '1.2s', detail: '-85% vs human manual', color: '#4CAF50' },
                            { label: 'System Reliability', value: '99.8%', detail: 'Zero critical leaks', color: '#7C3AED' }
                        ].map((stat, i) => (
                            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</span>
                                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: stat.color }}>{stat.detail}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 2. Time saved graph */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Efficiency: Time Saved (Cumulative)</h3>
                                <div style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: 700 }}>Weekly Growth • Hours</div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                <svg width="100%" height="80%" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0 }}>
                                    <defs>
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,200 L0,180 C100,160 200,170 300,120 C400,100 500,80 600,40 C700,30 800,10 L800,200 Z" fill="url(#areaGradient)" />
                                    <path d="M0,180 C100,160 200,170 300,120 C400,100 500,80 600,40 C700,30 800,10" fill="none" stroke="#4CAF50" strokeWidth="4" />
                                </svg>
                                <div style={{ zIndex: 1, textAlign: 'center' }}>
                                    <Lightning size={48} color="#4CAF50" opacity={0.5} weight="fill" />
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', marginTop: '1rem' }}>+1,420 Hours Saved</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Projected: 2,500 hrs by year end</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Automation success vs failure chart */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Execution Integrity</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                        <span style={{ color: '#16a34a' }}>SUCCESSFUL RUNS</span>
                                        <span>99.8%</span>
                                    </div>
                                    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: '99.8%', height: '100%', background: '#16a34a' }}></div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                        <span style={{ color: '#dc2626' }}>FAILED RUNS</span>
                                        <span>0.2%</span>
                                    </div>
                                    <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ width: '0.2%', height: '100%', background: '#dc2626' }}></div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700 }}>
                                    Most failures were due to external API timeouts (resolved via retry logic).
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : activeTab === 'AI Insights' ? (
                <>
                    {/* 🔹 AI Insights Tab Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 1. Delay risk heatmap */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Delay Risk Heatmap</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Predictive bottleneck analysis across modules</p>
                                </div>
                                <Brain size={24} color="var(--pivot-blue)" weight="duotone" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                                {['Procurement', 'Foundation', 'Structural', 'Finishing', 'Safety'].map((col, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textAlign: 'center', marginBottom: '4px' }}>{col.toUpperCase()}</span>
                                        {[0, 1, 2, 3].map(row => {
                                            const risk = Math.random();
                                            const color = risk > 0.8 ? '#fee2e2' : risk > 0.5 ? '#fef3c7' : '#f0fdf4';
                                            const border = risk > 0.8 ? '#fecaca' : risk > 0.5 ? '#fde68a' : '#dcfce7';
                                            const textColor = risk > 0.8 ? '#dc2626' : risk > 0.5 ? '#d97706' : '#16a34a';
                                            return (
                                                <div key={row} style={{
                                                    height: '40px', background: color, border: `1.5px solid ${border}`,
                                                    borderRadius: '8px', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900,
                                                    color: textColor, cursor: 'pointer', transition: '0.2s'
                                                }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                                    {Math.round(risk * 100)}%
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '3px' }}></div> Stable
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '3px' }}></div> Elevated
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>
                                    <div style={{ width: '12px', height: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '3px' }}></div> Critical
                                </div>
                            </div>
                        </div>

                        {/* 2. Cost overrun predictions */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Cost Projections (AI)</h3>
                                <div style={{ background: '#f0f7ff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Confidence: 94%</div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Est. Final Cost</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>$14.2M</div>
                                    </div>
                                    <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>Variance (Predicted)</div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>+$1.2M</div>
                                    </div>
                                </div>
                                {/* Simplified Trend Chart */}
                                <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                                    {[30, 45, 40, 60, 75, 90].map((h, i) => (
                                        <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 5 ? '#fee2e2' : 'var(--pivot-blue-soft)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
                                            {i === 5 && <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)' }}><TrendUp size={16} color="#dc2626" /></div>}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>
                                    <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV (PRED)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. AI alerts list (color-coded) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Intelligent Alerts Engine</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Mark All as Processed</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {[
                                { title: 'Supply Chain Delay', msg: 'Steel shipments for Skyline Towers are lagging by 12 days. Suggesting alternative local supplier.', color: '#dc2626', bg: '#fff5f5', icon: <WarningCircle size={22} /> },
                                { title: 'Budget Optimization', msg: 'Current concrete usage is 4% below estimate. Reallocating $14k saved to finishing phase.', color: '#16a34a', bg: '#f0fdf4', icon: <CheckCircle size={22} /> },
                                { title: 'Audit Required', msg: 'Safety audit at Downtown Heights is overdue by 48h. Critical for phase 3 transition.', color: '#d97706', bg: '#fffbeb', icon: <Clock size={22} /> }
                            ].map((alert, i) => (
                                <div key={i} style={{ padding: '1.5rem', background: alert.bg, border: `1px solid ${alert.color}30`, borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: alert.color }}>
                                        {alert.icon}
                                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{alert.title}</span>
                                    </div>
                                    <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, fontWeight: 600 }}>{alert.msg}</p>
                                    <button style={{
                                        marginTop: 'auto', alignSelf: 'flex-start', padding: '6px 14px',
                                        background: 'white', border: `1px solid ${alert.color}50`,
                                        borderRadius: '8px', color: alert.color, fontSize: '0.75rem',
                                        fontWeight: 800, cursor: 'pointer'
                                    }}>
                                        Take Action
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : activeTab === 'Quality & Safety' ? (
                <>
                    {/* 🔹 Quality & Safety Tab Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'Avg QC Score', value: '92.4%', detail: 'Target: 90%+', color: '#16a34a', icon: <ShieldCheck size={24} /> },
                            { label: 'Inspections Done', value: '342', detail: 'This month', color: 'var(--pivot-blue)', icon: <CheckCircle size={24} /> },
                            { label: 'Total Man-Hours', value: '184k', detail: 'Without LTI', color: '#7C3AED', icon: <HardHat size={24} /> }
                        ].map((stat, i) => (
                            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 2. NCR open vs closed */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>NCR Resolution Tracking</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
                                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#16a34a" strokeWidth="3" strokeDasharray="82 18" strokeDashoffset="0" />
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="18 82" strokeDashoffset="-82" />
                                    </svg>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>82%</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>CLOSED</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Closed (42)</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Open (9)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Safety incident trend */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Safety Incident Trend</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: '#f0fdf4', borderRadius: '20px', color: '#16a34a', fontSize: '0.75rem', fontWeight: 800 }}>
                                    <ShieldCheck size={16} /> Zero Major LTI
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px' }}>
                                <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                                    <path d="M0,180 L100,160 L200,170 L300,140 L400,150 L500,130 L600,140 L700,110 L800,120" fill="none" stroke="#f59e0b" strokeWidth="3" />
                                    {[0, 100, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
                                        <circle key={i} cx={x} cy={[180, 160, 170, 140, 150, 130, 140, 110, 120][i]} r="4" fill="white" stroke="#f59e0b" strokeWidth="2" />
                                    ))}
                                </svg>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8' }}>
                                    {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map(m => <span key={m}>{m}</span>)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 1. QC inspection summary (Table) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Recent QC Inspection Summary</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>View All Audits</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Inspection Area', 'Project', 'Inspector', 'Score', 'Status'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { area: 'Foundation Leveling', proj: 'Downtown Heights', user: 'Engr. David', score: '98/100', status: 'Passed' },
                                    { area: 'Structural Steel Weld', proj: 'Skyline Towers', user: 'Engr. Sarah', score: '82/100', status: 'Conditional' },
                                    { area: 'Electrical Safety', proj: 'Green Valley', user: 'Engr. Mike', score: '94/100', status: 'Passed' }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '16px', fontWeight: 800 }}>{row.area}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.proj}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.user}</td>
                                        <td style={{ padding: '16px', fontWeight: 800, color: 'var(--pivot-blue)' }}>{row.score}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, background: row.status === 'Passed' ? '#e6f4ea' : '#fffbeb', color: row.status === 'Passed' ? '#16a34a' : '#d97706' }}>{row.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'Vendors' ? (
                <>
                    {/* 🔹 Vendors Tab Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'Active Vendors', value: '124', detail: 'Across 12 categories', color: 'var(--pivot-blue)', icon: <Storefront size={24} /> },
                            { label: 'On-Time Delivery', value: '88.2%', detail: '+2.4% vs last Q', color: '#16a34a', icon: <Truck size={24} /> },
                            { label: 'Avg Vendor Rating', value: '4.8/5', detail: '94% retention rate', color: '#7C3AED', icon: <Handshake size={24} /> }
                        ].map((stat, i) => (
                            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 2. Delivery delay chart */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Top Delivery Delays (by Vendor)</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                {[
                                    { vendor: 'Apex Steel Corp', days: 14, color: '#dc2626' },
                                    { vendor: 'Global Logistics', days: 9, color: '#f59e0b' },
                                    { vendor: 'Prime Cement', days: 4, color: '#16a34a' },
                                    { vendor: 'East Elec Supplies', days: 2, color: '#16a34a' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                            <span>{item.vendor}</span>
                                            <span style={{ color: item.color }}>{item.days} Days Delay</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${(item.days / 15) * 100}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Cost comparison graph */}
                        <div className="card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Quote vs Actual Cost Analysis</h3>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', padding: '20px', display: 'flex', alignItems: 'flex-end', gap: '24px', justifyContent: 'center' }}>
                                {[
                                    { cat: 'Steel', quoted: 60, actual: 80 },
                                    { cat: 'Cement', quoted: 40, actual: 35 },
                                    { cat: 'Cabling', quoted: 55, actual: 65 },
                                    { cat: 'Wood', quoted: 30, actual: 28 }
                                ].map((bar, i) => (
                                    <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100%' }}>
                                        <div style={{ width: '12px', height: `${bar.quoted}%`, background: '#cbd5e1', borderRadius: '4px 4px 0 0' }} title="Quoted"></div>
                                        <div style={{ width: '12px', height: `${bar.actual}%`, background: 'var(--pivot-blue)', borderRadius: '4px 4px 0 0' }} title="Actual"></div>
                                        <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap' }}>{bar.cat}</div>
                                    </div>
                                ))}
                                <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '1rem', fontSize: '0.65rem', fontWeight: 800 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#cbd5e1', borderRadius: '2px' }}></div> Quoted</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: 'var(--pivot-blue)', borderRadius: '2px' }}></div> Actual</div>
                                </div>
                            </div>
                            <div style={{ height: '30px' }}></div> {/* Spacer for labels */}
                        </div>
                    </div>

                    {/* 1. Vendor performance table */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Strategic Vendor Performance Portfolio</h3>
                            <button style={{ background: 'none', border: 'none', color: 'var(--pivot-blue)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>Manage Vendors</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Vendor Name', 'Category', 'Rating', 'Reliability', 'Spend (YTD)', 'Status'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.8rem', fontWeight: 700 }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: 'Apex Steel Corp', cat: 'Structural', rating: '4.8', rel: '94%', spend: '$1.2M', status: 'Active' },
                                    { name: 'Global Logistics', cat: 'Transport', rating: '3.9', rel: '72%', spend: '$420k', status: 'Warning' },
                                    { name: 'Prime Cement', cat: 'Raw Material', rating: '4.9', rel: '98%', spend: '$850k', status: 'Active' },
                                    { name: 'East Elec Supplies', cat: 'Electrical', rating: '4.5', rel: '91%', spend: '$210k', status: 'Under Review' }
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '16px', fontWeight: 800 }}>{row.name}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{row.cat}</td>
                                        <td style={{ padding: '16px', fontWeight: 800, color: '#f59e0b' }}>★ {row.rating}</td>
                                        <td style={{ padding: '16px', fontWeight: 700 }}>{row.rel}</td>
                                        <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.spend}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800,
                                                background: row.status === 'Active' ? '#e6f4ea' : row.status === 'Warning' ? '#fee2e2' : '#fffbeb',
                                                color: row.status === 'Active' ? '#16a34a' : row.status === 'Warning' ? '#dc2626' : '#d97706'
                                            }}>{row.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : activeTab === 'Finance' ? (
                <>
                    {/* 🔹 1. Invoices Paid / Pending (KPI Highlights) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                        {[
                            { label: 'Total Invoiced', value: '$22.3M', detail: 'This Fiscal Year', color: 'var(--pivot-blue)', icon: <Receipt size={24} /> },
                            { label: 'Paid Invoices', value: '$18.2M', detail: '81.6% Collections', color: '#16a34a', icon: <CheckCircle size={24} /> },
                            { label: 'Pending / Unpaid', value: '$4.1M', detail: '28 Active Bills', color: '#f59e0b', icon: <Clock size={24} /> },
                            { label: 'Overdue Alerts', value: '$1.2M', detail: 'Action Required', color: '#dc2626', icon: <WarningCircle size={24} /> }
                        ].map((stat, i) => (
                            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ width: '48px', height: '48px', background: `${stat.color}15`, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>{stat.label}</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1a1a1a' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: stat.color }}>{stat.detail}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                        {/* 🔹 2. Cash Flow Summary (Trend Chart) */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Cash Flow Trajectory</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Inflow vs Outflow Real-time Monitoring</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#16a34a' }}>+$2.42M</div>
                                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>NET POSITION THIS MONTH</div>
                                </div>
                            </div>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
                                <svg width="100%" height="100%" viewBox="0 0 800 250" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="financeArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--pivot-blue)" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="var(--pivot-blue)" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    {[0, 50, 100, 150, 200].map(y => <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" />)}
                                    {/* Cumulative Path */}
                                    <path d="M0,220 C100,200 200,210 300,160 C400,140 500,120 600,80 C700,60 800,40 L800,250 L0,250 Z" fill="url(#financeArea)" />
                                    <path d="M0,220 C100,200 200,210 300,160 C400,140 500,120 600,80 C700,60 800,40" fill="none" stroke="var(--pivot-blue)" strokeWidth="4" />
                                    {[0, 300, 600, 800].map(x => (
                                        <circle key={x} cx={x} cy={x === 0 ? 220 : x === 300 ? 160 : x === 600 ? 80 : 40} r="6" fill="white" stroke="var(--pivot-blue)" strokeWidth="3" />
                                    ))}
                                </svg>
                                <div style={{ position: 'absolute', bottom: '20px', left: '25px', display: 'flex', gap: '1.5rem' }}>
                                    {['Inflow', 'Outflow'].map(t => (
                                        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: t === 'Inflow' ? 'var(--pivot-blue)' : '#94a3b8' }}></div>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 🔹 3. Revenue vs Expense Chart (Bar Format) */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '2rem' }}>Revenue vs Expenses</h3>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
                                {[
                                    { label: 'Operating Revenue', value: '$24.8M', pct: 100, color: 'var(--pivot-blue)' },
                                    { label: 'COGS / Material', value: '$12.4M', pct: 50, color: '#94a3b8' },
                                    { label: 'Labor & Logistics', value: '$6.2M', pct: 25, color: '#cbd5e1' },
                                    { label: 'Net Operating Income', value: '$6.2M', pct: 25, color: '#16a34a' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                                            <span style={{ color: '#475569' }}>{item.label}</span>
                                            <span style={{ color: item.color === '#16a34a' ? '#16a34a' : '#1a1a1a' }}>{item.value}</span>
                                        </div>
                                        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #e0f2fe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Bank size={20} color="var(--pivot-blue)" />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>EBITDA Margin is currently at <b style={{ fontWeight: 900 }}>33.2%</b>, exceeding quarterly targets.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🔹 4. Invoices Detailed Table (Workable View) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Project Invoicing Ledger</h3>
                                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Real-time payment status across all construction clusters</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                <button style={{ padding: '10px 18px', background: '#f8fafc', border: '1px solid #edf2f7', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: '#444', cursor: 'pointer' }}>Filter by Status</button>
                                <button style={{ padding: '10px 18px', background: 'var(--pivot-blue)', border: 'none', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 800, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <DownloadSimple size={18} /> Download Ledger
                                </button>
                            </div>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Invoice Ref', 'Project', 'Issued Date', 'Due Date', 'Amount', 'Status'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#7a7a7a', fontSize: '0.75rem', fontWeight: 800 }}>{h.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { ref: 'P-INV-2026-001', proj: 'Downtown Heights', issued: '01 Feb 2026', due: '15 Feb 2026', amt: '$420,000', status: 'Paid', color: '#16a34a' },
                                    { ref: 'P-INV-2026-002', proj: 'Skyline Towers', issued: '04 Feb 2026', due: '18 Feb 2026', amt: '$1,240,000', status: 'Pending', color: '#f59e0b' },
                                    { ref: 'P-INV-2026-003', proj: 'Green Valley', issued: '10 Jan 2026', due: '24 Jan 2026', amt: '$85,000', status: 'Overdue', color: '#dc2626' },
                                    { ref: 'P-INV-2026-004', proj: 'Marina Hub', issued: '08 Feb 2026', due: '22 Feb 2026', amt: '$210,000', status: 'Pending', color: '#f59e0b' },
                                    { ref: 'P-INV-2026-005', proj: 'East Gate Villa', issued: '12 Feb 2026', due: '26 Feb 2026', amt: '$12,500', status: 'Paid', color: '#16a34a' }
                                ].map((row, i) => (
                                    <tr key={i} className="tab-item" style={{ borderBottom: '1px solid #f8f9fa' }}>
                                        <td style={{ padding: '16px', fontWeight: 800, color: 'var(--pivot-blue)' }}>{row.ref}</td>
                                        <td style={{ padding: '16px', fontWeight: 700, color: '#1a1a1a' }}>{row.proj}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.issued}</td>
                                        <td style={{ padding: '16px', color: '#64748b', fontWeight: 600 }}>{row.due}</td>
                                        <td style={{ padding: '16px', fontWeight: 900, color: '#1a1a1a' }}>{row.amt}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 900,
                                                background: `${row.color}15`, color: row.color, display: 'inline-flex', alignItems: 'center', gap: '5px',
                                                border: `1px solid ${row.color}30`
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: row.color }}></div>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>

            ) : activeTab === 'Users & System' ? (
                <>
                    {/* 🔹 Users & System Tab Layout */}


                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>

                        {/* 1. Active Users by Role */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '1.5rem' }}>Active Users by Role</h3>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                {/* Donut Chart Representation */}
                                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="5" />
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--pivot-blue)" strokeWidth="5" strokeDasharray="40 60" strokeDashoffset="0" /> {/* Admins */}
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="5" strokeDasharray="30 70" strokeDashoffset="-40" /> {/* Builders */}
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="5" strokeDasharray="20 80" strokeDashoffset="-70" /> {/* Engineers */}
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#6366f1" strokeWidth="5" strokeDasharray="10 90" strokeDashoffset="-90" /> {/* Clients */}
                                    </svg>
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a' }}>248</span>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b' }}>TOTAL USERS</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { label: 'Admin & Mgmt', count: 98, color: 'var(--pivot-blue)' },
                                        { label: 'Site Builders', count: 74, color: '#10b981' },
                                        { label: 'Engineers', count: 52, color: '#f59e0b' },
                                        { label: 'Clients', count: 24, color: '#6366f1' }
                                    ].map((role, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: role.color }}></div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', minWidth: '100px' }}>{role.label}</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1a1a1a' }}>{role.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Feature Usage Stats */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>Top Feature Usage</h3>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Weekly Interactions</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {[
                                    { name: 'Blueprint Viewer', count: '14.2k', pct: 92, color: 'var(--pivot-blue)' },
                                    { name: 'Financial Reports', count: '8.5k', pct: 65, color: '#8b5cf6' },
                                    { name: 'Site Daily Logs', count: '6.1k', pct: 45, color: '#10b981' },
                                    { name: 'AI Cost Predictor', count: '3.8k', pct: 30, color: '#f59e0b' }
                                ].map((feat, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <span style={{ color: '#334155' }}>{feat.name}</span>
                                            <span style={{ color: '#1a1a1a' }}>{feat.count}</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${feat.pct}%`, height: '100%', background: feat.color, borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. System Logs & Errors */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>System Logs & Health Events</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ padding: '6px 12px', borderRadius: '8px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.75rem', fontWeight: 800 }}>Errors (2)</button>
                                <button style={{ padding: '6px 12px', borderRadius: '8px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 800 }}>All Logs</button>
                            </div>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                                    {['Timestamp', 'Level', 'Module', 'Message', 'User'].map((h, i) => (
                                        <th key={i} style={{ padding: '12px 16px', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { time: '10:42 AM', level: 'Error', module: 'Auth Service', msg: 'Failed login attempt (Invalid Token)', user: 'Unknown IP', color: '#dc2626', bg: '#fee2e2' },
                                    { time: '10:38 AM', level: 'Info', module: 'Project API', msg: 'New project "Skyline Phase 2" created', user: 'Admin.John', color: '#10b981', bg: '#ecfdf5' },
                                    { time: '10:15 AM', level: 'Warning', module: 'Database', msg: 'Query execution time exceeded 200ms', user: 'System', color: '#f59e0b', bg: '#fffbeb' },
                                    { time: '09:55 AM', level: 'Info', module: 'Reports', msg: 'Monthly financial report generated', user: 'CFO.Sarah', color: '#3b82f6', bg: '#eff6ff' },
                                    { time: '09:12 AM', level: 'Error', module: 'Integration', msg: 'SAP Sync Timeout (Retrying...)', user: 'System', color: '#dc2626', bg: '#fee2e2' }
                                ].map((log, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{log.time}</td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{ padding: '4px 8px', borderRadius: '6px', background: log.bg, color: log.color, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>{log.level}</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>{log.module}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>{log.msg}</td>
                                        <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{log.user}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>) : (
                <div style={{
                    padding: '5rem', background: 'white', borderRadius: '24px',
                    textAlign: 'center', border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                    <div style={{
                        width: '80px', height: '80px', background: '#f0f7ff', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                        color: 'var(--pivot-blue)'
                    }}>
                        <FileText size={40} weight="duotone" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.5rem' }}>{activeTab} Module</h2>
                    <p style={{ color: '#7a7a7a', fontWeight: 600 }}>Deep-dive analytics for {activeTab.toLowerCase()} are currently synchronizing.</p>
                    <button
                        onClick={() => setActiveTab('Overview')}
                        style={{
                            marginTop: '1.5rem', padding: '10px 24px', background: 'var(--pivot-blue)',
                            color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                        }}
                    >
                        Return to Overview
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes pulse-soft {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }

                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 4px 25px rgba(0,0,0,0.03);
                    border: 1px solid #f0f0f0;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .card:hover {
                    box-shadow: 0 15px 45px rgba(0, 71, 171, 0.08);
                    border-color: rgba(0, 71, 171, 0.1);
                    transform: translateY(-4px);
                }

                .tab-item {
                    transition: all 0.2s ease;
                }

                .tab-item:hover {
                    background: rgba(0, 71, 171, 0.05);
                }
            `}</style>
        </div>
    );
};

export default GlobalReports;
