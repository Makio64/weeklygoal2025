import { animate, stagger } from 'animejs'

export const animateIn = ( el ) => {
	if ( !el || !el.children.length ) return
	const targets = el.children
	// Initial state setup is handled by the animation 'from' values
	// Note: engine.timeUnit is set to 's' in App.vue, so durations are in seconds
	animate( targets, {
		opacity: [0, 1],
		translateY: [20, 0],
		delay: stagger( 0.05, { start: 0.05 } ), // 50ms stagger, 100ms start delay
		duration: 0.4,
		easing: 'outCubic'
	} )
}

export const animateOut = ( el, done ) => {
	if ( !el || !el.children || el.children.length === 0 ) {
		done()
		return
	}
	const targets = el.children
	animate( targets, {
		opacity: 0,
		translateY: -20,
		delay: stagger( 0.05 ),
		duration: 0.2,
		easing: 'inOutQuad',
		onComplete: done
	} )
}
