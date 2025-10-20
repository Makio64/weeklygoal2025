import { LocalNotifications } from '@capacitor/local-notifications'

import { calculateWeeklyProgress, getPendingGoals } from './utils'

export function getDailyReminderMessage() {
	const { percent } = calculateWeeklyProgress()
	const pending = getPendingGoals()

	if ( pending.length === 0 ) {
		return '🎉 All goals completed this week!'
	}

	const topGoals = pending.slice( 0, 3 ).map( g => `${g.icon} ${g.name}` ).join( ', ' )
	return `${percent}% done! Focus: ${topGoals}`
}

export async function scheduleDailyReminder() {
	try {
		const tomorrow9am = new Date()
		tomorrow9am.setDate( tomorrow9am.getDate() + 1 )
		tomorrow9am.setHours( 9, 0, 0, 0 )

		await LocalNotifications.schedule( {
			notifications: [
				{
					id: 1,
					title: 'WeeklyGoal Reminder 📋',
					body: getDailyReminderMessage(),
					schedule: {
						at: tomorrow9am,
						every: 'day',
					},
				}
			],
		} )
	} catch ( error ) {
		console.error( 'Failed to schedule daily reminder:', error )
	}
}

export async function refreshDailyReminder() {
	try {
		await LocalNotifications.cancel( { notifications: [{ id: 1 }] } )
		await scheduleDailyReminder()
	} catch ( error ) {
		console.error( 'Failed to refresh daily reminder:', error )
	}
}
