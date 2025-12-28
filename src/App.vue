<template>
	<div class="view">
		<TinyRouter v-if="basicLoaded" :routes="routes" :redirects="redirects" @route-changed="scrollToTop" />
	</div>
</template>

<script>
import { animate, engine } from 'animejs'
import { TinyRouter } from 'vue-tiny-router'
import { loadTranslations } from 'vue-tiny-translation'

import { contentLoaded } from '@/store'

import { detectLang } from './makio/utils/detect'

// Configure engine with default settings
engine.timeUnit = 's'

import HistoryView from '@/views/HistoryView'
import HomeView from '@/views/HomeView'
import NewGoal from '@/views/NewGoal'
//const HomeView = defineAsyncComponent( () => import( '@/views/HomeView' ) )



export default {
	name: 'App',
	data() {
		return {
			basicLoaded: false,
		}
	},
	computed: {
		routes() {
			return [
				{
					path: '/',
					component: HomeView,
				},
				{
					path: '/new-goal',
					component: NewGoal,
				},
				{
					path: '/history',
					component: HistoryView,
				},
				// {
				// 	path: '/pixi',
				// 	component: defineAsyncComponent( () => import( '@/views/PixiView' ) ),
				// },
			]
		},
		redirects() {
			return {
				'/three': '/'
			}
		},
		contentLoaded() {
			return contentLoaded.value
		},
	},
	watch: {
		contentLoaded( newVal ) {
			if ( newVal ) {
				this.hideInitialLoader()
			}
		}
	},
	methods: {
		scrollToTop() {
			const appElement = document.getElementById( 'app' )
			if ( appElement ) {
				appElement.scrollTo( { top: 0, behavior: 'instant' } )
			}
		},
		hideInitialLoader() {
			const loader = document.getElementById( 'initial-loader' )
			if ( loader ) {
				animate( loader, {
					opacity: [1, 0],
					scale: [1, 1.2],
					duration: 0.4,
					ease: 'easeInOut',
					complete: () => {
						loader.remove()
					}
				} )
			}
		}
	},
	async mounted() {
		// Load important stuff in parallel
		await loadTranslations( `translations/${detectLang( ['en', 'fr'] )}.json` )
		this.basicLoaded = true
	},
	components: {
		TinyRouter
	}
}
</script>

<style lang="stylus">
@font-face
	font-family 'Jost'
	src url('/fonts/Jost-VariableFont_wght.ttf') format('truetype')
	font-weight 100 900
	font-style normal
	font-display swap

:root
	// Capacitor 8 SystemBars injects `--safe-area-inset-*` on Android when WebView env vars are wrong.
	--sait var(--safe-area-inset-top, env(safe-area-inset-top, 0px))
	--saib var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))
	--sail var(--safe-area-inset-left, env(safe-area-inset-left, 0px))
	--sair var(--safe-area-inset-right, env(safe-area-inset-right, 0px))

body, html
	user-select none
	font-display()
	margin 0
	padding 0
	scroll-behavior smooth
	background #F6F7FF

#app
	overflow-y auto
	overflow-x hidden
	padding-bottom var(--saib)
	padding-top var(--sait)
	padding-left var(--sail)
	padding-right var(--sair)

html
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale
	text-align center

	.view
		color #010101
		display flex
		min-height 100%
		flex-direction column
		justify-content flex-start
		align-items center
		background #F6F7FF

	.loader
		user-select none
		pointer-events none
		position absolute
		z-index 10000
		top calc(50% - 37px)
		left calc(50% - 37px)
		transition all 1.5s
		&.hide
			transform scale(1.2)
			opacity 0

	.three, .pixi
		position absolute
		inset 0
		z-index -1

	.three
		z-index -2

	.pixi
		opacity 0
</style>
