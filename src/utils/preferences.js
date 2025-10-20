import { Preferences } from '@capacitor/preferences'

/**
 * Generic wrapper for Capacitor Preferences API with error handling
 * and type safety
 */
export const preferences = {

	async set( key, value ) {
		try {
			await Preferences.set( {
				key,
				value: JSON.stringify( value ),
			} )
			return true
		} catch ( error ) {
			console.error( `Failed to set preference "${key}":`, error )
			return false
		}
	},

	async get( key, defaultValue = null ) {
		try {
			const { value } = await Preferences.get( { key } )
			if ( value === null || value === undefined ) {
				return defaultValue
			}
			return JSON.parse( value )
		} catch ( error ) {
			console.error( `Failed to get preference "${key}":`, error )
			return defaultValue
		}
	},

	async remove( key ) {
		try {
			await Preferences.remove( { key } )
			return true
		} catch ( error ) {
			console.error( `Failed to remove preference "${key}":`, error )
			return false
		}
	},

	async clear() {
		try {
			await Preferences.clear()
			return true
		} catch ( error ) {
			console.error( 'Failed to clear preferences:', error )
			return false
		}
	},

	async keys() {
		try {
			const { keys } = await Preferences.keys()
			return keys
		} catch ( error ) {
			console.error( 'Failed to get preference keys:', error )
			return []
		}
	},
}
