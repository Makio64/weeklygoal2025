import { Vector3 } from 'three'

import mouse from '@/makio/utils/input/mouse'
import { clamp } from '@/makio/utils/math'

import stage from '../../core/stage'
import pinch from '../../utils/input/pinch'
import wheel from '../../utils/input/wheel'

export default class OrbitControl {
	constructor( camera, radius, target = null, interactionTarget = window ) {
		this.camera = camera

		this.target = target || new Vector3()
		this.targetOffset = new Vector3()

		this.targetLookAt = new Vector3()
		this.cameraOffset = new Vector3()
		this.offset = new Vector3()

		const initialRadius = radius || camera.position.distanceTo( this.target ) || 1
		this.radius = initialRadius
		this._radius = initialRadius
		this.minRadius = 0
		this.maxRadius = Number.MAX_VALUE

		this._isDown = false
		this._vx = 0
		this._vy = 0
		this.speedMax = 1
		this.friction = 0.968
		this.frictionVx = 0.0008
		this.frictionVy = 0.0006

		this._phi = Math.PI * 0.5
		this._theta = Math.PI * 0.5

		this.blockThetaMouse = false
		this.blockPhiMouse = false
		this.blockZoom = false

		this.isPhiRestricted = true
		this.isThetaRestricted = false
		this.minPhi = 0.7
		this.maxPhi = Math.PI * 0.8
		this.minTheta = -1.7
		this.maxTheta = 1.7

		// extra adjustments
		this.extraTheta = 0
		this.extraPhi = 0
		this.extraThetaTarget = 0
		this.extraPhiTarget = 0

		// mouse influence
		this.extraThetaMouse = true
		this.extraPhiMouse = true
		this.extraPhiMin = -0.1
		this.extraPhiMax = 0.1
		this.extraThetaMin = -0.25
		this.extraThetaMax = 0.25

		this.interactionTarget = interactionTarget
		this._pinch = new pinch()
		this.enable()
		this.update()
		this.camera.updateMatrixWorld()
	}

	lock = () => {
		this.blockThetaMouse = true
		this.blockPhiMouse = true
		this.blockZoom = true
		this.extraThetaMouse = false
		this.extraPhiMouse = false
		this.isPhiRestricted = true
		this.isThetaRestricted = true
	}

	update = ( dt = 16 ) => {
		this.extraTheta += ( this.extraThetaTarget - this.extraTheta ) * 0.03 * ( dt / 16 )
		this.extraPhi += ( this.extraPhiTarget - this.extraPhi ) * 0.03 * ( dt / 16 )

		this._vx = clamp( this._vx, -this.speedMax, this.speedMax )
		this._vy = clamp( this._vy, -this.speedMax, this.speedMax )
		this._radius += ( this.radius - this._radius ) * 0.1  * ( dt / 16 )
		this._vx *= this.friction
		this._vy *= this.friction

		this._phi += this._vy
		this._theta += this._vx

		if ( this.isThetaRestricted )
			this._theta = clamp( this._theta, this.minTheta, this.maxTheta )

		if ( this.isPhiRestricted )
			this._phi = clamp( this._phi, this.minPhi, this.maxPhi )

		let phi = this._phi - this.extraPhi * this.extraPhiMax
		let theta = this._theta + this.extraTheta * this.extraThetaMax

		if ( this.isThetaRestricted )
			theta = clamp( theta, this.minTheta, this.maxTheta )

		if ( this.isPhiRestricted )
			phi = clamp( phi, this.minPhi, this.maxPhi )

		this.camera.position.set(
			this.cameraOffset.x + this._radius * Math.sin( phi ) * Math.cos( theta ),
			this.cameraOffset.y + this._radius * Math.cos( phi ),
			this.cameraOffset.z + this._radius * Math.sin( phi ) * Math.sin( theta )
		)

		this.targetLookAt.set(
			this.target.x + this.targetOffset.x,
			this.target.y + this.targetOffset.y,
			this.target.z + this.targetOffset.z
		)
		this.camera.lookAt( this.targetLookAt )
		this.camera.position.add( this.offset )
	}

	_onDown = () => {
		this._isDown = true
	}

	_onUp = () => {
		this._isDown = false
	}

	_onMove = e => {
		if ( e.touches && e.touches.length != 1 ) {
			return
		}

		this.extraThetaTarget = this.extraThetaMouse ? mouse.normalizedX : 0
		if ( this.extraPhiMouse )
			this.extraPhiTarget = mouse.normalizedY
		if ( this._isDown ) {
			if ( !this.blockThetaMouse )
				this._vx += mouse.moveX * this.frictionVx
			if ( !this.blockPhiMouse )
				this._vy -= mouse.moveY * this.frictionVy
		}
	}

	onWheel = e => {
		if ( this.blockZoom ) return
		this.isPinching = true
		e.delta < 0 ? this.zoomOut() : this.zoomIn()
	}

	zoomIn = ( rad = 0.94 ) => {
		this.radius *= rad
		if ( this.radius < this.minRadius )
			this.radius = this.minRadius
	}

	zoomOut = ( rad = 1.06 ) => {
		this.radius *= rad
		if ( this.radius > this.maxRadius )
			this.radius = this.maxRadius
	}

	onPinchIn = () => {
		if ( this.blockZoom ) return
		this.isPinching = true
		this.zoomOut( 1.02 )
	}

	onPinchOut = () => {
		if ( this.blockZoom ) return
		this.isPinching = true
		this.zoomIn( 0.98 )
	}

	enable() {
		this._pinch.enable()
		this.interactionTarget.addEventListener( 'pointerdown', this._onDown )
		this.interactionTarget.addEventListener( 'pointerup', this._onUp )
		this.interactionTarget.addEventListener( 'pointermove', this._onMove )
		wheel.add( this.onWheel )
		this._pinch.onPinchIn.add( this.onPinchIn )
		this._pinch.onPinchOut.add( this.onPinchOut )
		stage.onUpdate.add( this.update )
	}

	disable() {
		console.log( 'disable' )
		this._pinch.disable()
		this.interactionTarget.removeEventListener( 'pointerdown', this._onDown )
		this.interactionTarget.removeEventListener( 'pointerup', this._onUp )
		this.interactionTarget.removeEventListener( 'pointermove', this._onMove )
		wheel.remove( this.onWheel )
		this._pinch.onPinchIn.remove( this.onPinchIn )
		this._pinch.onPinchOut.remove( this.onPinchOut )
		stage.onUpdate.remove( this.update )
	}

	dispose = () => {
		this.disable()
		this._pinch.dispose()
		this._pinch = null
		this.camera = null
		this.target = null
		this.offset = null
		this.targetOffset = null
		this.targetLookAt = null
	}
}

export { OrbitControl }
