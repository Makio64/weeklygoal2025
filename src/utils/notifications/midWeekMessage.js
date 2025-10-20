import { LocalNotifications } from '@capacitor/local-notifications'

import { getLargeTasksWithLowProgress } from './utils'

export function getMidWeekEncouragement() {
	const largeTasks = getLargeTasksWithLowProgress()
	if ( largeTasks.length === 0 ) return null

	const task = largeTasks[0]
	const encouragements = [
		`Ready to tackle ${task.icon} ${task.name}? You've got this! 💪`,
		`${task.icon} ${task.name} is waiting for you! Let's make progress today! 🚀`,
		`Time to shine! ${task.icon} ${task.name} - you can do it! ✨`,
		`Hey champion! Ready to work on ${task.icon} ${task.name}? 🔥`,
		`Let's go! ${task.icon} ${task.name} won't complete itself! You've got the power! 💯`,
	]

	return {
		title: 'Midweek Boost! 🌟',
		body: encouragements[Math.floor( Math.random() * encouragements.length )],
		goalId: task.id
	}
}

export async function scheduleMidWeekEncouragement() {
	try {
		const encouragement = getMidWeekEncouragement()
		if ( !encouragement ) return

		const nextWednesday = new Date()
		const dayOfWeek = nextWednesday.getDay()
		const daysUntilWednesday = ( 3 - dayOfWeek + 7 ) % 7 || 7
		nextWednesday.setDate( nextWednesday.getDate() + daysUntilWednesday )
		nextWednesday.setHours( 14, 0, 0, 0 )

		await LocalNotifications.schedule( {
			notifications: [
				{
					id: 4,
					title: encouragement.title,
					body: encouragement.body,
					schedule: {
						at: nextWednesday,
						every: 'week',
					},
				}
			],
		} )
	} catch ( error ) {
		console.error( 'Failed to schedule mid-week encouragement:', error )
	}
}

export async function refreshMidWeekEncouragement() {
	try {
		await LocalNotifications.cancel( { notifications: [{ id: 4 }] } )
		await scheduleMidWeekEncouragement()
	} catch ( error ) {
		console.error( 'Failed to refresh mid-week encouragement:', error )
	}
}
