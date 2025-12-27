// Main manager
export { default, NotificationManager, default as notificationManager } from './NotificationManager'

// Config (for access to IDs and utilities if needed externally)
export {
	calculateWeeklyProgress,
	getNotificationIdsForReminderMode,
	getPendingGoals,
	NOTIFICATION_IDS,
	NOTIFICATIONS,
	REMINDER_MODES,
} from './config'

// Scheduler functions (for direct use if needed)
export {
	cancelAllNotifications,
	cancelNotification,
	getNotificationEnabled,
	getReminderMode,
	refreshAllNotifications,
	refreshNotification,
	requestPermission,
	scheduleNotification,
	setNotificationEnabled,
	setReminderMode,
	setupAllNotifications,
	showNotification,
} from './scheduler'
