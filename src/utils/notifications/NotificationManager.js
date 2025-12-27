import Signal from '@/makio/core/Signal'

import { getNotificationIdsForReminderMode, NOTIFICATION_IDS, NOTIFICATIONS, REMINDER_MODES } from './config'
import {
	cancelAllNotifications,
	detectAndStoreTimezone,
	getPermissionStatus,
	getReminderMode,
	refreshAllNotifications,
	requestPermission,
	setNotificationEnabled,
	setReminderMode,
	setupAllNotifications,
	showNotification,
} from './scheduler'

class NotificationManager {
	enabled = false
	permission = 'prompt' // 'granted' | 'denied' | 'prompt'
	mode = REMINDER_MODES.COMPLETE
	onPermissionChange = new Signal()
	_refreshTimer = null

	async init() {
		try {
			this.mode = await getReminderMode()
			this.enabled = this.mode !== REMINDER_MODES.NEVER
			await detectAndStoreTimezone()
			this.permission = await getPermissionStatus()

			if ( this.enabled && this.permission === 'granted' ) {
				const ids = getNotificationIdsForReminderMode( this.mode )
				await setupAllNotifications( ids )
			}
			this._dispatchStatus()
		} catch ( error ) {
			console.error( 'NotificationManager init failed:', error )
		}
	}

	get isActive() {
		return this.enabled && this.permission === 'granted'
	}

	_dispatchStatus() {
		this.onPermissionChange.dispatch( {
			enabled: this.enabled,
			permission: this.permission,
			isActive: this.isActive,
			mode: this.mode,
		} )
	}

	async setMode( mode ) {
		try {
			this.mode = mode
			await setReminderMode( mode )

			if ( mode === REMINDER_MODES.NEVER ) {
				this.enabled = false
				await setNotificationEnabled( false )
				await cancelAllNotifications()
				this._dispatchStatus()
				return this.enabled
			}

			// Turn on reminders (user intent)
			this.enabled = true
			await setNotificationEnabled( true )

			// Ensure we don't keep old schedules around if the mode changes
			await cancelAllNotifications()

			// Permission
			this.permission = await getPermissionStatus()
			let granted = this.permission === 'granted'
			if ( !granted ) {
				granted = await requestPermission()
				this.permission = await getPermissionStatus()
			}

			if ( granted ) {
				const ids = getNotificationIdsForReminderMode( mode )
				await setupAllNotifications( ids )
			}

			this._dispatchStatus()
			return this.enabled
		} catch ( error ) {
			console.error( 'Failed to set reminder mode:', error )
			this._dispatchStatus()
			return this.enabled
		}
	}

	async toggle() {
		// Backward-compatible simple toggle: Complete <-> Never
		const next = this.enabled ? REMINDER_MODES.NEVER : REMINDER_MODES.COMPLETE
		return await this.setMode( next )
	}

	sendTestNotification() {
		const config = NOTIFICATIONS[NOTIFICATION_IDS.DAILY_REMINDER]
		const message = config.getMessage()
		showNotification( message.title, message.body )
	}

	showResetNotification() {
		showNotification( 'New Week Started!', 'All goals reset. Time to crush this week!' )
	}

	_requestDebouncedRefresh( delayMs = 750 ) {
		if ( this._refreshTimer ) {
			clearTimeout( this._refreshTimer )
		}

		this._refreshTimer = setTimeout( async () => {
			this._refreshTimer = null
			if ( !this.isActive ) return

			try {
				const ids = getNotificationIdsForReminderMode( this.mode )
				await refreshAllNotifications( ids )
			} catch ( error ) {
				console.error( 'Failed to refresh notifications:', error )
			}
		}, delayMs )
	}

	/**
	 * Called when goals are added, removed, or progress changes
	 * Refreshes ALL notifications to reflect current state
	 */
	async onGoalsChanged() {
		if ( !this.isActive ) return
		this._requestDebouncedRefresh()
	}
}

const notificationManager = new NotificationManager()
export default notificationManager
export { NotificationManager }
