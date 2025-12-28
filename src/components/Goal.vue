<template>
	<div class="Goal" :class="{ swiped, transitioning: isTransitioning, swiping: isSwiping }">
		<div v-if="categoryColor" class="categoryIndicator" :style="{ backgroundColor: categoryColor }" />
		<div ref="content" class="goalContent" :style="dragStyle">
			<div class="iconName">
				<span class="icon">{{ icon }}</span>
				<span class="name">{{ name }}</span>
			</div>
			<div class="checks">
				<CheckGoal
					v-for="i in repetitions"
					:key="i"
					:done="i <= progress"
					@click.stop="handleCheckClick(i)"
				/>
			</div>
		</div>
		<div class="progressBar" :style="dragStyle">
			<div class="progressFill" :style="{ width: (progress / repetitions * 100) + '%' }" />
		</div>
		<div class="actions">
			<button class="edit" @click.stop="handleEditClick">
				<img src="/img/edit.png" alt="edit">
			</button>
			<button class="remove" @click.stop="handleRemoveClick">
				<img src="/img/bin.png" alt="delete">
			</button>
		</div>
	</div>
</template>

<script>
import categoriesGoals from '@/data/categories-goals.json'
import { swipedGoalId } from '@/store'

const ACTION_BUTTON_WIDTH = 60
const ACTION_BUTTON_COUNT = 2
const MAX_OPEN_X = -( ACTION_BUTTON_WIDTH * ACTION_BUTTON_COUNT )
const DIRECTION_SLOP_PX = 8
const OPEN_THRESHOLD = 0.5
const FLICK_VELOCITY_PX_PER_MS = 0.6

export default {
	name: 'Goal',
	emits: ['update', 'edit', 'remove'],
	props: {
		id: { type: [Number, String], required: true },
		name: String,
		icon: { type: String, default: '📝' },
		category: String,
		repetitions: { type: Number, default: 5 },
		progress: { type: Number, default: 0 },
	},
	data() {
		return {
			swiped: false,
			isTransitioning: false,
			isSwiping: false,
			dragX: 0,

			// gesture state
			startX: 0,
			startY: 0,
			dragStartX: 0,
			lockDirection: null, // 'horizontal' | 'vertical' | null
			isPointerDown: false,
			pointerId: null,

			// velocity estimate
			lastMoveX: 0,
			lastMoveT: 0,
			velocityX: 0,

			transitionTimer: null,
		}
	},
	computed: {
		categoryColor() {
			if ( !this.category ) return null
			const cat = categoriesGoals.find( c => c.id === this.category )
			return cat ? cat.color : null
		},
		dragStyle() {
			return { transform: `translateX(${this.dragX}px)` }
		},
		currentSwipedId() {
			return swipedGoalId.value
		}
	},
	watch: {
		// When another goal is swiped, close this one
		currentSwipedId( newId ) {
			if ( newId !== this.id && this.swiped ) {
				this.closeSwipe()
			}
		}
	},
	mounted() {
		this.$el.addEventListener( 'pointerdown', this.handlePointerDown, { passive: true } )
		this.$el.addEventListener( 'pointermove', this.handlePointerMove, { passive: false } )
		this.$el.addEventListener( 'pointerup', this.handlePointerUp, { passive: true } )
		this.$el.addEventListener( 'pointercancel', this.handlePointerUp, { passive: true } )
	},
	beforeUnmount() {
		if ( this.transitionTimer ) clearTimeout( this.transitionTimer )
		
		this.$el.removeEventListener( 'pointerdown', this.handlePointerDown )
		this.$el.removeEventListener( 'pointermove', this.handlePointerMove )
		this.$el.removeEventListener( 'pointerup', this.handlePointerUp )
		this.$el.removeEventListener( 'pointercancel', this.handlePointerUp )

		if ( swipedGoalId.value === this.id ) {
			swipedGoalId.value = null
		}
	},
	methods: {
		handleCheckClick( checkIndex ) {
			if ( this.swiped ) {
				this.closeSwipe()
				return
			}
			this.$emit( 'update', checkIndex <= this.progress ? checkIndex - 1 : checkIndex )
		},

		setTransitioning( enabled ) {
			this.isTransitioning = enabled
			if ( this.transitionTimer ) {
				clearTimeout( this.transitionTimer )
				this.transitionTimer = null
			}
			if ( enabled ) {
				this.transitionTimer = setTimeout( () => {
					this.isTransitioning = false
					this.transitionTimer = null
				}, 220 )
			}
		},
		snapTo( x ) {
			this.setTransitioning( true )
			this.dragX = x
		},
		openSwipe() {
			this.swiped = true
			this.snapTo( MAX_OPEN_X )
			swipedGoalId.value = this.id
		},
		closeSwipe() {
			this.swiped = false
			this.snapTo( 0 )
			if ( swipedGoalId.value === this.id ) {
				swipedGoalId.value = null
			}
		},

		handlePointerDown( e ) {
			if ( e.target.closest( '.actions' ) ) return
			if ( e.pointerType === 'mouse' && e.button !== 0 ) return

			this.isPointerDown = true
			this.pointerId = e.pointerId
			this.startX = e.clientX
			this.startY = e.clientY
			this.dragStartX = this.dragX
			this.lockDirection = null
			this.velocityX = 0
			this.lastMoveX = e.clientX
			this.lastMoveT = performance.now()

			this.setTransitioning( false )
		},

		handlePointerMove( e ) {
			if ( !this.isPointerDown || e.pointerId !== this.pointerId ) return

			const dx = e.clientX - this.startX
			const dy = e.clientY - this.startY

			if ( !this.lockDirection ) {
				if ( Math.abs( dx ) < DIRECTION_SLOP_PX && Math.abs( dy ) < DIRECTION_SLOP_PX ) return
				this.lockDirection = Math.abs( dx ) > Math.abs( dy ) ? 'horizontal' : 'vertical'
				
				if ( this.lockDirection === 'horizontal' ) {
					// Lock global state immediately to close others
					swipedGoalId.value = this.id
					this.isSwiping = true
					try {
						this.$el.setPointerCapture( e.pointerId )
					} catch {
						// ignore
					}
				}
			}

			if ( this.lockDirection !== 'horizontal' ) return

			// IMPORTANT for iOS: prevent default to stop overscroll/refresh
			if ( e.cancelable ) e.preventDefault()

			let nextX = this.dragStartX + dx
			if ( nextX > 0 ) nextX *= 0.35
			else if ( nextX < MAX_OPEN_X ) nextX = MAX_OPEN_X + ( nextX - MAX_OPEN_X ) * 0.35
			
			this.dragX = Math.min( 30, Math.max( MAX_OPEN_X - 30, nextX ) )

			const now = performance.now()
			const dt = now - this.lastMoveT
			if ( dt > 0 ) this.velocityX = ( e.clientX - this.lastMoveX ) / dt
			this.lastMoveX = e.clientX
			this.lastMoveT = now
		},

		handlePointerUp( e ) {
			if ( !this.isPointerDown || e.pointerId !== this.pointerId ) return
			this.isPointerDown = false
			this.isSwiping = false

			try {
				this.$el.releasePointerCapture( e.pointerId )
			} catch {
				// ignore
			}

			if ( this.lockDirection !== 'horizontal' ) return

			const openByDistance = this.dragX <= MAX_OPEN_X * OPEN_THRESHOLD
			const openByFlick = this.velocityX <= -FLICK_VELOCITY_PX_PER_MS
			const closeByFlick = this.velocityX >= FLICK_VELOCITY_PX_PER_MS

			if ( openByFlick || ( openByDistance && !closeByFlick ) ) {
				this.openSwipe()
			} else {
				this.closeSwipe()
			}
		},

		handleEditClick() {
			this.closeSwipe()
			this.$emit( 'edit' )
		},
		handleRemoveClick() {
			this.closeSwipe()
			this.$emit( 'remove' )
		},
	},
}
</script>

