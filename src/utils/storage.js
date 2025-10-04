import { Preferences } from '@capacitor/preferences'

const GOALS_KEY = 'weekly_goals'

export const storage = {
	async saveGoals( goals ) {
		try {
			await Preferences.set( {
				key: GOALS_KEY,
				value: JSON.stringify( goals ),
			} )
		} catch ( error ) {
			console.error( 'Failed to save goals:', error )
		}
	},

	async loadGoals() {
		try {
			const { value } = await Preferences.get( { key: GOALS_KEY } )
			return value ? JSON.parse( value ) : null
		} catch ( error ) {
			console.error( 'Failed to load goals:', error )
			return null
		}
	},

	async clearGoals() {
		try {
			await Preferences.remove( { key: GOALS_KEY } )
		} catch ( error ) {
			console.error( 'Failed to clear goals:', error )
		}
	},
}
