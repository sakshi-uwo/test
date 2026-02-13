import React from 'react';
import { MagnifyingGlass, Bell, ChatCircleDots } from '@phosphor-icons/react';
import socketService from '../services/socket';

const Header = ({ user, onLogout }) => {
    // const [isConnected, setIsConnected] = React.useState(socketService.socket?.connected || false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([
        { id: 1, title: 'New High-Score Lead', time: '2 mins ago', type: 'Hot', detail: 'Johnathan Smith just inquired about Skyline Towers.' },
        { id: 2, title: 'Site Visit Confirmed', time: '1 hour ago', type: 'Warm', detail: 'Elena Rodriguez scheduled a visit for Saturday.' },
        { id: 3, title: 'Inventory Alert', time: '3 hours ago', type: 'Cold', detail: 'Only 12 units remaining in Phase 1 of Green Valley.' },
    ]);
    const [unread, setUnread] = React.useState(true);

    React.useEffect(() => {
        // const handleConnect = () => setIsConnected(true);
        // const handleDisconnect = () => setIsConnected(false);

        // socketService.on('connect', handleConnect);
        // socketService.on('disconnect', handleDisconnect);

        socketService.on('notification-push', (notif) => {
            console.log('[REAL-TIME] Notification received:', notif.title);
            const newNotif = {
                id: Date.now(),
                title: notif.title,
                time: 'Just now',
                type: notif.type || 'Hot',
                detail: notif.message
            };
            setNotifications(prev => [newNotif, ...prev]);
            setUnread(true);
        });

        return () => {
            // socketService.off('connect', handleConnect);
            // socketService.off('disconnect', handleDisconnect);
            socketService.off('notification-push');
        };
    }, []);

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) setUnread(false);
    };

    const headerStyle = {
        height: '70px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90,
    };

    return (
        <header style={headerStyle}>
            <div className="search-bar" style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--light-grey)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                width: '300px',
                border: '1px solid transparent',
                transition: 'var(--transition)'
            }}>
                <MagnifyingGlass size={20} />
                <input
                    type="text"
                    placeholder="Search leads, projects..."
                    style={{ border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>

                <div style={{ position: 'relative' }}>
                    <button
                        className="icon-btn"
                        onClick={handleToggleNotifications}
                        style={{ background: 'none', border: 'none', color: 'var(--charcoal)', cursor: 'pointer', position: 'relative', outline: 'none' }}
                    >
                        <Bell size={24} color={showNotifications ? 'var(--pivot-blue)' : 'var(--charcoal)'} />
                        {unread && (
                            <span style={{ width: '8px', height: '8px', background: '#ff4d4d', borderRadius: '50%', position: 'absolute', top: '-2px', right: '-2px', border: '2px solid var(--white)' }}></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute', top: '45px', right: '0', width: '350px',
                            background: 'var(--glass-bg)', backdropFilter: 'blur(15px)',
                            borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            border: '1px solid var(--glass-border)', padding: '1rem', overflow: 'hidden',
                            animation: 'slideInDown 0.3s ease-out'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Recent Alerts</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--pivot-blue)', fontWeight: 700, cursor: 'pointer' }}>Mark all as read</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {notifications.map(n => (
                                    <div key={n.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--pivot-blue-soft)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{n.title}</span>
                                            <span style={{
                                                fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 800,
                                                background: n.type === 'Hot' ? '#ffebeb' : (n.type === 'Warm' ? '#fff4eb' : '#ebf4ff'),
                                                color: n.type === 'Hot' ? '#ff4d4d' : (n.type === 'Warm' ? '#ff9f4d' : '#4d9fff')
                                            }}>{n.type}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--charcoal)', opacity: 0.8, lineHeight: '1.4' }}>{n.detail}</p>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--charcoal)', opacity: 0.5 }}>{n.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onLogout}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{user?.name || 'Administrator'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--charcoal)', margin: 0, textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'User'} (Tap to Logout)</p>
                    </div>
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=0047AB&color=fff`} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                </div>
            </div>
            <style>{`
                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </header>
    );
};

export default Header;
