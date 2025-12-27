import { goals } from '@/store'

import { getLastWeekRecap } from '../weeklyReset'

// ============================================
// NOTIFICATION IDS - Single source of truth
// ============================================
export const NOTIFICATION_IDS = {
	DAILY_REMINDER: 1,
	MONDAY_MOTIVATION: 2,
	SUNDAY_REFLECTION: 3,
	MIDWEEK_ENCOURAGEMENT: 4,
}

export const ALL_NOTIFICATION_IDS = Object.values( NOTIFICATION_IDS )

// ============================================
// PROGRESS UTILITIES
// ============================================
export function calculateWeeklyProgress() {
	const total = goals.value.reduce( ( sum, g ) => sum + g.repetitions, 0 )
	const done = goals.value.reduce( ( sum, g ) => sum + g.progress, 0 )
	const percent = total ? Math.round( ( done / total ) * 100 ) : 0
	const completed = goals.value.filter( g => g.progress >= g.repetitions ).length

	return { total, done, percent, completed }
}

export function getPendingGoals() {
	return goals.value.filter( g => g.progress < g.repetitions )
}

export function getLargeTasksWithLowProgress() {
	return goals.value.filter( g => g.repetitions >= 3 && g.progress === 0 )
}

// ============================================
// SCHEDULE HELPERS
// ============================================
function getNextDayOfWeek( targetDay, hour, minute ) {
	const date = new Date()
	const currentDay = date.getDay()
	const daysUntil = ( targetDay - currentDay + 7 ) % 7 || 7
	date.setDate( date.getDate() + daysUntil )
	date.setHours( hour, minute, 0, 0 )
	return date
}

const SCHEDULES = {
	DAILY: {
		every: 'day',
		getNextDate: () => {
			const date = new Date()
			date.setDate( date.getDate() + 1 )
			date.setHours( 9, 0, 0, 0 )
			return date
		}
	},
	MONDAY: {
		every: 'week',
		getNextDate: () => getNextDayOfWeek( 1, 7, 0 )
	},
	WEDNESDAY: {
		every: 'week',
		getNextDate: () => getNextDayOfWeek( 3, 14, 0 )
	},
	SUNDAY: {
		every: 'week',
		getNextDate: () => getNextDayOfWeek( 0, 18, 0 )
	},
}

// ============================================
// MESSAGE TEMPLATES
// ============================================
const MONDAY_MESSAGES = [
	count => `New week, new possibilities! You've got ${count} goals to conquer`,
	count => `Fresh start! ${count} goals await your greatness this week`,
	count => `Monday motivation: ${count} goals, unlimited potential! Let's go!`,
	count => `Rise and shine! ${count} opportunities to grow this week`,
	count => `It's Monday! Time to crush those ${count} goals! You've got this!`,
]

const MIDWEEK_MESSAGES = [
	task => `Ready to tackle ${task.icon} ${task.name}? You've got this!`,
	task => `${task.icon} ${task.name} is waiting for you! Let's make progress today!`,
	task => `Time to shine! ${task.icon} ${task.name} - you can do it!`,
	task => `Hey champion! Ready to work on ${task.icon} ${task.name}?`,
	task => `Let's go! ${task.icon} ${task.name} won't complete itself! You've got the power!`,
]

function pickRandom( arr ) {
	return arr[Math.floor( Math.random() * arr.length )]
}

// ============================================
// NOTIFICATION CONFIGURATIONS
// ============================================
export const NOTIFICATIONS = {
	[NOTIFICATION_IDS.DAILY_REMINDER]: {
		id: NOTIFICATION_IDS.DAILY_REMINDER,
		schedule: SCHEDULES.DAILY,
		shouldSchedule: () => true,
		getMessage: () => {
			const { percent } = calculateWeeklyProgress()
			const pending = getPendingGoals()

			if ( pending.length === 0 ) {
				return {
					title: 'WeeklyGoal Reminder',
					body: 'All goals completed this week!',
				}
			}

			const topGoals = pending.slice( 0, 3 ).map( g => `${g.icon} ${g.name}` ).join( ', ' )
			return {
				title: 'WeeklyGoal Reminder',
				body: `${percent}% done! Focus: ${topGoals}`,
			}
		},
	},

	[NOTIFICATION_IDS.MONDAY_MOTIVATION]: {
		id: NOTIFICATION_IDS.MONDAY_MOTIVATION,
		schedule: SCHEDULES.MONDAY,
		shouldSchedule: () => true,
		getMessage: async () => {
			const totalGoals = goals.value.length
			const lastWeek = await getLastWeekRecap()

			if ( lastWeek?.stats ) {
				const { completionPercent, completedTasks, totalTasks } = lastWeek.stats
				return {
					title: 'New Week Started!',
					body: `Last week: ${completionPercent}% complete (${completedTasks}/${totalTasks} tasks). Ready for ${totalGoals} new goals?`,
				}
			}

			const template = pickRandom( MONDAY_MESSAGES )
			return {
				title: 'New Week Started!',
				body: template( totalGoals ),
			}
		},
	},

	[NOTIFICATION_IDS.SUNDAY_REFLECTION]: {
		id: NOTIFICATION_IDS.SUNDAY_REFLECTION,
		schedule: SCHEDULES.SUNDAY,
		shouldSchedule: () => true,
		getMessage: () => {
			const { total, done, percent, completed } = calculateWeeklyProgress()
			const goalCount = goals.value.length

			let body
			if ( percent === 100 ) {
				body = `Perfect week! ${completed}/${goalCount} goals completed (100%)! Time to plan next week's victories!`
			} else if ( percent >= 80 ) {
				body = `Great week! You completed ${done}/${total} tasks (${percent}%)! Plan next week and keep the momentum!`
			} else if ( percent >= 60 ) {
				body = `Good progress! ${done}/${total} tasks done (${percent}%). Reflect and plan for an even better week!`
			} else {
				body = `Week recap: ${done}/${total} tasks (${percent}%). Every week is a fresh start. Plan your comeback!`
			}

			return {
				title: 'Weekly Reflection',
				body,
			}
		},
	},

	[NOTIFICATION_IDS.MIDWEEK_ENCOURAGEMENT]: {
		id: NOTIFICATION_IDS.MIDWEEK_ENCOURAGEMENT,
		schedule: SCHEDULES.WEDNESDAY,
		shouldSchedule: () => getLargeTasksWithLowProgress().length > 0,
		getMessage: () => {
			const largeTasks = getLargeTasksWithLowProgress()
			if ( largeTasks.length === 0 ) return null

			const task = largeTasks[0]
			const template = pickRandom( MIDWEEK_MESSAGES )

			return {
				title: 'Midweek Boost!',
				body: template( task ),
			}
		},
	},
}
