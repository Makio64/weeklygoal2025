import Signal from '@/makio/core/Signal'

import { cancelAllNotifications, setupAllNotifications } from './coordinator'
import { getDailyReminderMessage, refreshDailyReminder } from './dailyMessage'
import { detectAndStoreTimezone, getNotificationEnabled, requestPermission, setNotificationEnabled, showNotification } from './helpers'
import { refreshMidWeekEncouragement } from './midWeekMessage'

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
		showNotification( 'WeeklyGoal Reminder 📋', getDailyReminderMessage() )
	}

	showResetNotification() {
		showNotification( 'New Week Started! 🚀', 'All goals reset. Time to crush this week!' )
	}

	async onGoalsChanged() {
		if ( !this.enabled ) return

		try {
			await refreshDailyReminder()
			await refreshMidWeekEncouragement()
		} catch ( error ) {
			console.error( 'Failed to update notifications on goal change:', error )
		}
	}
}

const notificationManager = new NotificationManager()
export default notificationManager
export { NotificationManager }
