/**
 * Keyboard signal dispatcher
 * @author David Ronai / @Makio64
 */

import Signal from '../../core/Signal'

const onDown = new Signal()
const onUp = new Signal()

const keyboard = {
	onUp,
	onDown,
	crtlKey: false,
	altKey: false,
}

// Event handler references for cleanup
const _down = ( e ) => {
	keyboard.crtlKey = e.ctrlKey
	keyboard.altKey = e.altKey
	onDown.dispatch( e.key, e )
}

const _up = ( e ) => onUp.dispatch( e.key, e )

window?.addEventListener( 'keydown', _down )
window?.addEventListener( 'keyup', _up )

export function prevent( e ) {
	e.preventDefault()
	e.stopPropagation()
	e.stopImmediatePropagation()
}

// Cleanup function
export const dispose = () => {
	window?.removeEventListener( 'keydown', _down )
	window?.removeEventListener( 'keyup', _up )
	onDown.dispose()
	onUp.dispose()
}

export default keyboard
export { keyboard }
