import { LocalNotifications } from '@capacitor/local-notifications'
import { Preferences } from '@capacitor/preferences'

// Request notification permissions
export async function requestPermission() {
	try {
		const result = await LocalNotifications.requestPermissions()
		return result.display === 'granted'
	} catch ( error ) {
		console.error( 'Permission request failed:', error )
		return false
	}
}

// Show immediate notification
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

// Get notification enabled state
export async function getNotificationEnabled() {
	try {
		const { value } = await Preferences.get( { key: 'notifications' } )
		return value === 'true'
	} catch ( error ) {
		console.error( 'Failed to get notification state:', error )
		return false
	}
}

// Set notification enabled state
export async function setNotificationEnabled( enabled ) {
	try {
		await Preferences.set( { key: 'notifications', value: String( enabled ) } )
	} catch ( error ) {
		console.error( 'Failed to set notification state:', error )
	}
}

// Detect and store timezone
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
