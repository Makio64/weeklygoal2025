import Signal from '../../core/Signal'
import stage from '../../core/stage'
import { mouse, onClick, onMove } from '../input/mouse'

/**
 * Inativity detector - detects inactivity of the user
 * @author David Ronai | @Makio64
 */
export default class InactivityDetector {

	constructor( duration, wheel ) {
		this.isInactive = false
		this.duration = duration
		this.inactiveTime = 0
		this.lastAction = ''
		this.onInactive = new Signal()

		// Store handler for cleanup
		this._onMove = () => {
			if ( mouse.isDown ) {
				this.reset()
			}
		}

		onMove.add( this._onMove )
		onClick.add( this.reset )
		if ( wheel ) {
			this.wheel = wheel
			wheel.add( this._onWheel )
		}

		stage.onUpdate.add( this.update )
	}

	update = ( dt ) => {
		if ( mouse.isDown ) {
			this.reset()
			return
		}
		this.inactiveTime += dt
		const last = this.isInactive
		this.isInactive = this.inactiveTime >= this.duration

		if ( last !== this.isInactive && this.isInactive ) {
			this.onInactive.dispatch()
		}
	}

	reset = () => {
		this.lastAction = 'mouse'
		this.inactiveTime = 0
	}

	_onWheel = () => {
		this.reset()
		this.lastAction = 'wheel'
	}

	dispose = () => {
		this.wheel?.remove( this._onWheel )
		onMove.remove( this._onMove )
		onClick.remove( this.reset )
		stage.onUpdate.remove( this.update )
		this.onInactive.dispose()
	}
}

export { InactivityDetector }
