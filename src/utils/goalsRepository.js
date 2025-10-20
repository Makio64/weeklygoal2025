import { preferences } from './preferences'

const GOALS_KEY = 'weekly_goals'
const GOALS_VERSION_KEY = 'weekly_goals_version'
const CURRENT_VERSION = 1

function isValidGoal( goal ) {
	return (
		goal &&
		typeof goal === 'object' &&
		typeof goal.id === 'number' &&
		typeof goal.name === 'string' &&
		typeof goal.icon === 'string' &&
		typeof goal.repetitions === 'number' &&
		typeof goal.progress === 'number' &&
		goal.repetitions >= 0 &&
		goal.progress >= 0
	)
}

function validateGoals( goals ) {
	if ( !Array.isArray( goals ) ) {
		return false
	}
	return goals.every( isValidGoal )
}

function migrateGoals( goals, fromVersion ) {
	// Future migration logic goes here
	// Example: if (fromVersion < 2) { /* add new fields */ }
	if( fromVersion === 0 ) {
		// No changes needed for version 1
	}
	return goals
}

function getDefaultGoals() {
	return [
		{
			id: 1,
			name: 'Call mom',
			icon: '📞',
			repetitions: 1,
			progress: 0,
		},
	]
}

export const goalsRepository = {

	async load() {
		try {
			const goals = await preferences.get( GOALS_KEY, null )
			const version = await preferences.get( GOALS_VERSION_KEY, 0 )

			// First time user - return defaults
			if ( goals === null ) {
				return getDefaultGoals()
			}

			// Validate goals structure
			if ( !validateGoals( goals ) ) {
				console.warn( 'Invalid goals structure detected, resetting to defaults' )
				return getDefaultGoals()
			}

			// Migrate if needed
			if ( version < CURRENT_VERSION ) {
				const migratedGoals = migrateGoals( goals, version )
				await this.save( migratedGoals ) // Save migrated version
				return migratedGoals
			}

			return goals
		} catch ( error ) {
			console.error( 'Failed to load goals:', error )
			return getDefaultGoals()
		}
	},

	async save( goals ) {
		if ( !validateGoals( goals ) ) {
			console.error( 'Cannot save invalid goals structure' )
			return false
		}

		try {
			const goalsSuccess = await preferences.set( GOALS_KEY, goals )
			const versionSuccess = await preferences.set( GOALS_VERSION_KEY, CURRENT_VERSION )
			return goalsSuccess && versionSuccess
		} catch ( error ) {
			console.error( 'Failed to save goals:', error )
			return false
		}
	},

	async clear() {
		try {
			const goalsSuccess = await preferences.remove( GOALS_KEY )
			const versionSuccess = await preferences.remove( GOALS_VERSION_KEY )
			return goalsSuccess && versionSuccess
		} catch ( error ) {
			console.error( 'Failed to clear goals:', error )
			return false
		}
	},

	async reset() {
		const defaults = getDefaultGoals()
		return await this.save( defaults )
	},
}
