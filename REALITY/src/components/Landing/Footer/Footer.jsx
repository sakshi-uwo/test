import React, { useState } from 'react';
import {
    Mail, MapPin, Phone, X, ChevronDown, ChevronUp, HelpCircle, ArrowRight,
    Linkedin, Twitter, Facebook, Instagram, Youtube, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { logo, name, faqs } from '../../../config/constants';
import { apis } from '../../../config/api';
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';
import TermsOfServiceModal from '../modals/TermsOfServiceModal';
import CookiePolicyModal from '../modals/CookiePolicyModal';
import AboutModal from '../modals/AboutModal';
import './Footer.css';
import '../modals/Modal.css';

const Footer = () => {
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [activeTab, setActiveTab] = useState('faq');
    const [issueType, setIssueType] = useState('General Inquiry');
    const [issueText, setIssueText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    const issueOptions = [
        "General Inquiry",
        "Payment Issue",
        "Refund Request",
        "Technical Support",
        "Account Access",
        "Other"
    ];

    const handleSupportSubmit = async () => {
        if (!issueText.trim()) return;
        setIsSending(true);
        setSendStatus(null);
        try {
            // Note: In a real app, you'd get the user ID from context/store
            await axios.post(apis.support, {
                email: "guest@ai-auto.com",
                issueType,
                message: issueText,
                userId: null
            });
            setSendStatus('success');
            setIssueText('');
            setTimeout(() => setSendStatus(null), 3000);
        } catch (error) {
            console.error("Support submission failed", error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <motion.footer
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="footer-container"
            >
                <div className="footer-gradient-overlay" />
                <div className="footer-content">
                    <div className="footer-grid">
                        {/* Brand Column */}
                        <div className="footer-brand">
                            <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                <img src={logo} alt={`${name} Logo`} />
                                <span className="brand-name">{name} <sup className="tm-symbol">TM</sup></span>
                            </div>

                            <div className="social-links">
                                {[
                                    { Icon: Linkedin, href: "https://www.linkedin.com/in/aimall-global/", label: "LinkedIn" },
                                    { Icon: Twitter, href: "https://x.com/aimallglobal", label: "Twitter" },
                                    { Icon: Facebook, href: "https://www.facebook.com/aimallglobal/", label: "Facebook" },
                                    { Icon: Instagram, href: "https://www.instagram.com/aimall.global/", label: "Instagram" },
                                    { Icon: Youtube, href: "https://www.youtube.com/@aimallglobal", label: "YouTube" },
                                    { Icon: MessageCircle, href: "https://api.whatsapp.com/send?phone=918359890909", label: "WhatsApp" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon"
                                        aria-label={social.label}
                                    >
                                        <social.Icon size={20} color="currentColor" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Support Column */}
                        <div className="footer-links-column">
                            <h4 className="column-title">Support</h4>
                            <ul className="footer-links-list">
                                <li>
                                    <button onClick={() => setIsFaqOpen(true)} className="footer-link-btn">
                                        Help Center
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => setIsAboutModalOpen(true)} className="footer-link-btn">
                                        About {name}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="footer-contact">
                            <h4 className="column-title">Contact</h4>
                            <div className="contact-info">
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Jabalpur+Madhya+Pradesh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-item"
                                >
                                    <MapPin className="contact-icon" />
                                    <p>Jabalpur, Madhya Pradesh, India</p>
                                </a>
                                <a href="mailto:admin@uwo24.com" className="contact-item">
                                    <Mail className="contact-icon" />
                                    <span>admin@uwo24.com</span>
                                </a>
                                <a href="tel:+918358990909" className="contact-item">
                                    <Phone className="contact-icon" />
                                    <span>+91 83589 90909</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="footer-bottom">
                        <p className="copyright">
                            © {new Date().getFullYear()} {name} <sup className="tm-symbol">TM</sup>. All Rights Reserved
                        </p>
                        <div className="policy-links">
                            <button onClick={() => setIsPrivacyModalOpen(true)} className="policy-link-btn">Privacy Policy</button>
                            <button onClick={() => setIsTermsModalOpen(true)} className="policy-link-btn">Terms of Service</button>
                            <button onClick={() => setIsCookieModalOpen(true)} className="policy-link-btn">Cookie Policy</button>
                        </div>
                    </div>
                </div>
            </motion.footer>

            {/* FAQ Modal */}
            <AnimatePresence>
                {isFaqOpen && (
                    <div className="modal-overlay">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="faq-modal-container"
                        >
                            <div className="faq-modal-header">
                                <div className="tab-pill">
                                    <button
                                        onClick={() => setActiveTab('faq')}
                                        className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
                                    >
                                        FAQ
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('help')}
                                        className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
                                    >
                                        Help
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsFaqOpen(false)}
                                    className="close-modal-btn"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="faq-modal-body">
                                {activeTab === 'faq' ? (
                                    <div className="faq-list">
                                        <p className="faq-subtitle">Everything you need to know about {name}.</p>
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="faq-item">
                                                <button
                                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                                    className="faq-question-btn"
                                                >
                                                    <span>{faq.question}</span>
                                                    {openFaqIndex === index ? (
                                                        <ChevronUp className="faq-chevron" />
                                                    ) : (
                                                        <ChevronDown className="faq-chevron" />
                                                    )}
                                                </button>
                                                <div
                                                    className={`faq-answer-content ${openFaqIndex === index ? 'open' : ''}`}
                                                >
                                                    <div className="faq-answer-inner">
                                                        {faq.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="help-form">
                                        <div className="form-group">
                                            <label>Select Category</label>
                                            <div className="custom-select-wrapper">
                                                <select
                                                    value={issueType}
                                                    onChange={(e) => setIssueType(e.target.value)}
                                                    className="form-select"
                                                >
                                                    {issueOptions.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="select-chevron" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Describe Your Issue</label>
                                            <textarea
                                                className="form-textarea"
                                                placeholder="Tell us what's happening..."
                                                value={issueText}
                                                onChange={(e) => setIssueText(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleSupportSubmit}
                                            disabled={isSending || !issueText.trim()}
                                            className={`submit-ticket-btn ${isSending || !issueText.trim() ? 'disabled' : ''}`}
                                        >
                                            {isSending ? (
                                                <span className="btn-loader" />
                                            ) : (
                                                <>
                                                    <HelpCircle className="w-5 h-5" />
                                                    Submit Ticket
                                                </>
                                            )}
                                        </button>
                                        {sendStatus === 'success' && (
                                            <div className="status-msg success">
                                                Support ticket created successfully!
                                            </div>
                                        )}
                                        {sendStatus === 'error' && (
                                            <div className="status-msg error">
                                                Failed to send ticket. Please try again.
                                            </div>
                                        )}
                                        <p className="form-footer-note">
                                            Or email us at <a href="mailto:admin@uwo24.com">admin@uwo24.com</a>
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="faq-modal-footer">
                                <button
                                    onClick={() => setIsFaqOpen(false)}
                                    className="close-faq-btn"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
            <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
            <CookiePolicyModal isOpen={isCookieModalOpen} onClose={() => setIsCookieModalOpen(false)} />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        </>
    );
};

export default Footer;
