import { goals } from '@/store'

import { preferences } from './preferences'

const LAST_RESET_KEY = 'last_weekly_reset'
const WEEKLY_HISTORY_KEY = 'weekly_history'

/**
 * Get the start of the current week (Monday at 00:00:00)
 */
export function getWeekStart( date = new Date() ) {
	const d = new Date( date )
	const day = d.getDay()
	const diff = d.getDate() - day + ( day === 0 ? -6 : 1 ) // adjust when day is sunday
	const monday = new Date( d.setDate( diff ) )
	monday.setHours( 0, 0, 0, 0 )
	return monday
}

/**
 * Check if we need to reset (new week has started)
 */
export async function shouldResetWeek() {
	const lastReset = await preferences.get( LAST_RESET_KEY, null )
	const currentWeekStart = getWeekStart()

	if ( !lastReset ) {
		// First time - save current week and don't reset
		await preferences.set( LAST_RESET_KEY, currentWeekStart.toISOString() )
		return false
	}

	const lastResetDate = new Date( lastReset )
	return currentWeekStart > lastResetDate
}

/**
 * Calculate weekly statistics
 */
export function calculateWeekStats( goalsSnapshot ) {
	const totalTasks = goalsSnapshot.reduce( ( sum, g ) => sum + g.repetitions, 0 )
	const completedTasks = goalsSnapshot.reduce( ( sum, g ) => sum + Math.min( g.progress, g.repetitions ), 0 )
	const completionPercent = totalTasks > 0 ? Math.round( ( completedTasks / totalTasks ) * 100 ) : 0

	return {
		totalTasks,
		completedTasks,
		completionPercent,
		goalCount: goalsSnapshot.length,
	}
}

/**
 * Save current week to history and get recap data
 */
export async function archiveCurrentWeek() {
	const goalsSnapshot = JSON.parse( JSON.stringify( goals.value ) )
	const stats = calculateWeekStats( goalsSnapshot )
	const weekStart = getWeekStart( new Date( Date.now() - 7 * 24 * 60 * 60 * 1000 ) ) // Last week

	const weekData = {
		weekStart: weekStart.toISOString(),
		weekEnd: new Date().toISOString(),
		goals: goalsSnapshot,
		stats,
	}

	// Save to history
	const history = await preferences.get( WEEKLY_HISTORY_KEY, [] )
	history.unshift( weekData ) // Add to beginning

	// Keep only last 12 weeks
	if ( history.length > 12 ) {
		history.splice( 12 )
	}

	await preferences.set( WEEKLY_HISTORY_KEY, history )

	return weekData
}

/**
 * Reset all goals progress to 0
 */
export function resetGoalsProgress() {
	goals.value.forEach( goal => {
		goal.progress = 0
	} )
}

/**
 * Perform the weekly reset
 */
export async function performWeeklyReset() {
	// Archive current week
	const recap = await archiveCurrentWeek()

	// Reset all progress
	resetGoalsProgress()

	// Update last reset date
	const currentWeekStart = getWeekStart()
	await preferences.set( LAST_RESET_KEY, currentWeekStart.toISOString() )

	return recap
}

/**
 * Get last week's recap
 */
export async function getLastWeekRecap() {
	const history = await preferences.get( WEEKLY_HISTORY_KEY, [] )
	return history[0] || null
}

/**
 * Get full weekly history (up to 12 weeks)
 */
export async function getWeeklyHistory() {
	return await preferences.get( WEEKLY_HISTORY_KEY, [] )
}

/**
 * Generate fake recap data for debugging
 */
export function generateFakeRecap() {
	const fakeGoals = [
		{ id: 1, name: 'Exercise', icon: '💪', repetitions: 5, progress: 4, category: 'health' },
		{ id: 2, name: 'Read', icon: '📚', repetitions: 3, progress: 3, category: 'personal' },
		{ id: 3, name: 'Meditate', icon: '🧘', repetitions: 7, progress: 5, category: 'health' },
		{ id: 4, name: 'Code', icon: '💻', repetitions: 5, progress: 2, category: 'work' },
	]

	const stats = calculateWeekStats( fakeGoals )

	return {
		weekStart: getWeekStart( new Date( Date.now() - 7 * 24 * 60 * 60 * 1000 ) ).toISOString(),
		weekEnd: new Date().toISOString(),
		goals: fakeGoals,
		stats,
	}
}
