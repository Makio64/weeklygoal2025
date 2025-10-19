<!-- Simple SVGCircle with the possibility to set the percent -->
<template>
	<svg :height="radius * 2" :width="radius * 2">
		<path ref="progress" :stroke-width="strokeWidth" fill="transparent" :stroke="color" class="progress" :d="path" />
	</svg>
</template>

<script>
import { animate, utils } from 'animejs'

export default {
	name: 'SVGCircle',
	props: {
		radius: {
			type: Number,
			default: 16,
		},
		color: {
			type: String,
			default: '#FF5379',
		},
		strokeWidth: {
			type: Number,
			default: 2,
		},
	},
	mounted() {
		// Calculate total path length for stroke animation
		const pathLength = this.$refs.progress.getTotalLength()
		this.$refs.progress.style.strokeDasharray = pathLength
		this.$refs.progress.style.strokeDashoffset = pathLength
	},
	methods: {
		setPercent( value, instant = true ) {
			const pathLength = this.$refs.progress.getTotalLength()
			const offset = pathLength * ( 1 - value / 100 )

			if ( instant ) {
				utils.set( this.$refs.progress, { strokeDashoffset: offset } )
			} else {
				animate( this.$refs.progress, { strokeDashoffset: offset, duration: 0.3, ease: 'outQuad' } )
			}
		},
	},

	computed: {
		path() {
			const r = this.radius - this.strokeWidth
			return `M ${this.radius - r}, ${this.radius} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
		},
	},
}
</script>

<style lang="stylus" scoped>
.percent
	width 46px
	height 46px
	font-family 'Neue Montreal'
	font-weight bold
	font-size 12px
	text-align center
	position absolute
	top 20px
	left 20px
	color #FF5379
	svg
		position absolute
		transform rotate(90deg)
		top 0
		left 0
		&.circle
			opacity 0.4
		&.progress
			opacity 0.6
	&.dark
		.progress
			stroke #FF5379
		color #FF5379
		border-color rgba(1, 1, 1, 0.25)
</style>
