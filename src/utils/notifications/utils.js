import { goals } from '@/store'

// Calculate weekly progress statistics
export function calculateWeeklyProgress() {
	const total = goals.value.reduce( ( sum, g ) => sum + g.repetitions, 0 )
	const done = goals.value.reduce( ( sum, g ) => sum + g.progress, 0 )
	const percent = total ? Math.round( ( done / total ) * 100 ) : 0
	const completed = goals.value.filter( g => g.progress >= g.repetitions ).length

	return { total, done, percent, completed }
}

// Get goals that haven't been completed yet
export function getPendingGoals() {
	return goals.value.filter( g => g.progress < g.repetitions )
}

// Get large tasks (≥3 reps) with no progress
export function getLargeTasksWithLowProgress() {
	return goals.value.filter( g => g.repetitions >= 3 && g.progress === 0 )
}
