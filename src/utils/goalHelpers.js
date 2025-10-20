import { goals, saveGoals } from '@/store'
import notificationManager from '@/utils/notifications'

// Check if goals changed significantly (added/removed/repetitions changed)
export function hasSignificantChange( previousSnapshot ) {
	if ( !previousSnapshot ) return false

	return goals.value.length !== previousSnapshot.length ||
		goals.value.some( ( g ) => {
			const oldGoal = previousSnapshot.find( og => og.id === g.id )
			return !oldGoal || oldGoal.repetitions !== g.repetitions
		} )
}

// Create snapshot of current goals
export function createGoalsSnapshot() {
	return JSON.parse( JSON.stringify( goals.value ) )
}

// Handle goal change with save and notification update (for removing goals)
export async function handleGoalChange( previousSnapshot ) {
	await saveGoals()

	if ( hasSignificantChange( previousSnapshot ) ) {
		await notificationManager.onGoalsChanged()
		return createGoalsSnapshot()
	}

	return previousSnapshot
}

// Save goal and update notifications (for adding new goals)
export async function saveAndNotify() {
	await saveGoals()
	await notificationManager.onGoalsChanged()
}
