import { customGoalsRepository } from './utils/customGoalsRepository'
import { goalsRepository } from './utils/goalsRepository'

// Goals store
export const goals = ref( [] )
export const weekStartDate = ref( new Date().toISOString() )
export const swipedGoalId = ref( null )

// Custom goals store (user-created goal templates by category)
export const customGoals = ref( {} )

// Initialize goals from storage
export async function initializeGoals() {
	goals.value = await goalsRepository.load()
}

// Save goals to storage
export async function saveGoals() {
	return await goalsRepository.save( goals.value )
}

// Initialize custom goals from storage
export async function initializeCustomGoals() {
	customGoals.value = await customGoalsRepository.load()
}

// Save custom goals to storage
export async function saveCustomGoals() {
	return await customGoalsRepository.save( customGoals.value )
}

// Add a custom goal to a category
export async function addCustomGoal( categoryId, goal ) {
	if ( !customGoals.value[categoryId] ) {
		customGoals.value[categoryId] = []
	}
	customGoals.value[categoryId].push( goal )
	return await saveCustomGoals()
}
