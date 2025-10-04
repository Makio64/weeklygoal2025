import { ref, watch } from 'vue'

import { storage } from './utils/storage'

export const contentLoaded = ref( false )

// Goals store
export const goals = ref( [] )
export const weekStartDate = ref( new Date().toISOString() )

// Initialize goals from storage
export async function initializeGoals() {
	const savedGoals = await storage.loadGoals()
	if ( savedGoals !== null ) {
		goals.value = savedGoals
	} else {
		// First time: start with "Call mom" goal
		goals.value = [{ id: 1, name: 'Call mom', icon: '📞', repetitions: 1, progress: 0 },]
		await storage.saveGoals( goals.value )
	}
}

// Watch for changes and save to storage
watch( goals, async ( newGoals ) => {
	await storage.saveGoals( newGoals )
}, { deep: true } )
