import { LocalNotifications } from '@capacitor/local-notifications'

import { scheduleDailyReminder } from './dailyMessage'
import { scheduleMidWeekEncouragement } from './midWeekMessage'
import { scheduleMondayMotivation } from './mondayMessage'
import { scheduleSundayReflection } from './sundayMessage'

export async function cancelAllNotifications() {
	try {
		await LocalNotifications.cancel( {
			notifications: [
				{ id: 1 },
				{ id: 2 },
				{ id: 3 },
				{ id: 4 }
			]
		} )
	} catch ( error ) {
		console.error( 'Failed to cancel notifications:', error )
	}
}

export async function setupAllNotifications() {
	await cancelAllNotifications()
	await scheduleDailyReminder()
	await scheduleMondayMotivation()
	await scheduleSundayReflection()
	await scheduleMidWeekEncouragement()
}
