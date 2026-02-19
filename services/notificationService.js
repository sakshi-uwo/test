import Notification from '../models/Notification.js';
import NotificationSetting from '../models/NotificationSetting.js';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';

/**
 * AI_AUTO Notification Service: Production Grade
 * Handles event-driven notification dispatching based on roles and preferences.
 */
class NotificationService {
    constructor() {
        this.io = null;
    }

    /**
     * Set the Socket.io instance
     * @param {Object} io 
     */
    setIo(io) {
        this.io = io;
    }

    /**
     * Mapping of events to roles that should be notified by default
     */
    EVENT_ROLE_MAP = {
        'hazard': ['Admin', 'Civil Engineer', 'Safety Officer', 'Builder'],
        'task_assigned': ['Site Manager', 'Civil Engineer', 'Builder'],
        'task_updated': ['Site Manager', 'Admin', 'Builder', 'Civil Engineer'],
        'site_log': ['Admin', 'Civil Engineer', 'Builder'],
        'attendance': ['Site Manager', 'Admin', 'Builder'],
        'design_approval': ['Admin', 'Client', 'Civil Engineer', 'Builder'],
        'design_rejected': ['Admin', 'Client', 'Civil Engineer', 'Builder'],
        'budget_exceeded': ['Client', 'Admin', 'Builder'],
        'milestone': ['Client', 'Admin', 'Site Manager', 'Civil Engineer', 'Builder'],
        'schedule_delay': ['Client', 'Admin', 'Civil Engineer', 'Builder'],
        'system': ['Admin', 'Builder', 'Civil Engineer', 'Client']
    };

    /**
     * Trigger a notification event
     * @param {string} eventType - The type of event (e.g., 'hazard', 'milestone')
     * @param {Object} data - Contextual data (e.g., projectID, taskID, message override)
     */
    async triggerNotification(eventType, data) {
        try {
            console.log(`🔔 Notification Triggered: ${eventType}`);

            const rolesToNotify = this.EVENT_ROLE_MAP[eventType] || [];
            if (rolesToNotify.length === 0) return;

            // Find all users with the relevant roles
            const users = await User.find({ role: { $in: rolesToNotify }, status: 'Active' });

            for (const user of users) {
                // Check user preferences
                let setting = await NotificationSetting.findOne({ user: user._id });

                if (!setting) {
                    setting = await NotificationSetting.create({
                        user: user._id,
                        preferences: Object.keys(this.EVENT_ROLE_MAP).map(type => ({
                            eventType: type,
                            inApp: true,
                            email: true
                        }))
                    });
                }

                const pref = setting.preferences.find(p => p.eventType === eventType);
                if (pref && !pref.inApp && !pref.email) continue;

                const notificationPayload = {
                    title: data.title || this._formatTitle(eventType),
                    message: data.message || `An alert of type ${eventType} has occurred in the system.`,
                    priority: data.priority || this._getPriority(eventType),
                    metadata: data.metadata || {}
                };

                // Dispatch to all enabled channels in parallel
                const dispatchResults = await Promise.allSettled([
                    this._dispatchInApp(user, eventType, notificationPayload, pref),
                    this._dispatchEmail(user, eventType, notificationPayload, pref)
                ]);

                // Log or handle individual channel failures if needed
                const failedChannels = dispatchResults.filter(r => r.status === 'rejected');
                if (failedChannels.length > 0) {
                    console.warn(`[WARN] Some channels failed for user ${user.email}:`, failedChannels.map(f => f.reason));
                }
            }
        } catch (err) {
            console.error('❌ Notification Service Error:', err);
        }
    }

    async _dispatchInApp(user, eventType, payload, pref) {
        if (pref && !pref.inApp) return null;

        const notification = new Notification({
            recipient: user._id,
            ...payload,
            type: eventType,
            channelsSent: ['inApp']
        });

        await notification.save();

        if (this.io) {
            this.io.to(user._id.toString()).emit('notification', notification);
        }
        return 'inApp';
    }

    async _dispatchEmail(user, eventType, payload, pref) {
        if (!pref || !pref.email || !user.email) return null;

        const result = await emailService.sendEmail(
            user.email,
            `AI_AUTO ALERT: ${payload.title}`,
            payload.message,
            `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0047AB;">${payload.title}</h2>
                <p>${payload.message}</p>
                <hr />
                <small style="color: #666;">Priority: ${payload.priority.toUpperCase()} | Type: ${eventType}</small>
            </div>`
        );

        if (result.success) {
            await Notification.findOneAndUpdate(
                { recipient: user._id, type: eventType },
                { $addToSet: { channelsSent: 'email' } },
                { sort: { createdAt: -1 } }
            );
        }
        return 'email';
    }

    _formatTitle(eventType) {
        return eventType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    _getPriority(eventType) {
        const urgentEvents = ['hazard', 'budget_exceeded', 'schedule_delay'];
        return urgentEvents.includes(eventType) ? 'high' : 'medium';
    }
}

export default new NotificationService();
