/**
 * Mouse signal dispatcher
 * @author David Ronai / @Makio64
 */

import Signal from '../../core/Signal'
import stage from '../../core/stage'
import { isIOS } from '../detect'

const mouse = {
	isDown: false,
	x: stage.width * 0.5,
	y: stage.height * 0.5,
	moveX: stage.width * 0.5,
	moveY: stage.height * 0.5,
	isMoveX: false,
	isMoveY: false,
	e: null,
	downStart: 0,
	downEnd: 0,
	percentX: 0.5,
	percentY: 0.5,
	normalizedX: 0.0,
	normalizedY: 0.0,
	totalDistance: 0,
}
const prevMouse = { x: mouse.x, y: mouse.y }

const [onDown, onUp, onMove, onClick, onEnter, onLeave] = Array( 6 ).fill().map( () => new Signal() )

function refreshMouseState( e ) {
	Object.assign( mouse, {
		x: e.x,
		y: e.y,
		moveX: e.x - mouse.x,
		moveY: e.y - mouse.y,
		percentX: e.x / stage.width,
		percentY: e.y / stage.height,
		normalizedX: ( e.x / stage.width - 0.5 ) * 2,
		normalizedY: ( e.y / stage.height - 0.5 ) * 2,
		e,
	} )
	if ( !mouse.isMoveX && !mouse.isMoveY ) {
		if ( Math.abs( mouse.moveX ) > Math.abs( mouse.moveY ) && Math.abs( mouse.moveX ) > 15 ) {
			mouse.isMoveX = true
		} else if ( Math.abs( mouse.moveY ) > Math.abs( mouse.moveX ) && Math.abs( mouse.moveY ) > 15 ) {
			mouse.isMoveY = true
		}
	}
	mouse.totalDistance += Math.abs( mouse.moveX ) + Math.abs( mouse.moveY )
	return mouse
}

function clearMouseState() {
	Object.assign( mouse, { isDown: false, moveX: 0, moveY: 0, isMoveX: false, isMoveY: false, downEnd: Date.now() } )
}

// Event handler references for cleanup
let _leave, _start, _move, _end, _touchStart, _gesture, _context, _enter

if ( typeof window !== 'undefined' ) {

	// Prevent zoom on double tap
	_touchStart = ( e ) => {
		if( isIOS && ( e.touches.length > 1 || e.scale !== 1 ) ) {
			e.preventDefault()
		}
	}
	document.addEventListener( 'touchstart', _touchStart, { passive: false } )

	// Prevent zoom on double tap
	_gesture = ( e ) => e.preventDefault()
	document.addEventListener( 'gesturestart', _gesture, { passive: false } )

	// Prevent context menu on long touch on iOs
	_context = ( e ) => e.preventDefault()
	window.addEventListener( 'contextmenu', _context )

	// Fix double click zoom on iOS
	document.ondblclick = ( e ) => e.preventDefault()

	_leave = () => {
		clearMouseState()
		onLeave.dispatch()
	}
	window.addEventListener( 'blur', _leave )
	window.addEventListener( 'pointerleave', _leave )

	// Handle both pointer and touch events
	_start = ( e ) => {
		const x = e.touches ? e.touches[0].clientX : e.x
		const y = e.touches ? e.touches[0].clientY : e.y
		Object.assign( mouse, { isDown: true, downStart: Date.now(), x, y, totalDistance: 0 } )
		onDown.dispatch( refreshMouseState( { x, y } ) )
	}

	_move = ( e ) => {
		const x = e.touches ? e.touches[0].clientX : e.x
		const y = e.touches ? e.touches[0].clientY : e.y
		Object.assign( prevMouse, mouse )
		onMove.dispatch( refreshMouseState( { x, y } ) )
	}

	_end = ( e ) => {
		const x = e.changedTouches ? e.changedTouches[0].clientX : e.x
		const y = e.changedTouches ? e.changedTouches[0].clientY : e.y
		clearMouseState()
		onUp.dispatch( refreshMouseState( { x, y } ) )

		// Handle click detection for both touch and pointer events
		if ( mouse.downEnd - mouse.downStart <= 300 && mouse.totalDistance <= 10 ) {
			onClick.dispatch( refreshMouseState( { x, y } ) )
		}
	}

	// Pointer events
	window.addEventListener( 'pointerdown', _start )
	window.addEventListener( 'pointermove', _move )
	window.addEventListener( 'pointerup', _end )
	window.addEventListener( 'pointercancel', _end )

}

if ( typeof document !== 'undefined' ) {
	_enter = () => {
		clearMouseState()
		onEnter.dispatch()
	}
	document.body.addEventListener( 'pointerenter', _enter )
}

// Cleanup function to remove all event listeners
const dispose = () => {
	// Remove document event listeners
	if ( document ) {
		document.removeEventListener( 'touchstart', _touchStart )
		document.removeEventListener( 'gesturestart', _gesture )
		document.body.removeEventListener( 'pointerenter', _enter )
		document.ondblclick = null
	}
	// Remove window event listeners
	window?.removeEventListener( 'blur', _leave )
	window?.removeEventListener( 'pointerleave', _leave )
	window?.removeEventListener( 'contextmenu', _context )
	window?.removeEventListener( 'pointerdown', _start )
	window?.removeEventListener( 'pointermove', _move )
	window?.removeEventListener( 'pointerup', _end )
	window?.removeEventListener( 'pointercancel', _end )

	// Dispose signals
	onDown.dispose()
	onUp.dispose()
	onMove.dispose()
	onClick.dispose()
	onEnter.dispose()
	onLeave.dispose()
}

export { dispose, mouse, onClick, onDown, onEnter, onLeave, onMove, onUp, prevMouse }
export default mouse
