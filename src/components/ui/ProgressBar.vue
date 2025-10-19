<!-- Simple ProgressBar -->
<template>
	<div class="progressBar" :style="{ minHeight: hitBox + 'px' }">
		<div ref="container" class="container" :style="{ height: hitBox + 'px', backgroundColor: bgColor }">
			<div ref="progress" class="progress" :style="{ backgroundColor: progressColor }" />
		</div>
	</div>
</template>

<script>
import { animate } from 'animejs'

export default {
	name: 'ProgressBar',
	props: {
		bgColor: {
			type: String,
			default: '#e7e2e3',
		},
		progressColor: {
			type: String,
			default: '#FF5379',
		},
		percent: {
			type: Number,
			default: 0,
		},
		hitBox: {
			type: Number,
			default: 2,
		},
	},
	mounted() {
		this.setPercent( this.percent )
	},
	watch: {
		percent( newVal ) {
			this.setPercent( newVal )
		},
	},
	methods: {
		// value from 0 to 1, 1 stands for 100%
		setPercent( value ) {
			animate( this.$refs.progress, { scaleX: value } )
		},
		show() {
			animate( this.$refs.container, { scaleX: 1, duration: 0.8, ease: 'inOutQuad' } )
		},
		hide() {
			animate( this.$refs.container, { scaleX: 0, duration: 0.5, ease: 'inQuad' } )
		},
	},
}
</script>

<style lang="stylus" scoped>
.progressBar
	width 100%
	.container
		height 100%
		border-radius 7px
		overflow hidden
		transform-origin left center
		will-change transform
		.progress
			height 100%
			will-change transform
			transform scaleX(0)
			transform-origin left center
</style>