<style lang="stylus" scoped>
.Goal
	position relative
	display flex
	flex-direction column
	background #F0F1F8
	border 1px solid #F3F3FF
	border-radius 6px
	overflow hidden
	user-select none
	cursor pointer
	height 54px
	touch-action pan-y

	&.swiping
		touch-action none

	.categoryIndicator
		position absolute
		left 0
		top 0
		bottom 0
		width 3px
		z-index 3

	.goalContent
		flex 1
		padding 0 16px
		display flex
		justify-content space-between
		align-items center
		background #F0F1F8
		z-index 2
		border-radius 6px 6px 0 0
		margin-right -2px
		will-change transform

	&.transitioning .goalContent,
	&.transitioning .progressBar
		transition transform 0.22s ease-out

	.iconName
		display flex
		align-items center
		gap 16px
		flex 1
		min-width 0

		.icon
			font-size 20px
			flex-shrink 0
			pointer-events none

		.name
			font-family 'Jost', sans-serif
			font-size 16px
			line-height 16px
			color #000
			overflow hidden
			text-overflow ellipsis
			white-space nowrap
			pointer-events none

	.checks
		display flex
		gap 10px
		flex-shrink 0
		margin-left 8px

	.progressBar
		width 100%
		height 6px
		background #E2E4F0
		border-radius 0 0 6px 6px
		overflow hidden
		z-index 1
		margin-right -2px
		will-change transform

		.progressFill
			height 100%
			background #5D73E7
			border-radius 6px
			transition width 0.3s

	.actions
		position absolute
		right 0
		top 0
		bottom 0
		display flex
		z-index 0
		border-radius 0 6px 6px 0
		overflow hidden

		button
			width 60px
			border none
			cursor pointer
			transition all 0.2s
			height 100%
			background #FFF
			display flex
			align-items center
			justify-content center

			&:active
				opacity 0.8

			&.edit
				border-right 1px solid #E2E4F0

			&.remove
				border-radius 0 6px 6px 0

			img
				width 12px
				height 12px
</style>
