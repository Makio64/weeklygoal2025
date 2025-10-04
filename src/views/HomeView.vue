<template>
	<div class="HomeView view">
		<div ref="title" class="title">{{ $t('title') }}</div>
		<div ref="subtitle" class="subtitle">{{ $t('subtitle') }}</div>
	</div>
</template>

<script>
import { stagger, utils, waapi } from 'animejs'

import { contentLoaded } from '@/store'

export default {
	name: 'HomeView',
	async mounted() {
		utils.set( this.elts, { opacity: 0 } )

		contentLoaded.value = true
		this.transitionIn()
		const { default: Manager3D } = await import( '@/3d/Manager3D' )
		this.Manager3D = Manager3D
		await this.Manager3D.init()
		Manager3D.show()
	},
	computed: {
		elts() {
			return [this.$refs.title, this.$refs.subtitle]
		},
	},
	methods: {
		async transitionIn() {
			waapi.animate( this.elts, { opacity: [0.001, 1], translateY: [50, 0], duration: 0.7, delay: stagger( 0.1 ), ease: 'outQuad' } )
		},
		transitionOut( cb ) {
			waapi.animate( this.elts, { opacity: 0.001, y: -50, duration: 0.5, delay: stagger( 0.05 ), ease: 'inQuad' } )
			this.Manager3D?.hide( cb )
		},
		beforeRouteLeave( next ) {
			this.transitionOut( next )
		},
	},
}
</script>

<style lang="stylus" scoped>
.HomeView
	.title
		font-size 3rem
	.subtitle
		font-size 1.5rem
	.bottom
		position absolute
		bottom 20px
		left 0
		right 0
</style>
