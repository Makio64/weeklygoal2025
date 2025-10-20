import { LocalNotifications } from '@capacitor/local-notifications'

import { goals } from '@/store'

export function getMondayMessage() {
	const totalGoals = goals.value.length
	const motivations = [
		`New week, new possibilities! You've got ${totalGoals} goals to conquer 💪`,
		`Fresh start! ${totalGoals} goals await your greatness this week 🚀`,
		`Monday motivation: ${totalGoals} goals, unlimited potential! Let's go! 🔥`,
		`Rise and shine! ${totalGoals} opportunities to grow this week ✨`,
		`It's Monday! Time to crush those ${totalGoals} goals! You've got this! 💯`,
	]
	return motivations[Math.floor( Math.random() * motivations.length )]
}

export async function scheduleMondayMotivation() {
	try {
		const nextMonday = new Date()
		const dayOfWeek = nextMonday.getDay()
		const daysUntilMonday = ( 1 - dayOfWeek + 7 ) % 7 || 7
		nextMonday.setDate( nextMonday.getDate() + daysUntilMonday )
		nextMonday.setHours( 7, 0, 0, 0 )

		await LocalNotifications.schedule( {
			notifications: [
				{
					id: 2,
					title: 'Monday Motivation! 🌟',
					body: getMondayMessage(),
					schedule: {
						at: nextMonday,
						every: 'week',
					},
				}
			],
		} )
	} catch ( error ) {
		console.error( 'Failed to schedule Monday motivation:', error )
	}
}
