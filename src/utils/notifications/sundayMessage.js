import { LocalNotifications } from '@capacitor/local-notifications'

import { goals } from '@/store'

import { calculateWeeklyProgress } from './utils'

export function getSundayMessage() {
	const { total, done, percent, completed } = calculateWeeklyProgress()

	if ( percent === 100 ) {
		return `Perfect week! 🏆 ${completed}/${goals.value.length} goals completed (100%)! Time to plan next week's victories!`
	} else if ( percent >= 80 ) {
		return `Great week! You completed ${done}/${total} tasks (${percent}%)! 🎯 Plan next week and keep the momentum!`
	} else if ( percent >= 60 ) {
		return `Good progress! ${done}/${total} tasks done (${percent}%). 📈 Reflect and plan for an even better week!`
	} else {
		return `Week recap: ${done}/${total} tasks (${percent}%). 💭 Every week is a fresh start. Plan your comeback!`
	}
}

export async function scheduleSundayReflection() {
	try {
		const nextSunday = new Date()
		const dayOfWeek = nextSunday.getDay()
		const daysUntilSunday = ( 0 - dayOfWeek + 7 ) % 7 || 7
		nextSunday.setDate( nextSunday.getDate() + daysUntilSunday )
		nextSunday.setHours( 18, 0, 0, 0 )

		await LocalNotifications.schedule( {
			notifications: [
				{
					id: 3,
					title: 'Weekly Reflection 📊',
					body: getSundayMessage(),
					schedule: {
						at: nextSunday,
						every: 'week',
					},
				}
			],
		} )
	} catch ( error ) {
		console.error( 'Failed to schedule Sunday reflection:', error )
	}
}
