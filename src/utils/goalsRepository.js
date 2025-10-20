import { preferences } from './preferences'

const GOALS_KEY = 'weekly_goals'
const GOALS_VERSION_KEY = 'weekly_goals_version'
const CURRENT_VERSION = 1
const INITIAL_VERSION = 0

const isString = ( value ) => typeof value === 'string'
const isNonNegativeNumber = ( value ) => Number.isFinite( value ) && value >= 0

const isValidGoal = ( goal ) => {
	if ( !goal || typeof goal !== 'object' ) {
		return false
	}

	const { id, name, icon, repetitions, progress } = goal

	return (
		Number.isFinite( id ) &&
		isString( name ) &&
		isString( icon ) &&
		isNonNegativeNumber( repetitions ) &&
		isNonNegativeNumber( progress )
	)
}

const validateGoals = ( goals ) => Array.isArray( goals ) && goals.every( isValidGoal )

const migrateGoals = ( goals, fromVersion ) => {
	// Future migration logic goes here; keep immutable by returning new references when needed
	if ( fromVersion === 0 ) {
		// No changes needed for version 1
	}
	return goals
}

const getDefaultGoals = () => [
	{
		id: 1,
		name: 'Call mom',
		icon: '📞',
		repetitions: 1,
		progress: 0,
	},
]

const readStoredGoals = () =>
	Promise.all( [
		preferences.get( GOALS_KEY, null ),
		preferences.get( GOALS_VERSION_KEY, INITIAL_VERSION ),
	] )

const loadGoals = async () => {
	try {
		const [storedGoals, storedVersion] = await readStoredGoals()

		if ( storedGoals === null ) {
			return getDefaultGoals()
		}

		if ( !validateGoals( storedGoals ) ) {
			console.warn( 'Invalid goals structure detected, resetting to defaults' )
			return getDefaultGoals()
		}

		if ( storedVersion < CURRENT_VERSION ) {
			const migratedGoals = migrateGoals( storedGoals, storedVersion )
			await saveGoals( migratedGoals )
			return migratedGoals
		}

		return storedGoals
	} catch ( error ) {
		console.error( 'Failed to load goals:', error )
		return getDefaultGoals()
	}
}

const saveGoals = async ( goals ) => {
	if ( !validateGoals( goals ) ) {
		console.error( 'Cannot save invalid goals structure' )
		return false
	}

	try {
		const [goalsSaved, versionSaved] = await Promise.all( [
			preferences.set( GOALS_KEY, goals ),
			preferences.set( GOALS_VERSION_KEY, CURRENT_VERSION ),
		] )
		return goalsSaved && versionSaved
	} catch ( error ) {
		console.error( 'Failed to save goals:', error )
		return false
	}
}

const clearGoals = async () => {
	try {
		const [goalsRemoved, versionRemoved] = await Promise.all( [
			preferences.remove( GOALS_KEY ),
			preferences.remove( GOALS_VERSION_KEY ),
		] )
		return goalsRemoved && versionRemoved
	} catch ( error ) {
		console.error( 'Failed to clear goals:', error )
		return false
	}
}

const resetGoals = () => saveGoals( getDefaultGoals() )

export const goalsRepository = {
	load: loadGoals,
	save: saveGoals,
	clear: clearGoals,
	reset: resetGoals,
}
