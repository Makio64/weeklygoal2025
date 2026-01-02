import { preferences } from './preferences'

const CUSTOM_GOALS_KEY = 'custom_goals'

const isString = ( value ) => typeof value === 'string'

const isValidGoal = ( goal ) => {
	if ( !goal || typeof goal !== 'object' ) {
		return false
	}
	return isString( goal.name ) && isString( goal.icon )
}

const isValidCustomGoals = ( customGoals ) => {
	if ( !customGoals || typeof customGoals !== 'object' ) {
		return false
	}
	return Object.values( customGoals ).every(
		goals => Array.isArray( goals ) && goals.every( isValidGoal )
	)
}

const loadCustomGoals = async () => {
	try {
		const stored = await preferences.get( CUSTOM_GOALS_KEY, null )

		if ( stored === null ) {
			return {}
		}

		if ( !isValidCustomGoals( stored ) ) {
			console.warn( 'Invalid custom goals structure, resetting to empty' )
			return {}
		}

		return stored
	} catch ( error ) {
		console.error( 'Failed to load custom goals:', error )
		return {}
	}
}

const saveCustomGoals = async ( customGoals ) => {
	if ( !isValidCustomGoals( customGoals ) ) {
		console.error( 'Cannot save invalid custom goals structure' )
		return false
	}

	try {
		return await preferences.set( CUSTOM_GOALS_KEY, customGoals )
	} catch ( error ) {
		console.error( 'Failed to save custom goals:', error )
		return false
	}
}

export const customGoalsRepository = {
	load: loadCustomGoals,
	save: saveCustomGoals,
}
