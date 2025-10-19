<!-- Modern Button Style by @makio64 -->
<template>
	<div class="GradientButton" :class="{ isFull, red: color == 'red', blue: color == 'blue' }">
		<a v-if="href != ''" :href="href" target="_blank" rel="noopener noreferrer">
			<slot />
		</a>
		<span v-else>
			<slot />
		</span>
	</div>
</template>

<script>
import { animate, utils } from 'animejs'
export default {
	name: 'GradientButton',
	props: {
		color: {
			type: String,
			default: 'blue',
		},
		href: {
			type: String,
			default: '',
		},
		isFull: {
			type: Boolean,
			default: false,
		},
		showAuto: {
			type: Boolean,
			default: true,
		},
	},
	mounted() {
		if ( this.showAuto ) {
			this.show()
		} else {
			utils.set( this.$el, { opacity: 0 } )
		}
	},
	methods: {
		show() {
			animate( this.$el, { opacity: { from: 0 }, translateY: { from: 20 }, delay: 0.1, duration: 0.5, ease: 'outQuad' } )
		},
		hide() {
			animate( this.$el, { opacity: 0, translateY: -20, duration: 0.5, ease: 'outQuad' } )
		},
	},
}
</script>

<style lang="stylus" scoped>
.GradientButton
	text-align center
	cursor pointer

	a,span
		text-decoration none
		display inline-block
		color #0097FE
		font-family 'Neue Montreal'
		font-size 15px
		font-weight 400
		line-height 18px
		text-align center
		background #fff
		background-clip padding-box
		border solid 2px transparent
		border-radius 40px
		padding 9px 20px 11px
		position relative

		&:before
			content ''
			position absolute
			inset 0
			background linear-gradient(100.57deg, rgba(0, 151, 254, 0.6), rgba(0, 151, 254, 1))
			z-index -1
			margin -2px
			border-radius inherit

	&.red
		a,span
			color #2E2E2E
			&:before
				background linear-gradient(100.57deg, rgba(255, 83, 121, 0.5), rgba(255, 83, 121, 1))

	&.isFull
		a,span
			color #fff
			background linear-gradient(180deg, rgba(0, 151, 254, 0.7) 0%, #0097FE 100%)
		&.red
			a,span
				background linear-gradient(180deg, rgba(255, 83, 121, 0.7) 0%, #FF5379 100%)
</style>
