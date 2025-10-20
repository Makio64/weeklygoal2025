import Signal from './makio/core/Signal'
import { goalsRepository } from './utils/goalsRepository'

export const contentLoaded = ref( false )

// Goals store
export const goals = ref( [] )
export const weekStartDate = ref( new Date().toISOString() )
export const goalSwiped = new Signal()

// Initialize goals from storage
export async function initializeGoals() {
	goals.value = await goalsRepository.load()
}

// Save goals to storage
export async function saveGoals() {
	return await goalsRepository.save( goals.value )
}
