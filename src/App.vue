<template>
	<div class="view">
		<TinyRouter v-if="basicLoaded" :routes="routes" :redirects="redirects" />
	</div>
</template>

<script>
import { animate, engine } from 'animejs'
import { TinyRouter } from 'vue-tiny-router'
import { loadTranslations } from 'vue-tiny-translation'

import injectFonts from '@/makio/utils/injectFonts'
import { contentLoaded } from '@/store'

import { detectLang } from './makio/utils/detect'

// Configure engine with default settings
engine.timeUnit = 's'

import HomeView from '@/views/HomeView'
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
		await Promise.all( [
			injectFonts(
				[
					// Order optimize for the font use on the home
					{ name: 'Black Han Sans', url: 'fonts/subset-BlackHanSans-Regular', weight: 'normal' },
				],
				true,
			),
			loadTranslations( `translations/${detectLang( ['en', 'fr'] )}.json` ),
		] )
		this.basicLoaded = true
	},
	components: {
		TinyRouter
	}
}
</script>

<style lang="stylus">

:root {
	// Safe Area Inset sent by Webview Custom Code (Android & iOS)
  --webviewt: var(--android-safe-area-inset-top, var(--ios-safe-area-inset-top))
  --webviewb: var(--android-safe-area-inset-bottom, var(--ios-safe-area-inset-bottom))
  --webviewl: var(--android-safe-area-inset-left, var(--ios-safe-area-inset-left))
  --webviewr: var(--android-safe-area-inset-right, var(--ios-safe-area-inset-right))

  --sait: var(--webviewt, env(safe-area-inset-top))
  --saib: var(--webviewb, env(safe-area-inset-bottom))
  --sail: var(--webviewl, env(safe-area-inset-left))
  --sair: var(--webviewr, env(safe-area-inset-right))
}

body, html, #app
	user-select none
	font-display() // define in global.styl
	height 100%
	min-height 100%
	margin 0
	padding 0
	overflow hidden
	scroll-behavior smooth
	@media screen and (prefers-reduced-motion: reduce)
		scroll-behavior: auto

html
	touch-action none // Disable Pinch Zoom
	-webkit-font-smoothing antialiased
	-moz-osx-font-smoothing grayscale
	text-align center
	background #000

	.view
		color #fff
		display flex
		min-height 100%
		flex-direction column
		justify-content center
		align-items center

	.loader
		user-select none
		pointer-events none
		position absolute
		z-index 10000
		top calc(50% - 37px)
		left calc(50% - 37px)
		transition all 1.5s ease
		&.hide
			transform scale(1.2)
			opacity 0

	.three, .pixi
		position absolute
		inset 0
		z-index -1
	//Three canvas under pixi canvas for animation purpose only
	.three
		z-index -2
	.pixi
		opacity 0 // for first transition
</style>
