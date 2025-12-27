import Signal from '@/makio/core/Signal'

import { NOTIFICATION_IDS, NOTIFICATIONS } from './config'
import {
	cancelAllNotifications,
	detectAndStoreTimezone,
	getNotificationEnabled,
	refreshAllNotifications,
	requestPermission,
	setNotificationEnabled,
	setupAllNotifications,
	showNotification,
} from './scheduler'

class NotificationManager {
	enabled = false
	onPermissionChange = new Signal()

	async init() {
		try {
			this.enabled = await getNotificationEnabled()
			await detectAndStoreTimezone()

			if ( this.enabled ) {
				await setupAllNotifications()
			}
		} catch ( error ) {
			console.error( 'NotificationManager init failed:', error )
		}
	}

	async toggle() {
		try {
			if ( this.enabled ) {
				// Turn off
				this.enabled = false
				await setNotificationEnabled( false )
				await cancelAllNotifications()
			} else {
				// Turn on
				const granted = await requestPermission()
				if ( granted ) {
					this.enabled = true
					await setNotificationEnabled( true )
					await setupAllNotifications()
					this.testNotification()
				}
			}

			this.onPermissionChange.dispatch( this.enabled )
			return this.enabled
		} catch ( error ) {
			console.error( 'Toggle notification failed:', error )
			return false
		}
	}

	testNotification() {
		const config = NOTIFICATIONS[NOTIFICATION_IDS.DAILY_REMINDER]
		const message = config.getMessage()
		showNotification( message.title, message.body )
	}

	showResetNotification() {
		showNotification( 'New Week Started!', 'All goals reset. Time to crush this week!' )
	}

	/**
	 * Called when goals are added, removed, or progress changes
	 * Refreshes ALL notifications to reflect current state
	 */
	async onGoalsChanged() {
		if ( !this.enabled ) return

		try {
			await refreshAllNotifications()
		} catch ( error ) {
			console.error( 'Failed to update notifications on goal change:', error )
		}
	}
}

const notificationManager = new NotificationManager()
export default notificationManager
export { NotificationManager }
