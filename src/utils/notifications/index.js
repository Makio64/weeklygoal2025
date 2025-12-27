// Main manager
export { default, NotificationManager, default as notificationManager } from './NotificationManager'

// Config (for access to IDs and utilities if needed externally)
export { calculateWeeklyProgress, getPendingGoals, NOTIFICATION_IDS, NOTIFICATIONS } from './config'

// Scheduler functions (for direct use if needed)
export {
	cancelAllNotifications,
	cancelNotification,
	getNotificationEnabled,
	refreshAllNotifications,
	refreshNotification,
	requestPermission,
	scheduleNotification,
	setNotificationEnabled,
	setupAllNotifications,
	showNotification,
} from './scheduler'
