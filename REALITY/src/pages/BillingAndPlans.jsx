import React, { useState } from 'react';
import {
    ArrowLeft, Crown, CheckCircle, Warning, Lock, CreditCard,
    TrendUp, Users, HardHat, Robot, CloudArrowUp, FileText,
    Receipt, Clock, Bell, CurrencyDollar, ShieldCheck,
    Download, CaretDown, Plus, Minus, Gear
} from '@phosphor-icons/react';

const BillingAndPlans = ({ setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('payment'); // for section 7 tabs
    const [selectedPlan, setSelectedPlan] = useState('Pro'); // Track selected plan for details view
    const [autoRenew, setAutoRenew] = useState(true);

    // Plan Details Data
    const planDetails = {
        'Basic': [
            { name: 'Projects', limit: '5', status: 'active' },
            { name: 'Users', limit: '10', status: 'active' },
            { name: 'Global Reports', limit: 'Basic', status: 'warning' },
            { name: 'AI Insights', limit: 'None', status: 'locked' },
            { name: 'Data Export', limit: 'No', status: 'locked' },
        ],
        'Pro': [
            { name: 'Projects', limit: '10', status: 'active' },
            { name: 'Users', limit: '20', status: 'active' },
            { name: 'Global Reports', limit: 'Yes', status: 'active' },
            { name: 'AI Insights', limit: 'Basic', status: 'warning' },
            { name: 'Data Export', limit: 'Yes', status: 'active' },
        ],
        'Enterprise': [
            { name: 'Projects', limit: 'Unlimited', status: 'active' },
            { name: 'Users', limit: 'Unlimited', status: 'active' },
            { name: 'Global Reports', limit: 'Advanced', status: 'active' },
            { name: 'AI Insights', limit: 'Advanced', status: 'active' },
            { name: 'Data Export', limit: 'Yes', status: 'active' },
        ]
    };

    // Mock Data
    const usageStats = [
        { label: 'Projects', used: 8, total: 10, color: '#10b981' }, // Green
        { label: 'Users', used: 15, total: 20, color: '#f59e0b' }, // Yellow
        { label: 'Automation Runs', used: 320, total: 500, color: '#3b82f6' }, // Blue
        { label: 'AI Predictions', used: 90, total: 200, color: '#8b5cf6' }, // Purple
        { label: 'Storage', used: 12, total: 20, unit: 'GB', color: '#ec4899' } // Pink
    ];



    const plans = [
        { name: 'Basic', price: '₹2,999', period: 'mo', features: ['5 Projects', '10 Users', 'Basic Reports'] },
        { name: 'Pro', price: '₹7,999', period: 'mo', features: ['10 Projects', '20 Users', 'Advanced AI', 'Priority Support'], isCurrent: true },
        { name: 'Enterprise', price: '₹19,999', period: 'mo', features: ['Unlimited Projects', 'Unlimited Users', 'Custom AI', 'Dedicated Account Manager'] }
    ];

    const [activeAddons, setActiveAddons] = useState([
        { name: 'Extra Users (+5)', price: '₹999/mo', quantity: 0, enabled: false },
        { name: 'Extra Projects (+2)', price: '₹1,499/mo', quantity: 0, enabled: false },
        { name: 'Additional Storage (50GB)', price: '₹499/mo', quantity: 0, enabled: false },
        { name: 'Advanced AI Insights', price: '₹2,499/mo', quantity: 0, enabled: false },
    ]);

    const [activeAlerts, setActiveAlerts] = useState([
        { label: 'Plan expiry alerts', enabled: true },
        { label: 'Usage limit alerts', enabled: true },
        { label: 'Payment failure alerts', enabled: true }
    ]);

    const handleAddonQuantityChange = (index, delta) => {
        const newAddons = [...activeAddons];
        const newQuantity = Math.max(0, newAddons[index].quantity + delta);
        newAddons[index].quantity = newQuantity;
        if (newQuantity > 0 && !newAddons[index].enabled) {
            newAddons[index].enabled = true;
        } else if (newQuantity === 0) {
            newAddons[index].enabled = false;
        }
        setActiveAddons(newAddons);
    };

    const toggleAddon = (index) => {
        const newAddons = [...activeAddons];
        newAddons[index].enabled = !newAddons[index].enabled;
        if (newAddons[index].enabled && newAddons[index].quantity === 0) {
            newAddons[index].quantity = 1;
        } else if (!newAddons[index].enabled) {
            newAddons[index].quantity = 0;
        }
        setActiveAddons(newAddons);
    };

    const toggleAlert = (index) => {
        const newAlerts = [...activeAlerts];
        newAlerts[index].enabled = !newAlerts[index].enabled;
        setActiveAlerts(newAlerts);
    };

    const invoices = [
        { id: 'INV-2024-001', date: 'Feb 01, 2026', amount: '₹7,999', status: 'Paid' },
        { id: 'INV-2024-002', date: 'Jan 01, 2026', amount: '₹7,999', status: 'Paid' },
        { id: 'INV-2023-012', date: 'Dec 01, 2025', amount: '₹7,999', status: 'Paid' },
    ];

    const history = [
        { date: '12 Jan 2026', action: 'Upgrade', detail: 'Basic → Pro', user: 'Admin' },
        { date: '15 Dec 2025', action: 'Add-on', detail: 'Extra Users (+5)', user: 'Admin' },
        { date: '01 Nov 2025', action: 'Billing Update', detail: 'Credit card ending in 4242', user: 'Admin' },
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>

            {/* 1. Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => setCurrentPage('dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={24} color="#64748b" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Billing & Plans</h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Manage your subscription, usage limits, and invoices</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '6px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div> Active
                    </div>
                    <button style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', color: '#1e293b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} weight="bold" /> Download Invoice
                    </button>
                    <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 71, 171, 0.2)' }}>
                        Upgrade Plan
                    </button>
                </div>
            </div>

            {/* 2. Current Plan Summary */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, white 0%, #f8fafc 100%)', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 25px -5px rgba(0, 71, 171, 0.4)' }}>
                        <Crown size={32} weight="fill" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Plan</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b' }}>Pro Plan</div>
                        <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700 }}>₹7,999</span> / month • billed monthly
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Renewal Date: <span style={{ fontWeight: 700, color: '#1e293b' }}>March 14, 2026</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Auto-Renew</span>
                        <div
                            onClick={() => setAutoRenew(!autoRenew)}
                            style={{
                                width: '40px', height: '20px',
                                background: autoRenew ? '#10b981' : '#e2e8f0',
                                borderRadius: '20px', position: 'relative', cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                right: autoRenew ? '2px' : '22px',
                                top: '2px', width: '16px', height: '16px',
                                background: 'white', borderRadius: '50%',
                                transition: 'right 0.2s'
                            }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Usage Overview */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Usage Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {usageStats.map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>
                            <span>{stat.label}</span>
                            <span>{Math.round((stat.used / stat.total) * 100)}%</span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                            {stat.used} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>/ {stat.total} {stat.unit}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${(stat.used / stat.total) * 100}%`, height: '100%', background: stat.color, borderRadius: '4px' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                {/* 4. Plan Features & Limits */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>
                        Plan Features & Limits <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginLeft: '10px' }}>({selectedPlan})</span>
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>FEATURE</th>
                                <th style={{ textAlign: 'left', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>LIMIT</th>
                                <th style={{ textAlign: 'right', padding: '12px', fontSize: '0.85rem', color: '#64748b' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {planDetails[selectedPlan].map((feature, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px', fontWeight: 600, color: '#334155' }}>{feature.name}</td>
                                    <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{feature.limit}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        {feature.status === 'active' && <CheckCircle size={20} weight="fill" color="#10b981" />}
                                        {feature.status === 'warning' && <Warning size={20} weight="fill" color="#f59e0b" />}
                                        {feature.status === 'locked' && <Lock size={20} weight="fill" color="#cbd5e1" />}
                                    </td>
                                </tr>
                            ))}
                            {/* Locked Feature Example */}
                            <tr style={{ opacity: 0.6 }}>
                                <td style={{ padding: '12px', fontWeight: 600, color: '#94a3b8' }}>Custom API Access</td>
                                <td style={{ padding: '12px', fontWeight: 700, color: '#94a3b8' }}>-</td>
                                <td style={{ padding: '12px', textAlign: 'right' }}><Lock size={20} weight="fill" color="#cbd5e1" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 5. Upgrade / Downgrade Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedPlan(plan.name)}
                            className="card"
                            style={{
                                padding: '1.5rem',
                                border: selectedPlan === plan.name ? '2px solid var(--pivot-blue)' : '1px solid #e2e8f0',
                                background: selectedPlan === plan.name ? '#f8fafc' : 'white',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {plan.isCurrent && <div style={{ position: 'absolute', top: '-10px', right: '20px', background: 'var(--pivot-blue)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700 }}>CURRENT</div>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{plan.name}</div>
                                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{plan.price}<span style={{ fontSize: '0.7rem', color: '#64748b' }}>/{plan.period}</span></div>
                            </div>
                            <ul style={{ padding: 0, listStyle: 'none', margin: '0 0 1rem 0' }}>
                                {plan.features.slice(0, 2).map((f, j) => (
                                    <li key={j} style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>• {f}</li>
                                ))}
                            </ul>
                            {!plan.isCurrent && (
                                <button style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', background: 'white', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                                    {i > 1 ? 'Upgrade' : 'Downgrade'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. Add-Ons Section */}
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem' }}>Available Add-Ons</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {activeAddons.map((addon, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{addon.name}</div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--pivot-blue)' }}>{addon.price}</div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                                <button
                                    onClick={() => handleAddonQuantityChange(i, -1)}
                                    style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Minus size={12} />
                                </button>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{addon.quantity}</span>
                                <button
                                    onClick={() => handleAddonQuantityChange(i, 1)}
                                    style={{ border: 'none', background: 'white', width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                            <div
                                onClick={() => toggleAddon(i)}
                                style={{ width: '36px', height: '20px', background: addon.enabled ? '#10b981' : '#e2e8f0', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                            >
                                <div style={{ position: 'absolute', left: addon.enabled ? '18px' : '2px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'left 0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* 7. Payment & Invoices */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Receipt size={24} color="var(--pivot-blue)" /> Payment & Invoices
                    </h3>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <div style={{ paddingBottom: '10px', borderBottom: '2px solid var(--pivot-blue)', fontWeight: 700, color: 'var(--pivot-blue)', cursor: 'pointer' }}>Invoices</div>
                        <div style={{ paddingBottom: '10px', fontWeight: 600, color: '#94a3b8', cursor: 'pointer' }}>Payment Methods</div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', fontSize: '0.8rem', color: '#64748b' }}>
                                <th style={{ padding: '10px' }}>INVOICE ID</th>
                                <th style={{ padding: '10px' }}>DATE</th>
                                <th style={{ padding: '10px' }}>AMOUNT</th>
                                <th style={{ padding: '10px' }}>STATUS</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '12px', fontWeight: 600, color: '#334155' }}>{inv.id}</td>
                                    <td style={{ padding: '12px', color: '#64748b' }}>{inv.date}</td>
                                    <td style={{ padding: '12px', fontWeight: 700 }}>{inv.amount}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '12px', background: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: 700 }}>{inv.status}</span>
                                    </td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pivot-blue)' }}><Download size={18} weight="bold" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 8. Billing Settings & 9. Alerts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Gear size={24} color="var(--pivot-blue)" /> Billing Settings
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Billing Email</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>admin@reality-os.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Currency</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>INR (₹)</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>Invoice Frequency</span>
                                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Monthly</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bell size={24} color="var(--pivot-blue)" /> Alerts & Notifications
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {activeAlerts.map((alert, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{alert.label}</span>
                                    <div
                                        onClick={() => toggleAlert(i)}
                                        style={{ width: '36px', height: '20px', background: alert.enabled ? '#10b981' : '#e2e8f0', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                                    >
                                        <div style={{ position: 'absolute', right: alert.enabled ? '2px' : '18px', top: '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: 'right 0.2s' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 10. Audit Log */}
            <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Plan History & Audit Log</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', opacity: 0.9 }}>
                    <tbody>
                        {history.map((h, i) => (
                            <tr key={i} style={{ fontSize: '0.85rem', borderBottom: i < history.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <td style={{ padding: '12px 0', width: '140px', color: '#64748b' }}>{h.date}</td>
                                <td style={{ padding: '12px 0', fontWeight: 700, color: '#334155' }}>{h.action}</td>
                                <td style={{ padding: '12px 0', color: '#475569' }}>{h.detail}</td>
                                <td style={{ padding: '12px 0', textAlign: 'right', color: '#94a3b8' }}>Changed by {h.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default BillingAndPlans;
