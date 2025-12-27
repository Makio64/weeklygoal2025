import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'

import { ALL_NOTIFICATION_IDS, NOTIFICATIONS } from './config'

// ============================================
// PERMISSION & STORAGE HELPERS
// ============================================

export async function requestPermission() {
	try {
		const result = await LocalNotifications.requestPermissions()
		return result.display === 'granted'
	} catch ( error ) {
		console.error( 'Permission request failed:', error )
		return false
	}
}

export async function getNotificationEnabled() {
	try {
		const { value } = await Preferences.get( { key: 'notifications' } )
		return value === 'true'
	} catch ( error ) {
		console.error( 'Failed to get notification state:', error )
		return false
	}
}

export async function setNotificationEnabled( enabled ) {
	try {
		await Preferences.set( { key: 'notifications', value: String( enabled ) } )
	} catch ( error ) {
		console.error( 'Failed to set notification state:', error )
	}
}

export async function detectAndStoreTimezone() {
	try {
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
		await Preferences.set( { key: 'timezone', value: timezone } )
		return timezone
	} catch ( error ) {
		console.error( 'Failed to store timezone:', error )
		return null
	}
}

// ============================================
// GENERIC SCHEDULING FUNCTIONS
// ============================================

/**
 * Schedule a single notification by ID
 */
export async function scheduleNotification( notificationId ) {
	const config = NOTIFICATIONS[notificationId]
	if ( !config ) {
		console.error( `Unknown notification ID: ${notificationId}` )
		return false
	}

	try {
		// Check if this notification should be scheduled
		if ( !config.shouldSchedule() ) {
			return false
		}

		// Get the message (may be async)
		const message = await config.getMessage()
		if ( !message ) {
			return false
		}

		// Calculate next occurrence
		const nextDate = config.schedule.getNextDate()

		await LocalNotifications.schedule( {
			notifications: [
				{
					id: config.id,
					title: message.title,
					body: message.body,
					schedule: {
						at: nextDate,
						every: config.schedule.every,
					},
				}
			],
		} )

		return true
	} catch ( error ) {
		console.error( `Failed to schedule notification ${notificationId}:`, error )
		return false
	}
}

/**
 * Cancel a single notification by ID
 */
export async function cancelNotification( notificationId ) {
	try {
		await LocalNotifications.cancel( {
			notifications: [{ id: notificationId }]
		} )
	} catch ( error ) {
		console.error( `Failed to cancel notification ${notificationId}:`, error )
	}
}

/**
 * Refresh a single notification (cancel + reschedule)
 * Updates the message content based on current goals state
 */
export async function refreshNotification( notificationId ) {
	await cancelNotification( notificationId )
	await scheduleNotification( notificationId )
}

/**
 * Cancel all notifications
 */
export async function cancelAllNotifications() {
	try {
		await LocalNotifications.cancel( {
			notifications: ALL_NOTIFICATION_IDS.map( id => ( { id } ) )
		} )
	} catch ( error ) {
		console.error( 'Failed to cancel all notifications:', error )
	}
}

/**
 * Schedule all notifications
 */
export async function setupAllNotifications() {
	await cancelAllNotifications()
	await Promise.all( ALL_NOTIFICATION_IDS.map( id => scheduleNotification( id ) ) )
}

/**
 * Refresh all notifications (for when goals change)
 */
export async function refreshAllNotifications() {
	await Promise.all( ALL_NOTIFICATION_IDS.map( id => refreshNotification( id ) ) )
}

/**
 * Show an immediate notification (for testing)
 */
export async function showNotification( title, body ) {
	try {
		await LocalNotifications.schedule( {
			notifications: [
				{
					id: Date.now(),
					title,
					body,
				}
			],
		} )
	} catch ( error ) {
		console.error( 'Failed to show notification:', error )
	}
}
