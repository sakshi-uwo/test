import React, { useState, useEffect, useRef } from 'react';
import { ChatCircleDots, X, PaperPlaneTilt, Robot, User, DotsThreeOutline } from '@phosphor-icons/react';
import { chatService, authService } from '../services/api';

const Chatbot = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentUser = user || authService.getCurrentUser();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: currentUser?.role === 'builder'
                ? `Hello ${currentUser.name || 'Builder'}! I am your Construction Assistant. How can I help with your materials, inventory, or site logs today?`
                : `Hello! I am AI-AUTO AI. How can I help you with your property dashboard today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const currentUser = user || authService.getCurrentUser();
        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // Recalculate prompt in case user loaded later
            let rolePrompt = "You are AI-AUTO AI, a real estate assistant. Help users navigate the dashboard, view leads, and manage properties. Be professional and helpful.";

            if (currentUser?.role === 'builder') {
                rolePrompt = `You are AI-AUTO Builder Assistant. Your PRIMARY focus is helping builders manage construction materials, equipment inventory, site logs, and project progress for Yug AMC. 
                STRICT RULES:
                1. ONLY answer questions related to construction materials, site visits, and project inventory.
                2. If the user asks about other users' private data or non-builder tasks, politely decline and steer them back to construction materials.
                3. Be professional, technical, and efficient.
                4. Current User: ${currentUser.name}, Role: Builder.`;
            }

            const response = await chatService.sendMessage({
                content: input,
                history: messages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    content: m.content
                })),
                systemInstruction: rolePrompt
            });

            setMessages(prev => [...prev, { role: 'assistant', content: response.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the construction database. Please try again in a moment." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'Inter, sans-serif' }}>
            {/* Chat Bubble */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--pivot-blue), #003087)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0, 71, 171, 0.3)',
                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <ChatCircleDots size={32} weight="bold" />
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px', height: '550px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    overflow: 'hidden',
                    animation: 'slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem', background: 'linear-gradient(135deg, var(--pivot-blue), #003087)',
                        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Robot size={24} weight="bold" />
                            </div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700 }}>AI-AUTO AI</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }}></div>
                                    Online Assistant
                                </div>
                            </div>
                        </div>
                        <X size={24} weight="bold" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                gap: '8px'
                            }}>
                                {msg.role === 'assistant' && (
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Robot size={16} weight="bold" />
                                    </div>
                                )}
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '12px 16px',
                                    borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                    background: msg.role === 'user' ? 'var(--pivot-blue)' : '#f0f2f5',
                                    color: msg.role === 'user' ? 'white' : 'var(--soft-black)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.4',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                                }}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Robot size={16} weight="bold" />
                                </div>
                                <div style={{ background: '#f0f2f5', padding: '12px 16px', borderRadius: '16px', color: 'var(--charcoal)' }}>
                                    <DotsThreeOutline size={20} weight="bold" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.2rem', borderTop: '1px solid #efefef', background: 'white' }}>
                        <div style={{ display: 'flex', gap: '10px', background: '#f8f9fa', borderRadius: '14px', padding: '12px 16px', border: '1px solid #eee' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message..."
                                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem' }}
                            />
                            <PaperPlaneTilt
                                size={22}
                                weight="bold"
                                color={input.trim() ? 'var(--pivot-blue)' : '#ccc'}
                                style={{ cursor: input.trim() ? 'pointer' : 'default', transition: 'color 0.3s' }}
                                onClick={handleSend}
                            />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#999', marginTop: '10px' }}>
                            AI may generate inaccurate information.
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
