import Signal from '../../core/Signal'
import keyboard from './keyboard'
import mouse, { onDown, onLeave, onMove, onUp } from './mouse'

/**
 * Handle swipe gestures
 * also fallback to keyboard for testing
 */
class SwipeManager {
	constructor() {
		this.onSwipe = new Signal()

		this.swipeDistance = 20

		this.swipeStartTime = 0
		this.swipeStartX = 0
		this.swipeStartY = 0
		this.lastMouseX = 0
		this.lastMouseY = 0
		this.lastSwipeTime = 0
		this.moveX = 0
		this.moveY = 0
		this.swiped = false

		// Store handlers for cleanup
		this._onDown = () => {
			this.swipeStartTime = Date.now()
			this.swipeStartX = mouse.x
			this.swipeStartY = mouse.y
			this.lastMouseX = this.swipeStartX
			this.lastMouseY = this.swipeStartY
		}

		this._onMove = () => {
			this.lastMouseX = mouse.x
			this.lastMouseY = mouse.y
			this.moveX = this.lastMouseX - this.swipeStartX
			this.moveY = this.lastMouseY - this.swipeStartY
			this.checkSwipe()
		}

		this._onKey = ( key ) => {
			const swipeMap = {
				'ArrowLeft': 'right',
				'ArrowRight': 'left',
				'ArrowUp': 'top',
				'ArrowDown': 'bottom'
			}
			if ( swipeMap[key] ) {
				this.onSwipe.dispatch( swipeMap[key] )
			}
		}

		// Add listeners
		onDown.add( this._onDown )
		onMove.add( this._onMove )
		keyboard.onDown.add( this._onKey )
		onUp.add( this.onEnd )
		onLeave.add( this.onEnd )
	}

	onEnd = () => {
		this.swiped = false
	}

	checkSwipe = () => {
		if ( this.swiped ) {
			return
		}
		// if (Date.now() - this.swipeStartTime > 6000) {
		// 	return
		// }
		// if (50 > Date.now() - this.lastSwipeTime) {
		// 	return
		// }
		this.lastSwipeTime = Date.now()

		// Minimal swipe distance detection
		const xDiff = this.lastMouseX - this.swipeStartX
		const yDiff = this.lastMouseY - this.swipeStartY
		const angle = Math.atan2( -yDiff, xDiff )

		if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
			if ( xDiff < -this.swipeDistance ) {
				this.swiped = true
				this.onSwipe.dispatch( 'right', angle )
			}
			if ( xDiff > this.swipeDistance ) {
				this.swiped = true
				this.onSwipe.dispatch( 'left', angle )
			}
		} else {
			if ( yDiff < -this.swipeDistance ) {
				this.swiped = true
				this.onSwipe.dispatch( 'top', angle, xDiff, yDiff )
			}
			if ( yDiff > this.swipeDistance ) {
				this.swiped = true
				this.onSwipe.dispatch( 'bottom', angle )
			}
		}
	}

	dispose() {
		// Remove listeners
		onDown.remove( this._onDown )
		onMove.remove( this._onMove )
		keyboard.onDown.remove( this._onKey )
		onUp.remove( this.onEnd )
		onLeave.remove( this.onEnd )
		
		// Dispose signal
		this.onSwipe.dispose()
	}
}

const swipeManager = new SwipeManager()

// Export dispose function for singleton
export const dispose = () => swipeManager.dispose()

export default swipeManager
