import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import {
    HouseLine, CaretRight, ChartPieSlice, CurrencyDollar,
    CalendarCheck, FileText, ChatCircleText, CheckCircle,
    DownloadSimple, PaperPlaneRight, Receipt, Clock,
    ThumbsUp, ThumbsDown, Info
} from '@phosphor-icons/react';
import QueryFeedbackModal from '../../components/QueryFeedbackModal';

const ClientDashboard = () => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQueryModal, setShowQueryModal] = useState(false);

    // Mock Data for Client Features
    const [financials] = useState({
        totalBudget: '$450,000',
        paid: '$120,000',
        pending: '$330,000',
        nextPaymentDue: '2026-03-15',
        nextPaymentAmount: '$15,000'
    });

    const [timeline] = useState([
        { id: 1, phase: 'Foundation', status: 'Completed', date: 'Jan 20, 2026' },
        { id: 2, phase: 'Structure', status: 'In Progress', date: 'Due: Mar 10, 2026' },
        { id: 3, phase: 'Finishing', status: 'Pending', date: 'Due: May 20, 2026' },
    ]);

    const [documents] = useState([
        { id: 1, name: 'Floor_Plan_v3.pdf', type: 'Design', status: 'Approved', date: '2026-02-10' },
        { id: 2, name: 'Material_Selection_Opt2.pdf', type: 'Specs', status: 'Action Required', date: '2026-02-17' },
    ]);

    const [invoices] = useState([
        { id: 101, desc: 'Initial Deposit', amount: '$50,000', status: 'Paid', date: '2026-01-05' },
        { id: 102, desc: 'Foundation Milestone', amount: '$70,000', status: 'Paid', date: '2026-02-01' },
    ]);

    const [queries, setQueries] = useState([
        { id: 1, subject: 'Kitchen Tile Options', status: 'Resolved', date: '2026-02-12' },
    ]);

    useEffect(() => {
        // Simulating fetching the primary project for the logged-in client
        const fetchProject = async () => {
            try {
                // In a real app, this would filter by user ID
                const res = await axios.get(`${API_BASE_URL}/projects`);
                if (res.data && res.data.length > 0) {
                    setProject(res.data[0]); // Just taking the first one for demo
                }
            } catch (error) {
                console.error("Error fetching client project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, []);

    const handleTicketSubmit = (data) => {
        const newTicket = {
            id: Date.now(),
            subject: data.title || data.type,
            status: 'Open',
            date: new Date().toLocaleDateString(),
            type: data.type,
            priority: data.priority
        };
        setQueries(prev => [newTicket, ...prev]);
        setShowQueryModal(false);
        // Here you would typically send this data to your backend
        alert("Your query has been raised. Expected response in 24 hrs.");
    };

    const FeatureCard = ({ title, icon, children, action }) => (
        <div className="dashboard-card" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #f0f0f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px', color: '#1e293b', margin: 0 }}>
                    {icon} {title}
                </h3>
                {action && (
                    <button style={{
                        background: 'transparent', border: 'none', color: 'var(--pivot-blue)',
                        fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                    }}>
                        {action}
                    </button>
                )}
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );

    if (loading) return <div style={{ padding: '2rem' }}>Loading your dashboard...</div>;

    if (!project) return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <HouseLine size={48} weight="duotone" />
            <h3>No Active Projects</h3>
            <p>Please contact support to link your account.</p>
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#0f172a', marginBottom: '0.5rem', fontWeight: 800, fontSize: '2rem' }}>Welcome Home, Client</h1>
                <p style={{ color: '#64748b', fontWeight: 500, fontSize: '1rem' }}>
                    Tracking progress for <span style={{ fontWeight: 700, color: 'var(--pivot-blue)' }}>{project.name}</span>
                </p>
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 1. Project Progress & 4. Timeline */}
                    <FeatureCard
                        title="Project Timeline & Progress"
                        icon={<CalendarCheck size={24} color="#2563eb" weight="fill" />}
                        action="Full Schedule"
                    >
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 700, color: '#334155' }}>Overall Completion</span>
                                <span style={{ fontWeight: 800, color: '#2563eb' }}>45%</span>
                            </div>
                            <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', borderRadius: '5px' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                            {/* Simple line behind steps */}
                            <div style={{ position: 'absolute', top: '15px', left: '0', right: '0', height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>

                            {timeline.map((step) => (
                                <div key={step.id} style={{ position: 'relative', zIndex: 1, textAlign: 'center', width: '30%' }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto 10px',
                                        background: step.status === 'Completed' ? '#16a34a' : step.status === 'In Progress' ? '#2563eb' : 'white',
                                        border: `2px solid ${step.status === 'Completed' ? '#16a34a' : step.status === 'In Progress' ? '#2563eb' : '#cbd5e1'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                    }}>
                                        {step.status === 'Completed' && <CheckCircle size={16} weight="bold" />}
                                        {step.status === 'In Progress' && <Clock size={16} weight="bold" />}
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1e293b' }}>{step.phase}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{step.date}</div>
                                </div>
                            ))}
                        </div>
                    </FeatureCard>

                    {/* 3. Budget & 5. Payments/Invoices */}
                    <FeatureCard
                        title="Financial Overview"
                        icon={<ChartPieSlice size={24} color="#059669" weight="fill" />}
                        action="Transaction History"
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '15px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                <div style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>Total Budget</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d' }}>{financials.totalBudget}</div>
                                <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '5px' }}>Paid: {financials.paid}</div>
                            </div>
                            <div style={{ padding: '15px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                                <div style={{ fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>Next Payment</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c2d12' }}>{financials.nextPaymentAmount}</div>
                                <div style={{ fontSize: '0.75rem', color: '#9a3412', marginTop: '5px' }}>Due: {financials.nextPaymentDue}</div>
                            </div>
                        </div>

                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#64748b', textTransform: 'uppercase' }}>Recent Invoices</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {invoices.map(inv => (
                                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}>
                                            <Receipt size={20} weight="fill" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{inv.desc}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{inv.date}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: 700 }}>{inv.amount}</div>
                                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>{inv.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FeatureCard>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* 5. Review & Approve Documents */}
                    <FeatureCard
                        title="Document Approvals"
                        icon={<FileText size={24} color="#d97706" weight="fill" />}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {documents.map(doc => (
                                <div key={doc.id} style={{ padding: '12px', background: doc.status === 'Action Required' ? '#fffbeb' : '#f8fafc', borderRadius: '12px', border: `1px solid ${doc.status === 'Action Required' ? '#fcd34d' : '#e2e8f0'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: doc.status === 'Action Required' ? '#b45309' : '#16a34a', textTransform: 'uppercase' }}>{doc.status}</span>
                                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{doc.date}</span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px', color: '#334155' }}>{doc.name}</div>

                                    {doc.status === 'Action Required' ? (
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button style={{ flex: 1, padding: '6px', borderRadius: '6px', background: '#16a34a', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                <ThumbsUp size={14} weight="bold" /> Approve
                                            </button>
                                            <button style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'white', border: '1px solid #e2e8f0', color: '#ef4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                <ThumbsDown size={14} weight="bold" /> Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <button style={{ width: '100%', padding: '6px', borderRadius: '6px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                            <DownloadSimple size={14} weight="bold" /> Download
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </FeatureCard>

                    {/* 6. Communicate & 7. Queries */}
                    <FeatureCard
                        title="Builder Communication"
                        icon={<ChatCircleText size={24} color="#7c3aed" weight="fill" />}
                    >
                        <div style={{ height: '250px', background: '#f8fafc', borderRadius: '12px', marginBottom: '1rem', padding: '1rem', overflowY: 'auto' }}>
                            {queries.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem', fontSize: '0.9rem' }}>
                                    <Info size={24} style={{ marginBottom: '5px' }} />
                                    <p>No active queries. Raise a ticket below.</p>
                                </div>
                            ) : (
                                queries.map(q => (
                                    <div key={q.id} style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>You</span>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{q.date}</span>
                                        </div>
                                        <div style={{ background: '#ede9fe', padding: '8px 12px', borderRadius: '8px 8px 0 8px', fontSize: '0.9rem', color: '#4c1d95', marginTop: '4px' }}>
                                            {q.subject}
                                            {q.priority && <span style={{ fontSize: '0.65rem', marginLeft: '8px', padding: '2px 6px', borderRadius: '4px', background: q.priority === 'Critical' ? '#fee2e2' : '#e0f2fe', color: q.priority === 'Critical' ? '#991b1b' : '#075985', fontWeight: 700 }}>{q.priority}</span>}
                                        </div>
                                        {q.status === 'Resolved' && (
                                            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                                <span style={{ fontSize: '0.65rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>RESOLVED</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => setShowQueryModal(true)}
                            style={{
                                width: '100%', padding: '12px', background: 'var(--pivot-blue)', color: 'white', border: 'none',
                                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontWeight: 700, fontSize: '0.9rem'
                            }}
                        >
                            <PaperPlaneRight size={18} weight="bold" /> Raise New Query / Feedback
                        </button>
                    </FeatureCard>

                </div>

            </div>

            <style>{`
                .dashboard-card {
                    transition: all 0.3s ease;
                }
                .dashboard-card:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transform: translateY(-2px);
                }
            `}</style>

            <QueryFeedbackModal
                isOpen={showQueryModal}
                onClose={() => setShowQueryModal(false)}
                onSubmit={handleTicketSubmit}
            />
        </div>
    );
};

export default ClientDashboard;
